import { Migration } from '@mikro-orm/migrations';

export class Migration20240418132120_create_users extends Migration {
  async up(): Promise<void> {
    this.addSql(`create table "users" (
      "id" serial primary key,
      "sub" varchar(255) null,
      "email" varchar(255) not null,
      "role" varchar(255) not null default 'USER');`);
    this.addSql(`alter table "users"
      add constraint "users_sub_unique" unique ("sub");`);
  }
  async down(): Promise<void> {
    this.addSql('drop table if exists "users" cascade;');
  }
}
