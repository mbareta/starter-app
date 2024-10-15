import dotenv from 'dotenv';
import { MikroOrmModule } from '@mikro-orm/nestjs';

dotenv.config();

export const DatabaseModule = MikroOrmModule.forRoot();
