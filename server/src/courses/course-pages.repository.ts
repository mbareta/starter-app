import { CoursePage } from './entities/course-page.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

export class CoursePagesRepository extends EntityRepository<CoursePage> {
  async flush(): Promise<void> {
    return this.em.flush();
  }
}
