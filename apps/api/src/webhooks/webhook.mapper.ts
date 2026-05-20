import type { Webhook } from "@prisma/client";

export type WebhookPublic = Omit<Webhook, "secret">;

export type WebhookCreated = Webhook;

export function toPublicWebhook(webhook: Webhook): WebhookPublic {
  const { secret: _secret, ...publicWebhook } = webhook;
  return publicWebhook;
}
