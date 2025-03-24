import { ConfigService } from '@nestjs/config';
import { Course } from './entities/course.entity';
import { CourseAssistantService } from '../course-assistant/course-assistant.service';
import { CoursePage } from './entities/course-page.entity';
import { CoursePagesRepository } from './course-pages.repository';
import { CoursesRepository } from './courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateCoursePageDto } from './dto/create-course-page.dto';
import { FileService } from './file.service';
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { plainToClass } from '@nestjs/class-transformer';

@Injectable()
export class CoursesService {
  constructor(
    private configService: ConfigService,
    private courseAssistantService: CourseAssistantService,
    private readonly coursesRepository: CoursesRepository,
    private readonly coursePagesRepository: CoursePagesRepository,
    private readonly fileService: FileService
  ) {}

  async create({ sourceId }): Promise<Course> {
    const data = await this.fileService.getJsonData(`${sourceId}/index.json`);
    const imageUrl: string | null =
      data.meta.posterImage?.key?.split('repository/')[1];
    const courseDto: CreateCourseDto = this.getCourseDto(data);
    const course: Course = this.coursesRepository.create(courseDto);
    const pageDtos: CreateCoursePageDto[] = await this.getPagesDto(
      data,
      course
    );
    const pages: CoursePage[] = pageDtos.map((dto: CreateCoursePageDto) =>
      this.coursePagesRepository.create(dto)
    );
    const assetPaths: string[] = this.getAssetPaths(pages);
    if (imageUrl) assetPaths.push(imageUrl);
    const file: OpenAI.Beta.VectorStores.VectorStoreFile =
      await this.courseAssistantService.uploadFile(
        this.getCourseAsText(course, pages),
        `imported_${course.name}.html`
      );
    course.vectorStoreFileId = file.id;
    await this.fileService.transferAssets(assetPaths);
    await this.coursesRepository.flush();
    await this.coursePagesRepository.flush();
    return course;
  }

  getCatalog(): Promise<object> {
    return this.fileService.getJsonData('index.json');
  }

  getAssetUrl(path): Promise<string> {
    return this.fileService.getAssetUrl(path);
  }

  findAll(): Promise<Course[]> {
    return this.coursesRepository.findAll();
  }

  async findPage(id: number, courseId: number): Promise<CoursePage> {
    const course: Course = await this.findOne(courseId);
    return this.coursePagesRepository.findOne({ sourceId: id, course });
  }

  async remove(id: number): Promise<number> {
    const course = await this.coursesRepository.findOne({ id });
    await this.coursePagesRepository.nativeDelete({ course });
    await this.courseAssistantService.deleteFile(course);
    return this.coursesRepository.nativeDelete({ id });
  }

  private findOne(id: number): Promise<Course> {
    return this.coursesRepository.findOne({ id });
  }

  private getAssetPaths(pages): string[] {
    return pages
      .flatMap((page) =>
        page.elements.map((element) => element.data?.assets?.url)
      )
      .filter((page) => page)
      .map((url: string) => url.split('repository/')[1]);
  }

  private getCourseDto(data): CreateCourseDto {
    const dto: CreateCourseDto = plainToClass(CreateCourseDto, data);
    dto.sourceId = data.id;
    return dto;
  }

  private getPagesDto(data, course): Promise<CreateCoursePageDto[]> {
    const containerIds: string[] = data.structure.flatMap((it) => {
      return it.contentContainers.map(({ id }) => id);
    });
    return Promise.all(
      containerIds.map(async (containerId: string) => {
        const pageData = await this.fileService.getJsonData(
          `${course.sourceId}/${containerId}.container.json`
        );
        const dto: CreateCoursePageDto = plainToClass(
          CreateCoursePageDto,
          pageData
        );
        dto.sourceId = pageData.id;
        dto.course = course;
        return dto;
      })
    );
  }

  private getCourseAsText(course, pages): string {
    let text: string = `
      <h1>${course.name}</h1>
      <p>${course.description}<p>
    `;
    course.structure.forEach((it) => {
      const containerIds: string[] = it.contentContainers.map((cc) => cc.id);
      const containers: CoursePage[] = pages.filter((page) => {
        return containerIds.includes(page.sourceId);
      });
      const tag: string = it.parentId ? 'h3' : 'h2';
      text += `<${tag}>${it.meta?.name}</${tag}>`;
      containers.forEach((page) => {
        return page.elements.forEach((element: any) => {
          if (element.type === 'CE_HTML_DEFAULT') {
            text += element.data?.content || '';
          } else if (element.type === 'CE_IMAGE') {
            text += element.data?.alt || '';
          }
        });
      });
    });
    return text;
  }
}
