import dotenv from 'dotenv';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const ssl = isProduction
  ? { ca: require('fs').readFileSync(`../../rds-cert-us-east-1.pem`) }
  : false;

export const DatabaseModule = MikroOrmModule.forRoot({
  driver: PostgreSqlDriver,
  driverOptions: { connection: { ssl } },
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  dbName: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  entities: ['**/*.entity'],
  autoLoadEntities: true
});
