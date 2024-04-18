import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

export const DatabaseModule = MikroOrmModule.forRoot({
  driver: PostgreSqlDriver,
  dbName: 'nest',
  entities: ['**/*.entity'],
  autoLoadEntities: true
});
