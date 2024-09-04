import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post
} from '@nestjs/common';
import { Role, Roles } from '../auth/roles.decorator';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Roles(Role.Admin)
  @Post()
  @HttpCode(201)
  create(@Body() body) {
    return this.coursesService.create(body);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Roles(Role.Admin)
  @Get('catalog')
  catalog() {
    return this.coursesService.getCatalog();
  }

  @Get(':id/module/:moduleId')
  findModule(@Param('id') id: string, @Param('moduleId') moduleId: string) {
    return this.coursesService.findModule(+id, +moduleId);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const deletedCount = await this.coursesService.remove(+id);
    if (!deletedCount) throw new NotFoundException();
  }
}
