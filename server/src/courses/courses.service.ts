import { CoursePagesRepository } from './course-pages.repository';
import { CoursesRepository } from './courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateCoursePageDto } from './dto/create-course-page.dto';
import fs from 'node:fs';
import { Injectable } from '@nestjs/common';
import { plainToClass } from '@nestjs/class-transformer';

const isTest = process.env.NODE_ENV === 'test';

const BASE = isTest ? 'test_data/repository' : 'data/repository';
const getData = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly coursePagesRepository: CoursePagesRepository
  ) {}

  async create({ sourceId }) {
    const data = getData(`${BASE}/${sourceId}/index.json`);
    const containerIds = data.structure.flatMap((it) => {
      return it.contentContainers.map(({ id }) => id);
    });
    const dto = plainToClass(CreateCourseDto, data);
    dto.sourceId = data.id;
    const course = this.coursesRepository.create(dto);
    containerIds.forEach((containerId) => {
      const data = getData(
        `${BASE}/${course.sourceId}/${containerId}.container.json`
      );
      const dto = plainToClass(CreateCoursePageDto, data);
      dto.sourceId = data.id;
      dto.course = course;
      this.coursePagesRepository.create(dto);
    });
    await this.coursesRepository.flush();
    await this.coursePagesRepository.flush();
    return course;
  }

  getCatalog() {
    return getData(`${BASE}/index.json`) || [];
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
