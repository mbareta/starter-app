import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property
} from '@mikro-orm/core';
import { UsersRepository } from '../users.repository';

@Entity({ repository: () => UsersRepository, tableName: 'users' })
export class User {
  [EntityRepositoryType]?: UsersRepository;

  @PrimaryKey()
  id!: number;

  @Property()
  email!: string;

  @Property()
  password!: string;

  @Property({ default: 'USER' })
  role!: string;
}
