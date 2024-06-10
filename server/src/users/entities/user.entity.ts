import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property
} from '@mikro-orm/core';
import { UserRepository } from '../user.repository';

@Entity({ repository: () => UserRepository, tableName: 'users' })
export class User {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey()
  id!: number;

  @Property()
  email!: string;

  @Property()
  password!: string;

  @Property()
  role!: string;
}
