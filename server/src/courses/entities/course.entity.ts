import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
  Unique
} from '@mikro-orm/core';
import { CoursesRepository } from '../courses.repository';

@Entity({ repository: () => CoursesRepository, tableName: 'courses' })
export class Course {
  [EntityRepositoryType]?: CoursesRepository;

  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  uid: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description: string;

  @Property({ type: 'jsonb' })
  structure: object;
}
