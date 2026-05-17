import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppsModule } from "./apps/apps.module.js";
import { HealthController } from "./health.controller.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { TenantsModule } from "./tenants/tenants.module.js";
import { WebhooksModule } from "./webhooks/webhooks.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TenantsModule,
    AppsModule,
    WebhooksModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
