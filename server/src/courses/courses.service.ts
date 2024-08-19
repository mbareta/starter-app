import { CoursesRepository } from './courses.repository';
import fs from 'node:fs';
import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  create(createCourseDto: CreateCourseDto) {
    return this.coursesRepository.insert(createCourseDto);
  }

  getCatalog() {
    const path =
      '/Users/marin/Javascript/author/apps/backend/data/repository/index.json';
    return fs.readFileSync(path, 'utf8');
  }

  findAll() {
    return this.coursesRepository.findAll();
  }

  findOne(id: number) {
    return this.coursesRepository.findOne({ id });
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return this.coursesRepository.nativeUpdate({ id }, updateCourseDto);
  }

  remove(id: number) {
    return this.coursesRepository.nativeDelete({ id });
  }
}
