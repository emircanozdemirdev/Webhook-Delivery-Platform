import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppsModule } from "./apps/apps.module.js";
import { HealthController } from "./health.controller.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { TenantsModule } from "./tenants/tenants.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TenantsModule,
    AppsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
