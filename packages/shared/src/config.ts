import { config as loadDotEnv } from "dotenv";

loadDotEnv();

export type AppConfig = {
  api: {
    port: number;
  };
  database: {
    url: string;
  };
  redis: {
    url: string;
  };
};

const DEFAULT_API_PORT = 3000;
const DEFAULT_DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5432/webhook_delivery";
const DEFAULT_REDIS_URL = "redis://localhost:6379";

export function getAppConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    api: {
      port: parsePort(env.API_PORT),
    },
    database: {
      url: env.DATABASE_URL ?? DEFAULT_DATABASE_URL,
    },
    redis: {
      url: env.REDIS_URL ?? DEFAULT_REDIS_URL,
    },
  };
}

function parsePort(value: string | undefined): number {
  if (!value) {
    return DEFAULT_API_PORT;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error(`Invalid API_PORT value: ${value}`);
  }

  return parsed;
}
