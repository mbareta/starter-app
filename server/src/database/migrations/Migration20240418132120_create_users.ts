import { Migration } from '@mikro-orm/migrations';

const TABLE_NAME = 'users';

export class CreateUsers extends Migration {
  async up(): Promise<void> {
    const knex = this.getKnex();
    const create = knex.schema.createTable(TABLE_NAME, (table) => {
      table.increments('id').primary();
      table.string('sub').unique();
      table.string('email').notNullable().unique();
      table.string('role').notNullable().unique().defaultTo('USER');
    });
    this.addSql(create.toQuery());
  }
  async down(): Promise<void> {
    this.addSql(`drop table if exists "${TABLE_NAME}" cascade;`);
  }
}
