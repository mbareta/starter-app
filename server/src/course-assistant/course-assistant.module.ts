import { ConfigModule } from '@nestjs/config';
import { CourseAssistantController } from './course-assistant.controller';
import { CourseAssistantService } from './course-assistant.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule],
  controllers: [CourseAssistantController],
  providers: [CourseAssistantService]
})
export class CourseAssistantModule {}
