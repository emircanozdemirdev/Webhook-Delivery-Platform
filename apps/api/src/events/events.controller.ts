import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import type { Tenant } from "@prisma/client";

import { ApiKeyGuard } from "../auth/api-key.guard.js";
import { CurrentTenant } from "../auth/current-tenant.decorator.js";
import { CreateEventDto } from "./dto/create-event.dto.js";
import { EventsService } from "./events.service.js";

@ApiTags("events")
@ApiSecurity("api-key")
@Controller("apps/:appId/events")
@UseGuards(ApiKeyGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: "Publish an event and enqueue webhook deliveries" })
  @ApiParam({ name: "appId", description: "App ID" })
  @ApiCreatedResponse({
    description: "Event stored and delivery jobs enqueued for active webhooks",
  })
  publish(
    @CurrentTenant() tenant: Tenant,
    @Param("appId") appId: string,
    @Body() dto: CreateEventDto,
  ) {
    return this.eventsService.publish(tenant.id, appId, dto);
  }
}
