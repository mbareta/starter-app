import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

const config: Options = {
  driver: PostgreSqlDriver,
  dbName: 'nest',
  entities: ['**/*.entity.js'],
  extensions: [Migrator],
  migrations: {
    path: 'dist/database/migrations',
    pathTs: 'src/database/migrations'
  }
};

export default config;
