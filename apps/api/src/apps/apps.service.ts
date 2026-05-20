import { Injectable, NotFoundException } from "@nestjs/common";
import type { App } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service.js";
import { CreateAppDto } from "./dto/create-app.dto.js";
import { UpdateAppDto } from "./dto/update-app.dto.js";

@Injectable()
export class AppsService {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, dto: CreateAppDto): Promise<App> {
    return this.prisma.client.app.create({
      data: {
        tenantId,
        name: dto.name,
      },
    });
  }

  findAll(tenantId: string): Promise<App[]> {
    return this.prisma.client.app.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(tenantId: string, appId: string): Promise<App> {
    const app = await this.prisma.client.app.findFirst({
      where: { id: appId, tenantId },
    });

    if (!app) {
      throw new NotFoundException(`App ${appId} not found`);
    }

    return app;
  }

  async update(
    tenantId: string,
    appId: string,
    dto: UpdateAppDto,
  ): Promise<App> {
    await this.findOne(tenantId, appId);

    return this.prisma.client.app.update({
      where: { id: appId },
      data: { name: dto.name },
    });
  }

  async remove(tenantId: string, appId: string): Promise<App> {
    await this.findOne(tenantId, appId);

    return this.prisma.client.app.delete({
      where: { id: appId },
    });
  }
}
