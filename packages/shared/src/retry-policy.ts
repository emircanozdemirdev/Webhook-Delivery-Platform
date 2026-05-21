import type { JobsOptions } from "bullmq";

export const MAX_DELIVERY_ATTEMPTS = 5;

/** Delay before each retry after a failed attempt (ms). Index = attemptsMade - 1. */
export const DELIVERY_BACKOFF_DELAYS_MS = [
  10_000,
  30_000,
  120_000,
  600_000,
] as const;

export function deliveryBackoffDelayMs(attemptsMade: number): number {
  const index = Math.max(0, attemptsMade - 1);

  if (index >= DELIVERY_BACKOFF_DELAYS_MS.length) {
    return DELIVERY_BACKOFF_DELAYS_MS[DELIVERY_BACKOFF_DELAYS_MS.length - 1]!;
  }

  return DELIVERY_BACKOFF_DELAYS_MS[index]!;
}

export function getNextRetryAt(attemptsMade: number, now = Date.now()): Date | null {
  if (attemptsMade >= MAX_DELIVERY_ATTEMPTS) {
    return null;
  }

  return new Date(now + deliveryBackoffDelayMs(attemptsMade));
}

export function getDeliveryJobOptions(): Omit<JobsOptions, "jobId"> {
  return {
    attempts: MAX_DELIVERY_ATTEMPTS,
    backoff: {
      type: "custom",
    },
  };
}
