import { describe, expect, it } from 'vitest';
import { HealthController } from './health.controller.js';
import { PrismaService } from './prisma/prisma.service.js';

describe('HealthController', () => {
  it('returns ok after SELECT 1', async () => {
    const prisma = {
      $queryRaw: vi.fn().mockResolvedValue([{ '?column': 1 }]),
    } as unknown as PrismaService;

    await expect(new HealthController(prisma).check()).resolves.toEqual({
      status: 'ok',
    });
    expect(prisma.$queryRaw).toHaveBeenCalledOnce();
  });
});
