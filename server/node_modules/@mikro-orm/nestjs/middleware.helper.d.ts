import type { MikroOrmMiddlewareModuleOptions } from './typings';
import type { MiddlewareConsumer } from '@nestjs/common';
export declare function forRoutesPath(options: MikroOrmMiddlewareModuleOptions, consumer: MiddlewareConsumer): string;
