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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import type { Tenant } from "@prisma/client";

import { ApiKeyGuard } from "../auth/api-key.guard.js";
import { CurrentTenant } from "../auth/current-tenant.decorator.js";
import { CreateWebhookDto } from "./dto/create-webhook.dto.js";
import { UpdateWebhookDto } from "./dto/update-webhook.dto.js";
import { WebhooksService } from "./webhooks.service.js";

@ApiTags("webhooks")
@ApiSecurity("api-key")
@Controller("apps/:appId/webhooks")
@UseGuards(ApiKeyGuard)
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  @ApiOperation({ summary: "Create a webhook endpoint for an app" })
  @ApiParam({ name: "appId", description: "App ID" })
  @ApiCreatedResponse({ description: "Webhook created (includes secret once)" })
  create(
    @CurrentTenant() tenant: Tenant,
    @Param("appId") appId: string,
    @Body() dto: CreateWebhookDto,
  ) {
    return this.webhooksService.create(tenant.id, appId, dto);
  }

  @Get()
  @ApiOperation({ summary: "List webhooks for an app" })
  @ApiParam({ name: "appId", description: "App ID" })
  @ApiOkResponse({ description: "Webhooks without secrets" })
  findAll(@CurrentTenant() tenant: Tenant, @Param("appId") appId: string) {
    return this.webhooksService.findAll(tenant.id, appId);
  }

  @Get(":webhookId")
  @ApiOperation({ summary: "Get a webhook by ID" })
  @ApiParam({ name: "appId", description: "App ID" })
  @ApiParam({ name: "webhookId", description: "Webhook ID" })
  @ApiOkResponse({ description: "Webhook without secret" })
  findOne(
    @CurrentTenant() tenant: Tenant,
    @Param("appId") appId: string,
    @Param("webhookId") webhookId: string,
  ) {
    return this.webhooksService.findOne(tenant.id, appId, webhookId);
  }

  @Patch(":webhookId")
  @ApiOperation({ summary: "Update webhook URL or active flag" })
  @ApiParam({ name: "appId", description: "App ID" })
  @ApiParam({ name: "webhookId", description: "Webhook ID" })
  update(
    @CurrentTenant() tenant: Tenant,
    @Param("appId") appId: string,
    @Param("webhookId") webhookId: string,
    @Body() dto: UpdateWebhookDto,
  ) {
    return this.webhooksService.update(tenant.id, appId, webhookId, dto);
  }

  @Delete(":webhookId")
  @ApiOperation({ summary: "Delete a webhook" })
  @ApiParam({ name: "appId", description: "App ID" })
  @ApiParam({ name: "webhookId", description: "Webhook ID" })
  remove(
    @CurrentTenant() tenant: Tenant,
    @Param("appId") appId: string,
    @Param("webhookId") webhookId: string,
  ) {
    return this.webhooksService.remove(tenant.id, appId, webhookId);
  }
}
