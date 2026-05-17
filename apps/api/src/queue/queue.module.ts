import { Global, Module } from "@nestjs/common";

import { WebhookDeliveryQueueService } from "./webhook-delivery-queue.service.js";

@Global()
@Module({
  providers: [WebhookDeliveryQueueService],
  exports: [WebhookDeliveryQueueService],
})
export class QueueModule {}
