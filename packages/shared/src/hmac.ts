import { createHmac } from "node:crypto";

export const WEBHOOK_SIGNATURE_HEADER = "x-webhook-signature";
export const WEBHOOK_TIMESTAMP_HEADER = "x-webhook-timestamp";

export function buildWebhookSignature(
  secret: string,
  body: string,
  timestamp: number,
): string {
  const signedPayload = `${timestamp}.${body}`;
  const digest = createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  return `sha256=${digest}`;
}

export function buildWebhookSignatureHeaders(
  secret: string,
  body: string,
  timestamp: number = Math.floor(Date.now() / 1000),
): Record<string, string> {
  return {
    [WEBHOOK_SIGNATURE_HEADER]: buildWebhookSignature(secret, body, timestamp),
    [WEBHOOK_TIMESTAMP_HEADER]: String(timestamp),
  };
}
