import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique
} from '@mikro-orm/core';
import { Course } from './course.entity';
import { CoursePagesRepository } from '../course-pages.repository';

@Entity({ repository: () => CoursePagesRepository, tableName: 'course_pages' })
export class CoursePage {
  [EntityRepositoryType]?: CoursePagesRepository;

  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  uid!: string;

  @Property()
  position!: number;

  @Property()
  type!: string;

  @Property({ type: 'jsonb' })
  elements!: object;

  @ManyToOne()
  course!: Course;
}
