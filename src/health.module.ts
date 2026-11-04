import { Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  controllers: [HealthController],
  imports: [PrismaModule],
})
export class HealthModule {}
