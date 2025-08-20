import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { Role, Roles } from '../auth/roles.decorator';
import { TwinspeakService } from './twinspeak.service';

@Controller('twinspeak')
export class TwinspeakController {
  constructor(private readonly twinspeakService: TwinspeakService) {}

  @Roles(Role.Admin)
  @Post()
  @HttpCode(200)
  findAll(@Body() body: Body) {
    return this.twinspeakService.create();
  }
}
