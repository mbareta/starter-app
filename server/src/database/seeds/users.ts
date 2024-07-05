import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../../users/entities/user.entity';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await em.create(User, {
      email: 'admin@test.com',
      password: 'admin',
      role: 'ADMIN'
    });
    await em.create(User, {
      email: 'user@test.com',
      password: 'admin',
      role: 'USER'
    });
  }
}
