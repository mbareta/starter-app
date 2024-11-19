import { Migration } from '@mikro-orm/migrations';

const TABLE_NAME = 'courses';
const COLUMN_NAME = 'vector_store_file_id';

export class AddVectorStoreFileIdToCourses extends Migration {
  async up(): Promise<void> {
    const knex = this.getKnex();
    const alter = knex.schema.alterTable(TABLE_NAME, (table) => {
      table.string(COLUMN_NAME);
    });
    this.addSql(alter.toQuery());
  }
  async down(): Promise<void> {
    const knex = this.getKnex();
    const alter = knex.schema.alterTable(TABLE_NAME, (table) => {
      table.dropColumn(COLUMN_NAME);
    });
    this.addSql(alter.toQuery());
  }
}
