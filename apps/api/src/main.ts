import "reflect-metadata";

import { getAppConfig } from "@webhook-delivery-platform/shared";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  const config = getAppConfig();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(config.api.port);

  console.log(`API listening on port ${config.api.port}`);
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
