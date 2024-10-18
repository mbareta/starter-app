import { Course } from '../../courses/entities/course.entity';
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class CourseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await em.create(Course, {
      sourceId: 1,
      uid: 'uniq',
      name: 'Test Course',
      structure: []
    });
  }
}
