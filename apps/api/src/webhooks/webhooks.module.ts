import { Module } from "@nestjs/common";

import { AppsModule } from "../apps/apps.module.js";
import { ApiKeyGuard } from "../auth/api-key.guard.js";
import { WebhooksController } from "./webhooks.controller.js";
import { WebhooksService } from "./webhooks.service.js";

@Module({
  imports: [AppsModule],
  controllers: [WebhooksController],
  providers: [WebhooksService, ApiKeyGuard],
})
export class WebhooksModule {}
