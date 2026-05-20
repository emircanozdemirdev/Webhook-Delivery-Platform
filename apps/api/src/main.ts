import "reflect-metadata";

import { getAppConfig } from "@webhook-delivery-platform/shared";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

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

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Webhook Delivery Platform")
    .setDescription("Tenant webhook delivery API")
    .setVersion("0.1.0")
    .addApiKey(
      { type: "apiKey", name: "x-api-key", in: "header" },
      "api-key",
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(config.api.port);

  console.log(`API listening on port ${config.api.port}`);
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
