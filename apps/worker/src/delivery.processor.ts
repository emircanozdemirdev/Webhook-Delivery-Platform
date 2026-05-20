import { fetch } from "undici";
import {
  buildWebhookSignatureHeaders,
  DeliveryStatus,
  getPrismaClient,
  type WebhookDeliveryJobData,
} from "@webhook-delivery-platform/shared";

const DELIVERY_TIMEOUT_MS = 30_000;
const MAX_RESPONSE_BODY_LENGTH = 2_000;

type WebhookPayload = {
  id: string;
  type: string;
  payload: unknown;
  createdAt: string;
};

export async function processDeliveryJob(
  data: WebhookDeliveryJobData,
): Promise<void> {
  const prisma = getPrismaClient();

  const [event, webhook] = await Promise.all([
    prisma.event.findFirst({
      where: { id: data.eventId, appId: data.appId },
    }),
    prisma.webhook.findFirst({
      where: { id: data.webhookId, appId: data.appId, active: true },
    }),
  ]);

  if (!event || !webhook) {
    throw new Error(
      `Missing event or active webhook for job eventId=${data.eventId} webhookId=${data.webhookId}`,
    );
  }

  const bodyPayload: WebhookPayload = {
    id: event.id,
    type: event.eventType,
    payload: event.payload,
    createdAt: event.createdAt.toISOString(),
  };

  const body = JSON.stringify(bodyPayload);
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureHeaders = buildWebhookSignatureHeaders(
    webhook.secret,
    body,
    timestamp,
  );

  let httpStatus: number | null = null;
  let responseBody: string | null = null;
  let errorMessage: string | null = null;
  let status: string = DeliveryStatus.FAILED;

  try {
    const response = await fetch(webhook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...signatureHeaders,
      },
      body,
      signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
    });

    httpStatus = response.status;
    responseBody = truncate(await response.text(), MAX_RESPONSE_BODY_LENGTH);

    if (response.ok) {
      status = DeliveryStatus.SUCCESS;
    } else {
      errorMessage = `Webhook returned HTTP ${response.status}`;
    }
  } catch (error: unknown) {
    errorMessage =
      error instanceof Error ? error.message : "Unknown delivery error";
  }

  await prisma.deliveryAttempt.create({
    data: {
      eventId: event.id,
      webhookId: webhook.id,
      attempt: 1,
      status,
      httpStatus: httpStatus ?? undefined,
      responseBody: responseBody ?? undefined,
      errorMessage: errorMessage ?? undefined,
    },
  });

  if (status !== DeliveryStatus.SUCCESS) {
    throw new Error(errorMessage ?? "Webhook delivery failed");
  }
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
}
