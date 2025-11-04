import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UnauthorizedException
} from '@nestjs/common';
import { Role, Roles } from '../auth/roles.decorator';
import { CoursesService } from './courses.service';
import { Public } from '../auth/public.decorator';
import { WebhookService } from './webhook.service';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly webhookService: WebhookService
  ) {}

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

  @Get('asset-url')
  getAssetUrl(@Query() query) {
    return this.coursesService.getAssetUrl(query.path);
  }

  @Get(':courseId/page/:id')
  findPage(@Param('id') id: string, @Param('courseId') courseId: string) {
    return this.coursesService.findPage(+id, +courseId);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const deletedCount = await this.coursesService.remove(+id);
    if (!deletedCount) throw new NotFoundException();
  }

  @Public()
  @Post('webhook')
  webhook(@Request() req: Request, @Body() body: Body) {
    const token = this.webhookService.validateToken(
      req.headers['authorization'].split(' ')[1]
    );
    if (!token) throw new UnauthorizedException();
    console.log(body);
    return 'ok';
  }

  @Public()
  @Post('token')
  async token(@Request() req: Request) {
    return this.webhookService.getToken(req);
  }
}
