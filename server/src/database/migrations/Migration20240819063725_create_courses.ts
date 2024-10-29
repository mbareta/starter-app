import { Migration } from '@mikro-orm/migrations';

const TABLE_NAME = 'courses';

export class CreateCourses extends Migration {
  async up(): Promise<void> {
    const knex = this.getKnex();
    const create = knex.schema.createTable(TABLE_NAME, (table) => {
      table.increments('id').primary();
      table.integer('source_id').notNullable();
      table.string('uid').notNullable().unique();
      table.string('name').notNullable();
      table.string('description');
      table.jsonb('meta').notNullable();
      table.jsonb('structure').notNullable();
    });
    this.addSql(create.toQuery());
  }
  async down(): Promise<void> {
    this.addSql(`drop table if exists "${TABLE_NAME}" cascade;`);
  }
}
