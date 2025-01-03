import { Course } from './entities/course.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

export class CoursesRepository extends EntityRepository<Course> {
  async flush(): Promise<void> {
    return this.em.flush();
  }
}
