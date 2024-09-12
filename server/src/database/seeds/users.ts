import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../../users/entities/user.entity';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await em.create(User, {
      sub: 'admin@test.com',
      email: 'admin@test.com',
      role: 'ADMIN'
    });
    await em.create(User, {
      sub: 'user@test.com',
      email: 'user@test.com',
      role: 'USER'
    });
  }
}
