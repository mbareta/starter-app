import { Course } from './entities/course.entity';
import { CourseAssistantService } from '../course-assistant/course-assistant.service';
import { CoursePage } from './entities/course-page.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { FileService } from './file.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Course, CoursePage] })],
  controllers: [CoursesController],
  providers: [
    CourseAssistantService,
    CoursesService,
    FileService,
    WebhookService
  ]
})
export class CoursesModule {}
