import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLModule } from '@nestjs/graphql';

import { ProfileModule } from './profile/profile.module.js';
import { PROFILE_CARD_QUERY } from './profile/profile.query.js';
import { validate } from './config/env.js';
import { HealthModule } from './health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    HealthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      introspection: true,
      graphiql: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({
          embed: true,
          document: PROFILE_CARD_QUERY,
        }),
      ],
    }),
    ProfileModule,
  ],
})
export class AppModule {}
