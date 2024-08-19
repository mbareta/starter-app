import { Migration } from '@mikro-orm/migrations';

export class Migration20240819063725_create_courses extends Migration {
  async up(): Promise<void> {
    this.addSql(`create table "courses" (
      "id" serial primary key,
      "source_uid" varchar(255) not null,
      "name" varchar(255) not null,
      "description" varchar(255) null,
      "structure" jsonb not null);`);
    this.addSql(`alter table "courses"
      add constraint "courses_source_uid_unique" unique ("source_uid");`);
  }
  async down(): Promise<void> {
    this.addSql('drop table if exists "courses" cascade;');
  }
}
