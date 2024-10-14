import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';

export class UsersRepository extends EntityRepository<User> {
  async flush(): Promise<void> {
    return this.em.flush();
  }
}
