import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

const isTest = process.env.NODE_ENV === 'test';

export const DatabaseModule = MikroOrmModule.forRoot({
  driver: PostgreSqlDriver,
  dbName: isTest ? 'nest_test' : 'nest',
  entities: ['**/*.entity'],
  autoLoadEntities: true
});
