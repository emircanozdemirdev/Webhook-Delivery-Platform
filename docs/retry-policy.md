# Retry policy

Webhook deliveries use BullMQ with a fixed backoff schedule and a hard attempt cap.

## Attempts

- **Maximum attempts:** 5 per delivery job
- Each attempt creates a `DeliveryAttempt` row with an incrementing `attempt` number

## Backoff delays

After a failed attempt, the next retry is delayed by:

| After attempt | Delay before next try |
|---------------|------------------------|
| 1 | 10 seconds |
| 2 | 30 seconds |
| 3 | 2 minutes |
| 4 | 10 minutes |

Attempt **5** is the last try. If it fails, the delivery is marked **`dead`** (no further retries).

## Statuses

| Status | Meaning |
|--------|---------|
| `success` | Webhook endpoint returned a 2xx response |
| `failed` | Attempt failed; another retry may be scheduled |
| `dead` | All attempts exhausted |

## Configuration

Shared constants and job options live in `packages/shared/src/retry-policy.ts`. The API applies them when enqueueing jobs; the worker implements the custom backoff strategy.
