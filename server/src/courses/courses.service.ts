import { CoursesRepository } from './courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import fs from 'node:fs';
import { Injectable } from '@nestjs/common';
import { plainToClass } from '@nestjs/class-transformer';

const BASE = '/Users/marin/Javascript/author/apps/backend/data/repository';
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
    const path = `${BASE}/index.json`;
    return fs.readFileSync(path, 'utf8');
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

  update(id: number, body) {
    // return this.coursesRepository.nativeUpdate({ id }, updateCourseDto);
  }

  remove(id: number) {
    return this.coursesRepository.nativeDelete({ id });
  }
}
