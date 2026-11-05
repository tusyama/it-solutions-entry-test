import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { PrismaClient } from '../src/generated/prisma/client.js';
import { createPgAdapter } from '../src/prisma/create-pg-adapter.js';
import { card } from '../prisma/card.data.js';
import { PROFILE_SLOT } from '../src/profile/profile.constants.js';

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

    await prisma.profile.update({
      where: { slot: PROFILE_SLOT },
      data: { id: 'stale-id', name: 'stale' },
    });

    await prisma.skill.update({
      where: { id: card.skills[0].id },
      data: { name: 'stale-skill' },
    });

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

    const restored = await prisma.profile.findUnique({
      where: { slot: PROFILE_SLOT },
    });
    expect(restored).toMatchObject({
      id: card.profile.id,
      name: card.profile.name,
      description: card.profile.description,
    });
    const skill = await prisma.skill.findUnique({
      where: { id: card.skills[0].id },
    });
    expect(skill?.name).toBe(card.skills[0].name);
  });
});
