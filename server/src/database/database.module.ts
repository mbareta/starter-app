import dotenv from 'dotenv';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

dotenv.config();

export const DatabaseModule = MikroOrmModule.forRoot();
