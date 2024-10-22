import { Course } from '../entities/course.entity';

export class CreateCoursePageDto {
  course!: Course;

  uid!: string;

  name!: string;

  position!: number;

  sourceId!: number;

  type!: string;

  elements: object;
}
