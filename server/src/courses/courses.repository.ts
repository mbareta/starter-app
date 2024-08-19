import { EntityRepository } from '@mikro-orm/postgresql';
import { Course } from './entities/course.entity';

export class CoursesRepository extends EntityRepository<Course> {}
