import { Migration } from '@mikro-orm/migrations';

const TABLE_NAME = 'course_pages';

export class CreateCoursePages extends Migration {
  async up(): Promise<void> {
    const knex = this.getKnex();
    const create = knex.schema.createTable(TABLE_NAME, table => {
      table.increments('id').primary();
      table.string('uid').notNullable().unique();
      table.integer('position').notNullable();
      table.string('type').notNullable();
      table.jsonb('elements').notNullable();
      table.foreign('course_id').references('courses.id').onDelete('CASCADE');
    });
    this.addSql(create.toQuery());
  }
  async down(): Promise<void> {
    this.addSql(`drop table if exists "${TABLE_NAME}" cascade;`);
  }
}
