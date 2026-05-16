import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import type { Tenant } from "@prisma/client";

import { ApiKeyGuard } from "../auth/api-key.guard.js";
import { CurrentTenant } from "../auth/current-tenant.decorator.js";
import { CreateTenantDto } from "./dto/create-tenant.dto.js";
import { TenantsService } from "./tenants.service.js";

@Controller("tenants")
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  create(@Body() dto: CreateTenantDto) {
    return this.tenantsService.create(dto);
  }

  @Get("me")
  @UseGuards(ApiKeyGuard)
  getMe(@CurrentTenant() tenant: Tenant) {
    return this.tenantsService.getCurrent(tenant);
  }
}
