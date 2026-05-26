import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import type { Tenant } from "@prisma/client";

import { ApiKeyGuard } from "../auth/api-key.guard.js";
import { CurrentTenant } from "../auth/current-tenant.decorator.js";
import { DeliveriesService } from "./deliveries.service.js";
import { ListDeliveriesQueryDto } from "./dto/list-deliveries-query.dto.js";

@ApiTags("deliveries")
@ApiSecurity("api-key")
@Controller("apps/:appId")
@UseGuards(ApiKeyGuard)
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get("events/:eventId/deliveries")
  @ApiOperation({ summary: "List delivery attempts for an event" })
  @ApiParam({ name: "appId", description: "App ID" })
  @ApiParam({ name: "eventId", description: "Event ID" })
  @ApiOkResponse({ description: "Paginated delivery attempts" })
  findByEvent(
    @CurrentTenant() tenant: Tenant,
    @Param("appId") appId: string,
    @Param("eventId") eventId: string,
    @Query() query: ListDeliveriesQueryDto,
  ) {
    return this.deliveriesService.findByEvent(
      tenant.id,
      appId,
      eventId,
      query,
    );
  }

  @Get("webhooks/:webhookId/deliveries")
  @ApiOperation({ summary: "List delivery attempts for a webhook" })
  @ApiParam({ name: "appId", description: "App ID" })
  @ApiParam({ name: "webhookId", description: "Webhook ID" })
  @ApiOkResponse({ description: "Paginated delivery attempts" })
  findByWebhook(
    @CurrentTenant() tenant: Tenant,
    @Param("appId") appId: string,
    @Param("webhookId") webhookId: string,
    @Query() query: ListDeliveriesQueryDto,
  ) {
    return this.deliveriesService.findByWebhook(
      tenant.id,
      appId,
      webhookId,
      query,
    );
  }
}
