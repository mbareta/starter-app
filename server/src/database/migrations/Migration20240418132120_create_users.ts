import { Migration } from '@mikro-orm/migrations';

export class Migration20240418132120_create_users extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      create table "users" (
        "id" serial primary key,
        "email" varchar(255) not null,
        "password" varchar(255) not null,
        "role" varchar(20) not null);`);
  }
  async down(): Promise<void> {
    this.addSql('drop table if exists "users" cascade;');
  }
}
