import { Module } from "@nestjs/common";

import { AppsModule } from "../apps/apps.module.js";
import { ApiKeyGuard } from "../auth/api-key.guard.js";
import { WebhooksModule } from "../webhooks/webhooks.module.js";
import { DeliveriesController } from "./deliveries.controller.js";
import { DeliveriesService } from "./deliveries.service.js";

@Module({
  imports: [AppsModule, WebhooksModule],
  controllers: [DeliveriesController],
  providers: [DeliveriesService, ApiKeyGuard],
})
export class DeliveriesModule {}
