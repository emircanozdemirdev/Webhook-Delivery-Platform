import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppsModule } from "./apps/apps.module.js";
import { DeliveriesModule } from "./deliveries/deliveries.module.js";
import { EventsModule } from "./events/events.module.js";
import { HealthController } from "./health.controller.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { QueueModule } from "./queue/queue.module.js";
import { TenantsModule } from "./tenants/tenants.module.js";
import { WebhooksModule } from "./webhooks/webhooks.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    QueueModule,
    TenantsModule,
    AppsModule,
    WebhooksModule,
    EventsModule,
    DeliveriesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
