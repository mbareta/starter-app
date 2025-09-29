import {
  Entity,
  EntityRepositoryType,
  Index,
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
  userId!: string;

  @Property()
  accountId!: string;

  @Property()
  @Unique()
  email!: string;

  @Property({ default: 'USER' })
  role!: string;

  // Composite unique constraint on userId and accountId
  @Unique({ properties: ['userId', 'accountId'] })
  userIdAccountIdUnique!: any;
}
