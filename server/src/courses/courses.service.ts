import { CoursesRepository } from './courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import fs from 'node:fs';
import { Injectable } from '@nestjs/common';
import { plainToClass } from '@nestjs/class-transformer';

const isTest = process.env.NODE_ENV === 'test';

const BASE = isTest ? 'test_data/repository' : 'data/repository';
const getData = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  create({ sourceId }) {
    const data = getData(`${BASE}/${sourceId}/index.json`);
    const dto = plainToClass(CreateCourseDto, data);
    dto.sourceId = data.id;
    return this.coursesRepository.insert(dto);
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

  async findModule(id: number, moduleId: number) {
    const course = await this.coursesRepository.findOne({ id });
    return getData(`${BASE}/${course.sourceId}/${moduleId}.container.json`);
  }

  remove(id: number) {
    return this.coursesRepository.nativeDelete({ id });
  }
}
