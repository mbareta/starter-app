import dotenv from 'dotenv';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

export const DatabaseModule = MikroOrmModule.forRoot({
  driver: PostgreSqlDriver,
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  dbName: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  entities: ['**/*.entity'],
  autoLoadEntities: true
});
