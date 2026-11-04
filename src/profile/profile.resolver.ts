import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { ProfileService } from './profile.service.js';
import {
  Experience,
  Link,
  Profile,
  Project,
  Skill,
} from './types/profile.types.js';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profiles: ProfileService) {}

  @Query(() => Profile)
  profile() {
    return this.profiles.getPrimary();
  }

  @ResolveField(() => [Link])
  links(@Parent() profile: Profile) {
    return this.profiles.findLinks(profile.id);
  }

  @ResolveField(() => [Experience])
  experiences(@Parent() profile: Profile) {
    return this.profiles.findExperiences(profile.id);
  }

  @ResolveField(() => [Project])
  projects(@Parent() profile: Profile) {
    return this.profiles.findProjects(profile.id);
  }

  @ResolveField(() => [Skill])
  skills(@Parent() profile: Profile) {
    return this.profiles.findSkills(profile.id);
  }
}
