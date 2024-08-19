import { Course } from './entities/course.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Course] })],
  controllers: [CoursesController],
  providers: [CoursesService]
})
export class CoursesModule {}
