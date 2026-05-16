import { randomBytes } from "node:crypto";

import { Injectable } from "@nestjs/common";
import type { Tenant } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service.js";
import { CreateTenantDto } from "./dto/create-tenant.dto.js";

export type TenantCreatedResponse = Tenant & {
  apiKey: string;
};

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTenantDto): Promise<TenantCreatedResponse> {
    const apiKey = this.generateApiKey();

    return this.prisma.client.tenant.create({
      data: {
        name: dto.name,
        apiKey,
      },
    });
  }

  getCurrent(tenant: Tenant): Tenant {
    return tenant;
  }

  private generateApiKey(): string {
    return `whk_${randomBytes(32).toString("base64url")}`;
  }
}
