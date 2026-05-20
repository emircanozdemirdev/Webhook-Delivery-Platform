import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { getPrismaClient } from "@webhook-delivery-platform/shared";
import type { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly client: PrismaClient = getPrismaClient();

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }
}
