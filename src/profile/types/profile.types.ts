import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LinkKind } from '../../generated/prisma/enums.js';

registerEnumType(LinkKind, { name: 'LinkKind' });

@ObjectType()
export class Link {
  @Field(() => ID)
  id: string;

  @Field(() => LinkKind)
  kind: LinkKind;

  @Field()
  url: string;

  @Field(() => String, { nullable: true })
  label: string | null;
}

@ObjectType()
export class Skill {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  category: string | null;
}

@ObjectType()
export class Experience {
  @Field(() => ID)
  id: string;

  @Field()
  company: string;

  @Field()
  position: string;

  @Field()
  startDate: string;

  @Field(() => String, { nullable: true })
  endDate: string | null;

  @Field(() => [String])
  achievements: string[];
}

@ObjectType()
export class Project {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  url: string | null;

  @Field(() => String, { nullable: true })
  description: string | null;
}

@ObjectType()
export class Profile {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [Link])
  links: Link[];

  @Field(() => [Skill])
  skills: Skill[];

  @Field(() => [Project])
  projects: Project[];
}
