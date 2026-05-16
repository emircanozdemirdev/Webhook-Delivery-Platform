import { Module } from "@nestjs/common";

import { ApiKeyGuard } from "../auth/api-key.guard.js";
import { AppsController } from "./apps.controller.js";
import { AppsService } from "./apps.service.js";

@Module({
  controllers: [AppsController],
  providers: [AppsService, ApiKeyGuard],
})
export class AppsModule {}
