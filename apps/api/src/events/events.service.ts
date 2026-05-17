import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { AppsService } from "../apps/apps.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { WebhookDeliveryQueueService } from "../queue/webhook-delivery-queue.service.js";
import { CreateEventDto } from "./dto/create-event.dto.js";

export type PublishEventResult = {
  event: {
    id: string;
    appId: string;
    eventType: string;
    payload: unknown;
    createdAt: Date;
  };
  enqueuedDeliveries: number;
};

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly appsService: AppsService,
    private readonly deliveryQueue: WebhookDeliveryQueueService,
  ) {}

  async publish(
    tenantId: string,
    appId: string,
    dto: CreateEventDto,
  ): Promise<PublishEventResult> {
    await this.appsService.findOne(tenantId, appId);

    const activeWebhooks = await this.prisma.client.webhook.findMany({
      where: { appId, active: true },
      select: { id: true },
    });

    const event = await this.prisma.client.event.create({
      data: {
        appId,
        eventType: dto.eventType,
        payload: dto.payload as Prisma.InputJsonValue,
      },
    });

    await Promise.all(
      activeWebhooks.map((webhook) =>
        this.deliveryQueue.enqueueDelivery({
          eventId: event.id,
          webhookId: webhook.id,
          appId,
        }),
      ),
    );

    return {
      event,
      enqueuedDeliveries: activeWebhooks.length,
    };
  }
}
