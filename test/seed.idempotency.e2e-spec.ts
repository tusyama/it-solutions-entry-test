import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { createPgAdapter } from '../src/prisma/create-pg-adapter.js';

const execFileAsync = promisify(execFile);

async function runSeed() {
  await execFileAsync('npx', ['prisma', 'db', 'seed'], {
    cwd: process.cwd(),
    env: process.env,
  });
}

describe('prisma db seed idempotency', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL required');
    prisma = new PrismaClient({
      adapter: createPgAdapter(url, process.env.DATABASE_SSL === 'true'),
    });
  });

  afterAll(async () => {
    await prisma?.$disconnect();
  });

  it('keeps the same row counts after a second seed', async () => {
    await runSeed();
    const first = {
      profiles: await prisma.profile.count(),
      links: await prisma.link.count(),
      skills: await prisma.skill.count(),
      experiences: await prisma.experience.count(),
      projects: await prisma.project.count(),
    };

    await runSeed();
    const second = {
      profiles: await prisma.profile.count(),
      links: await prisma.link.count(),
      skills: await prisma.skill.count(),
      experiences: await prisma.experience.count(),
      projects: await prisma.project.count(),
    };

    expect(first.profiles).toBe(1);
    expect(second).toEqual(first);
    expect(
      await prisma.profile.findUnique({ where: { slot: 1 } }),
    ).not.toBeNull();
  });
});
