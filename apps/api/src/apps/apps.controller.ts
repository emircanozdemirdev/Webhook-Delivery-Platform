import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import type { Tenant } from "@prisma/client";

import { ApiKeyGuard } from "../auth/api-key.guard.js";
import { CurrentTenant } from "../auth/current-tenant.decorator.js";
import { AppsService } from "./apps.service.js";
import { CreateAppDto } from "./dto/create-app.dto.js";
import { UpdateAppDto } from "./dto/update-app.dto.js";

@Controller("apps")
@UseGuards(ApiKeyGuard)
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Post()
  create(@CurrentTenant() tenant: Tenant, @Body() dto: CreateAppDto) {
    return this.appsService.create(tenant.id, dto);
  }

  @Get()
  findAll(@CurrentTenant() tenant: Tenant) {
    return this.appsService.findAll(tenant.id);
  }

  @Get(":appId")
  findOne(@CurrentTenant() tenant: Tenant, @Param("appId") appId: string) {
    return this.appsService.findOne(tenant.id, appId);
  }

  @Patch(":appId")
  update(
    @CurrentTenant() tenant: Tenant,
    @Param("appId") appId: string,
    @Body() dto: UpdateAppDto,
  ) {
    return this.appsService.update(tenant.id, appId, dto);
  }

  @Delete(":appId")
  remove(@CurrentTenant() tenant: Tenant, @Param("appId") appId: string) {
    return this.appsService.remove(tenant.id, appId);
  }
}
