import type { ConnectionOptions } from "bullmq";

import { getAppConfig } from "./config.js";

export const WEBHOOK_DELIVERY_QUEUE_NAME = "webhook-delivery";

export const WEBHOOK_DELIVERY_JOB_NAME = "deliver";

export type WebhookDeliveryJobData = {
  eventId: string;
  webhookId: string;
  appId: string;
};

export function getRedisConnectionOptions(
  env: NodeJS.ProcessEnv = process.env,
): ConnectionOptions {
  const redisUrl = getAppConfig(env).redis.url;
  const parsed = new URL(redisUrl);

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 6379,
    username: parsed.username || undefined,
    password: parsed.password || undefined,
    maxRetriesPerRequest: null,
  };
}
