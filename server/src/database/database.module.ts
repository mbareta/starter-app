import dotenv from 'dotenv';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

export const DatabaseModule = MikroOrmModule.forRoot({
  driver: PostgreSqlDriver,
  clientUrl: isTest ? process.env.TEST_DB_URL : process.env.DB_URL,
  entities: ['**/*.entity'],
  autoLoadEntities: true
});
