import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';

const isTest = process.env.NODE_ENV === 'test';

const config: Options = {
  driver: PostgreSqlDriver,
  dbName: isTest ? 'nest_test' : 'nest',
  entities: ['**/*.entity.js'],
  extensions: [Migrator, SeedManager],
  migrations: {
    path: 'dist/database/migrations',
    pathTs: 'src/database/migrations'
  },
  seeder: {
    path: 'dist/database/seeds',
    pathTs: 'src/database/seeds'
  }
};

export default config;
