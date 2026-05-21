import { Worker } from "bullmq";
import {
  deliveryBackoffDelayMs,
  getPrismaClient,
  getRedisConnectionOptions,
  MAX_DELIVERY_ATTEMPTS,
  WEBHOOK_DELIVERY_JOB_NAME,
  WEBHOOK_DELIVERY_QUEUE_NAME,
  type WebhookDeliveryJobData,
} from "@webhook-delivery-platform/shared";

import { markDeliveryDead, processDeliveryJob } from "./delivery.processor.js";

const prisma = getPrismaClient();

const worker = new Worker<WebhookDeliveryJobData>(
  WEBHOOK_DELIVERY_QUEUE_NAME,
  async (job) => {
    if (job.name !== WEBHOOK_DELIVERY_JOB_NAME) {
      return;
    }

    await processDeliveryJob(job.data, job.attemptsMade);
  },
  {
    connection: getRedisConnectionOptions(),
    settings: {
      backoffStrategy: (attemptsMade: number) =>
        deliveryBackoffDelayMs(attemptsMade),
    },
  },
);

worker.on("completed", (job) => {
  console.log(
    `Delivery completed jobId=${job.id} attempt=${job.attemptsMade} eventId=${job.data.eventId}`,
  );
});

worker.on("failed", async (job, error) => {
  if (!job) {
    console.error(`Delivery failed: ${error.message}`);
    return;
  }

  console.error(
    `Delivery failed jobId=${job.id} attempt=${job.attemptsMade}/${MAX_DELIVERY_ATTEMPTS} eventId=${job.data.eventId}: ${error.message}`,
  );

  if (job.attemptsMade >= MAX_DELIVERY_ATTEMPTS) {
    await markDeliveryDead(job.data, job.attemptsMade);
    console.error(
      `Delivery dead-lettered eventId=${job.data.eventId} webhookId=${job.data.webhookId}`,
    );
  }
});

console.log(
  `Worker listening on queue "${WEBHOOK_DELIVERY_QUEUE_NAME}" (max ${MAX_DELIVERY_ATTEMPTS} attempts)`,
);

async function shutdown(): Promise<void> {
  await worker.close();
  await prisma.$disconnect();
}

process.on("SIGINT", () => {
  shutdown()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
      console.error(error);
      process.exit(1);
    });
});

process.on("SIGTERM", () => {
  shutdown()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
      console.error(error);
      process.exit(1);
    });
});
