import { getAppConfig } from "@webhook-delivery-platform/shared";

const config = getAppConfig();

console.log(`Worker bootstrap placeholder (Redis: ${config.redis.url})`);
