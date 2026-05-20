import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Queue } from "bullmq";
import {
  getRedisConnectionOptions,
  WEBHOOK_DELIVERY_JOB_NAME,
  WEBHOOK_DELIVERY_QUEUE_NAME,
  type WebhookDeliveryJobData,
} from "@webhook-delivery-platform/shared";

@Injectable()
export class WebhookDeliveryQueueService implements OnModuleDestroy {
  private readonly queue = new Queue<WebhookDeliveryJobData>(
    WEBHOOK_DELIVERY_QUEUE_NAME,
    {
      connection: getRedisConnectionOptions(),
    },
  );

  async enqueueDelivery(data: WebhookDeliveryJobData): Promise<void> {
    await this.queue.add(WEBHOOK_DELIVERY_JOB_NAME, data);
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue.close();
  }
}
