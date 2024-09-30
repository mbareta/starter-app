import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Public } from './auth/public.decorator';

@Controller('healthcheck')
export class HealthController {
  constructor(private em: EntityManager) {}

  @Get()
  @Public()
  async healthCheck() {
    const isConnected = await this.em.getConnection().isConnected();
    if (!isConnected) throw new ServiceUnavailableException();
  }
}
