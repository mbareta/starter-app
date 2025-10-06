import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../../users/entities/user.entity';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await em.create(User, {
      email: 'admin@test.com',
      role: 'ADMIN',
      accountId: '1',
      userId: '1'
    });
    await em.create(User, {
      email: 'user@test.com',
      role: 'USER',
      accountId: '1',
      userId: '2'
    });
  }
}
