import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaClient } from '../generated/prisma/client.js';
import type { Env } from '../config/env.js';
import { createPgAdapter } from './create-pg-adapter.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService<Env, true>) {
    const adapter = createPgAdapter(
      config.get('DATABASE_URL', { infer: true }),
      config.get('DATABASE_SSL', { infer: true }),
    );

    super({
      adapter,
      log:
        process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
