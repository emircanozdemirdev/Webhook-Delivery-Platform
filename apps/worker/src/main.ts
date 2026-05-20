import { Worker } from "bullmq";
import {
  getPrismaClient,
  getRedisConnectionOptions,
  WEBHOOK_DELIVERY_JOB_NAME,
  WEBHOOK_DELIVERY_QUEUE_NAME,
  type WebhookDeliveryJobData,
} from "@webhook-delivery-platform/shared";

import { processDeliveryJob } from "./delivery.processor.js";

const prisma = getPrismaClient();

const worker = new Worker<WebhookDeliveryJobData>(
  WEBHOOK_DELIVERY_QUEUE_NAME,
  async (job) => {
    if (job.name !== WEBHOOK_DELIVERY_JOB_NAME) {
      return;
    }

    await processDeliveryJob(job.data);
  },
  {
    connection: getRedisConnectionOptions(),
  },
);

worker.on("completed", (job) => {
  console.log(
    `Delivery completed jobId=${job.id} eventId=${job.data.eventId} webhookId=${job.data.webhookId}`,
  );
});

worker.on("failed", (job, error) => {
  console.error(
    `Delivery failed jobId=${job?.id ?? "unknown"} eventId=${job?.data.eventId ?? "unknown"}: ${error.message}`,
  );
});

console.log(`Worker listening on queue "${WEBHOOK_DELIVERY_QUEUE_NAME}"`);

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
