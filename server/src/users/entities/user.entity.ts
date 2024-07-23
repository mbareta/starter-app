import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
  Unique
} from '@mikro-orm/core';
import { UsersRepository } from '../users.repository';

@Entity({ repository: () => UsersRepository, tableName: 'users' })
export class User {
  [EntityRepositoryType]?: UsersRepository;

  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  sub: string;

  @Property()
  email!: string;

  @Property({ default: 'USER' })
  role!: string;
}
