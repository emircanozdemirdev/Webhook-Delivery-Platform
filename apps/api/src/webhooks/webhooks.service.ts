import { randomBytes } from "node:crypto";

import { Injectable, NotFoundException } from "@nestjs/common";
import type { Webhook } from "@prisma/client";

import { AppsService } from "../apps/apps.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateWebhookDto } from "./dto/create-webhook.dto.js";
import { UpdateWebhookDto } from "./dto/update-webhook.dto.js";
import { toPublicWebhook, type WebhookCreated, type WebhookPublic } from "./webhook.mapper.js";

@Injectable()
export class WebhooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly appsService: AppsService,
  ) {}

  async create(
    tenantId: string,
    appId: string,
    dto: CreateWebhookDto,
  ): Promise<WebhookCreated> {
    await this.appsService.findOne(tenantId, appId);

    return this.prisma.client.webhook.create({
      data: {
        appId,
        url: dto.url,
        secret: this.generateSecret(),
        active: dto.active ?? true,
      },
    });
  }

  async findAll(tenantId: string, appId: string): Promise<WebhookPublic[]> {
    await this.appsService.findOne(tenantId, appId);

    const webhooks = await this.prisma.client.webhook.findMany({
      where: { appId },
      orderBy: { createdAt: "desc" },
    });

    return webhooks.map(toPublicWebhook);
  }

  async findOne(
    tenantId: string,
    appId: string,
    webhookId: string,
  ): Promise<WebhookPublic> {
    const webhook = await this.getWebhookForTenant(tenantId, appId, webhookId);
    return toPublicWebhook(webhook);
  }

  async update(
    tenantId: string,
    appId: string,
    webhookId: string,
    dto: UpdateWebhookDto,
  ): Promise<WebhookPublic> {
    await this.getWebhookForTenant(tenantId, appId, webhookId);

    const webhook = await this.prisma.client.webhook.update({
      where: { id: webhookId },
      data: {
        ...(dto.url !== undefined ? { url: dto.url } : {}),
        ...(dto.active !== undefined ? { active: dto.active } : {}),
      },
    });

    return toPublicWebhook(webhook);
  }

  async remove(
    tenantId: string,
    appId: string,
    webhookId: string,
  ): Promise<WebhookPublic> {
    await this.getWebhookForTenant(tenantId, appId, webhookId);

    const webhook = await this.prisma.client.webhook.delete({
      where: { id: webhookId },
    });

    return toPublicWebhook(webhook);
  }

  private async getWebhookForTenant(
    tenantId: string,
    appId: string,
    webhookId: string,
  ): Promise<Webhook> {
    await this.appsService.findOne(tenantId, appId);

    const webhook = await this.prisma.client.webhook.findFirst({
      where: { id: webhookId, appId },
    });

    if (!webhook) {
      throw new NotFoundException(`Webhook ${webhookId} not found`);
    }

    return webhook;
  }

  private generateSecret(): string {
    return `whsec_${randomBytes(32).toString("base64url")}`;
  }
}
