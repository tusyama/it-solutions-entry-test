import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getPrimary() {
    const profile = await this.prisma.profile.findUnique({
      where: { isPrimary: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  findLinks(profileId: string) {
    return this.prisma.link.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findSkills(profileId: string) {
    return this.prisma.skill.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findExperience(profileId: string) {
    return this.prisma.experience.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findProjects(profileId: string) {
    return this.prisma.project.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
