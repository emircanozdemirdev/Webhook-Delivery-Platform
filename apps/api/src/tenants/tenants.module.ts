import { Module } from "@nestjs/common";

import { ApiKeyGuard } from "../auth/api-key.guard.js";
import { TenantsController } from "./tenants.controller.js";
import { TenantsService } from "./tenants.service.js";

@Module({
  controllers: [TenantsController],
  providers: [TenantsService, ApiKeyGuard],
})
export class TenantsModule {}
