import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service.js";
import type { AuthenticatedRequest } from "./authenticated-request.js";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const apiKey = this.extractApiKey(request.headers["x-api-key"]);

    if (!apiKey) {
      throw new UnauthorizedException("Missing x-api-key header");
    }

    const tenant = await this.prisma.client.tenant.findUnique({
      where: { apiKey },
    });

    if (!tenant) {
      throw new UnauthorizedException("Invalid API key");
    }

    request.tenant = tenant;
    return true;
  }

  private extractApiKey(
    header: string | string[] | undefined,
  ): string | undefined {
    if (typeof header === "string" && header.length > 0) {
      return header;
    }

    if (Array.isArray(header) && header[0]) {
      return header[0];
    }

    return undefined;
  }
}
