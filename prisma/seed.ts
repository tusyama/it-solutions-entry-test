import 'dotenv/config';
import { z } from 'zod';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { createPgAdapter } from '../src/prisma/create-pg-adapter.js';
import { card } from './card.data.js';

import { PROFILE_SLOT } from '../src/profile/profile.constants.js';

const period = z.string().regex(/^(?:\d{4}|\d{4}-(?:0[1-9]|1[0-2]))$/);
const text = z.string().min(1);

const cardSchema = z.object({
  profile: z.object({
    id: text,
    name: text,
    description: text,
  }),
  links: z
    .array(
      z.object({
        id: text,
        kind: z.enum(['GITHUB', 'TELEGRAM', 'OTHER']),
        url: z.url(),
        label: text.nullable(),
      }),
    )
    .min(1),
  skills: z
    .array(
      z.object({
        id: text,
        name: text,
        category: text.nullable(),
      }),
    )
    .min(1),
  experiences: z
    .array(
      z.object({
        id: text,
        company: text,
        position: text,
        startDate: period,
        endDate: period.nullable(),
        achievements: z.array(text).min(1),
      }),
    )
    .min(1),
  projects: z
    .array(
      z.object({
        id: text,
        name: text,
        url: z.union([z.url(), z.literal(''), z.null()]),
        description: text.nullable(),
      }),
    )
    .min(1),
});

const data = cardSchema.parse(card);
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required but missing');
}

const prisma = new PrismaClient({
  adapter: createPgAdapter(databaseUrl, process.env.DATABASE_SSL === 'true'),
});

await prisma.$transaction(async (tx) => {
  const { id: profileId } = await tx.profile.upsert({
    where: { slot: PROFILE_SLOT },
    create: { ...data.profile, slot: PROFILE_SLOT },
    update: {
      id: data.profile.id,
      name: data.profile.name,
      description: data.profile.description,
    },
  });

  await tx.link.deleteMany({ where: { profileId } });
  await tx.skill.deleteMany({ where: { profileId } });
  await tx.experience.deleteMany({ where: { profileId } });
  await tx.project.deleteMany({ where: { profileId } });

  await tx.link.createMany({
    data: data.links.map((link, sortOrder) => ({
      ...link,
      profileId,
      sortOrder,
    })),
  });
  await tx.skill.createMany({
    data: data.skills.map((skill, sortOrder) => ({
      ...skill,
      profileId,
      sortOrder,
    })),
  });
  await tx.experience.createMany({
    data: data.experiences.map((experience, sortOrder) => ({
      ...experience,
      profileId,
      sortOrder,
    })),
  });
  await tx.project.createMany({
    data: data.projects.map((project, sortOrder) => ({
      ...project,
      url: project.url === '' ? null : project.url,
      profileId,
      sortOrder,
    })),
  });
});

await prisma.$disconnect();
