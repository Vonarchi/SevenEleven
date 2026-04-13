/**
 * Telemetry hooks — wire PostHog/Sentry here. Avoid PII in event payloads.
 * TODO: Initialize PostHog client in a client Provider when keys exist.
 * TODO: Add Sentry for API routes and Edge Functions.
 */

export type TelemetryEvent =
  | { name: "page_view"; path: string }
  | { name: "room_created"; roomCode: string; mode: string }
  | { name: "room_joined"; roomCode: string }
  | { name: "match_started"; matchId: string }
  | { name: "roll_requested"; matchId: string }
  | { name: "purchase_started"; sku: string }
  | { name: "daily_reward_claimed" };

export function trackEvent(event: TelemetryEvent): void {
  if (typeof window === "undefined") {
    return;
  }
  if (process.env.NODE_ENV === "development") {
    console.debug("[telemetry]", event);
  }
  // TODO: posthog.capture(event.name, event)
}
