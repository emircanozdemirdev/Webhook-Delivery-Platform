import { Injectable, NotFoundException } from "@nestjs/common";
import type { DeliveryAttempt, Prisma } from "@prisma/client";

import { AppsService } from "../apps/apps.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { WebhooksService } from "../webhooks/webhooks.service.js";
import { ListDeliveriesQueryDto } from "./dto/list-deliveries-query.dto.js";

export type PaginatedDeliveries = {
  data: DeliveryAttempt[];
  nextCursor: string | null;
  hasMore: boolean;
};

@Injectable()
export class DeliveriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly appsService: AppsService,
    private readonly webhooksService: WebhooksService,
  ) {}

  async findByEvent(
    tenantId: string,
    appId: string,
    eventId: string,
    query: ListDeliveriesQueryDto,
  ): Promise<PaginatedDeliveries> {
    await this.appsService.findOne(tenantId, appId);

    const event = await this.prisma.client.event.findFirst({
      where: { id: eventId, appId },
    });

    if (!event) {
      throw new NotFoundException(`Event ${eventId} not found`);
    }

    return this.listDeliveries(
      {
        eventId,
        event: { appId },
      },
      query,
    );
  }

  async findByWebhook(
    tenantId: string,
    appId: string,
    webhookId: string,
    query: ListDeliveriesQueryDto,
  ): Promise<PaginatedDeliveries> {
    await this.webhooksService.findOne(tenantId, appId, webhookId);

    return this.listDeliveries(
      {
        webhookId,
        webhook: { appId },
      },
      query,
    );
  }

  private async listDeliveries(
    scope: Prisma.DeliveryAttemptWhereInput,
    query: ListDeliveriesQueryDto,
  ): Promise<PaginatedDeliveries> {
    const limit = query.limit ?? 20;
    const where = this.buildWhere(scope, query);
    const cursorFilter = await this.buildCursorFilter(query.cursor, where);

    const deliveries = await this.prisma.client.deliveryAttempt.findMany({
      where: {
        ...where,
        ...cursorFilter,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
    });

    const hasMore = deliveries.length > limit;
    const data = hasMore ? deliveries.slice(0, limit) : deliveries;
    const lastItem = data.at(-1);

    return {
      data,
      nextCursor: hasMore && lastItem ? lastItem.id : null,
      hasMore,
    };
  }

  private buildWhere(
    scope: Prisma.DeliveryAttemptWhereInput,
    query: ListDeliveriesQueryDto,
  ): Prisma.DeliveryAttemptWhereInput {
    const createdAt: Prisma.DateTimeFilter = {};

    if (query.from) {
      createdAt.gte = new Date(query.from);
    }

    if (query.to) {
      createdAt.lte = new Date(query.to);
    }

    return {
      ...scope,
      ...(query.status ? { status: query.status } : {}),
      ...(query.from || query.to ? { createdAt } : {}),
    };
  }

  private async buildCursorFilter(
    cursor: string | undefined,
    where: Prisma.DeliveryAttemptWhereInput,
  ): Promise<Prisma.DeliveryAttemptWhereInput> {
    if (!cursor) {
      return {};
    }

    const cursorRecord = await this.prisma.client.deliveryAttempt.findFirst({
      where: { id: cursor, ...where },
    });

    if (!cursorRecord) {
      throw new NotFoundException(`Cursor ${cursor} not found`);
    }

    return {
      OR: [
        { createdAt: { lt: cursorRecord.createdAt } },
        {
          createdAt: cursorRecord.createdAt,
          id: { lt: cursorRecord.id },
        },
      ],
    };
  }
}
