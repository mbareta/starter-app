import { Course } from '../../courses/entities/course.entity';
import { CoursePage } from '../../courses/entities/course-page.entity';
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class CourseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const course: Course = await em.create(Course, {
      sourceId: 1,
      uid: 'uniq',
      name: 'Test Course',
      meta: [],
      structure: []
    });
    await em.create(CoursePage, {
      course,
      sourceId: 1,
      position: 1,
      type: 'MODULE/PAGE',
      uid: 'abc',
      elements: []
    });
  }
}
