export const DeliveryStatus = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  DEAD: "dead",
} as const;

export type DeliveryStatusValue =
  (typeof DeliveryStatus)[keyof typeof DeliveryStatus];
