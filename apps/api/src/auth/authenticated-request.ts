import type { Tenant } from "@prisma/client";
import type { Request } from "express";

export type AuthenticatedRequest = Request & {
  tenant: Tenant;
};
