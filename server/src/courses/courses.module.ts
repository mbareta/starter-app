import { Course } from './entities/course.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Course] })],
  controllers: [CoursesController],
  providers: [CoursesService]
})
export class CoursesModule {}
