import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique
} from '@mikro-orm/core';
import { Course } from './course.entity';

@Entity({ tableName: 'course_pages' })
export class CoursePage {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  uid: string;

  @Property()
  sourceId: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description: string;

  @Property({ type: 'jsonb' })
  structure: object;

  @ManyToOne()
  course!: Course;
}
