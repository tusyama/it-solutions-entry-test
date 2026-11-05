import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { AppModule } from '../src/app.module.js';
import { PROFILE_CARD_QUERY } from '../src/profile/profile.query.js';

const execFileAsync = promisify(execFile);
async function runSeed() {
  await execFileAsync('npx', ['prisma', 'db', 'seed'], {
    cwd: process.cwd(),
    env: process.env,
  });
}

describe('Profile GraphQL (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await runSeed();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns the card shape from PROFILE_CARD_QUERY', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: PROFILE_CARD_QUERY })
      .expect(200);

    expect(res.body.errors).toBeUndefined();

    const profile = res.body.data.profile;
    expect(profile.name).toEqual(expect.any(String));
    expect(profile.description).toEqual(expect.any(String));
    expect(profile.links.length).toBeGreaterThan(0);
    expect(profile.skills.length).toBeGreaterThan(0);
    expect(profile.experience.length).toBeGreaterThan(0);
    expect(profile.experience[0]).toEqual(
      expect.objectContaining({
        company: expect.any(String),
        position: expect.any(String),
      }),
    );
    expect(profile.projects.length).toBeGreaterThan(0);
  });
});
