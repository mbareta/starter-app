import { CoursePagesRepository } from './course-pages.repository';
import { CoursesRepository } from './courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateCoursePageDto } from './dto/create-course-page.dto';
import { FileService } from './file.service';
import { Injectable } from '@nestjs/common';
import { plainToClass } from '@nestjs/class-transformer';

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly coursePagesRepository: CoursePagesRepository,
    private readonly fileService: FileService
  ) {}

  private getCourseDto(data): CreateCourseDto {
    const dto = plainToClass(CreateCourseDto, data);
    dto.sourceId = data.id;
    return dto;
  }

  private getPagesDto(data, course): Promise<CreateCoursePageDto[]> {
    const containerIds = data.structure.flatMap((it) => {
      return it.contentContainers.map(({ id }) => id);
    });
    return Promise.all(
      containerIds.map(async (containerId) => {
        const pageData = await this.fileService.getJsonData(
          `${course.sourceId}/${containerId}.container.json`
        );
        const dto = plainToClass(CreateCoursePageDto, pageData);
        dto.sourceId = pageData.id;
        dto.course = course;
        return dto;
      })
    );
  }

  private getAssetPaths(pages) {
    return pages
      .flatMap((page) =>
        page.elements.map((element) => element.data?.assets?.url)
      )
      .filter((page) => page)
      .map((url) => url.split('repository/')[1]);
  }

  async create({ sourceId }) {
    const data = await this.fileService.getJsonData(`${sourceId}/index.json`);
    const imageUrl = data.meta.posterImage?.key?.split('repository/')[1];
    const courseDto = this.getCourseDto(data);
    const course = this.coursesRepository.create(courseDto);
    const pageDtos = await this.getPagesDto(data, course);
    const pages = pageDtos.map((dto) => this.coursePagesRepository.create(dto));
    const assetPaths = this.getAssetPaths(pages);
    if (imageUrl) assetPaths.push(imageUrl);
    await this.fileService.transferAssets(assetPaths);
    await this.coursesRepository.flush();
    await this.coursePagesRepository.flush();
    return course;
  }

  getCatalog() {
    return this.fileService.getJsonData('index.json');
  }

  getAssetUrl(path) {
    return this.fileService.getAssetUrl(path);
  }

  findAll() {
    return this.coursesRepository.findAll();
  }

  findOne(id: number) {
    return this.coursesRepository.findOne({ id });
  }

  async findPage(id: number, courseId: number) {
    const course = await this.coursesRepository.findOne({ id: courseId });
    return this.coursePagesRepository.findOne({ sourceId: id, course });
  }

  async remove(id: number) {
    const course = await this.coursesRepository.findOne({ id });
    await this.coursePagesRepository.nativeDelete({ course });
    return this.coursesRepository.nativeDelete({ id });
  }
}
