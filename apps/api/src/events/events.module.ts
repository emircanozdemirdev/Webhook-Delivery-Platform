import { Module } from "@nestjs/common";

import { AppsModule } from "../apps/apps.module.js";
import { ApiKeyGuard } from "../auth/api-key.guard.js";
import { EventsController } from "./events.controller.js";
import { EventsService } from "./events.service.js";

@Module({
  imports: [AppsModule],
  controllers: [EventsController],
  providers: [EventsService, ApiKeyGuard],
})
export class EventsModule {}
