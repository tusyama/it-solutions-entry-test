import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { Env } from './config/env.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.enableCors();

  const config = app.get(ConfigService<Env, true>);
  await app.listen(config.get('PORT', { infer: true }), '0.0.0.0');
}

await bootstrap();
