import { Body, Controller, Post, Response } from '@nestjs/common';
import { CourseAssistantService } from './course-assistant.service';

@Controller('course-assistant')
export class CourseAssistantController {
  constructor(
    private readonly courseAssistantService: CourseAssistantService
  ) {}

  @Post()
  create(@Response() res: Response, @Body() body: Body) {
    return this.courseAssistantService.respond(body.text, res);
  }
}
