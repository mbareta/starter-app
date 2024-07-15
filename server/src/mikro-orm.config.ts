import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import dotenv from 'dotenv';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const config: Options = {
  driver: PostgreSqlDriver,
  dbName: isTest ? process.env.TEST_DB_NAME : process.env.DB_NAME,
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
