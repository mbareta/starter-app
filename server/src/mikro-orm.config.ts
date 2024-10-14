import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import dotenv from 'dotenv';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
dotenv.config();

const config: Options = {
  driver: PostgreSqlDriver,
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  dbName: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
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
