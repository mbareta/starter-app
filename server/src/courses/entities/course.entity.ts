import {
  Cascade,
  Entity,
  EntityRepositoryType,
  OneToMany,
  PrimaryKey,
  Property,
  Unique
} from '@mikro-orm/core';
import { CoursePage } from './course-page.entity';
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
  sourceId: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description: string;

  @Property({ type: 'jsonb' })
  structure: object;

  @Property({ type: 'jsonb' })
  meta: object;

  @OneToMany({
    entity: () => CoursePage,
    mappedBy: 'course',
    cascade: [Cascade.ALL]
  })
  coursePages: CoursePage;
}
