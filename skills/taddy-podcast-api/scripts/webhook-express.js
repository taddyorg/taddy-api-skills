// Minimal Taddy webhook receiver. Express 4+, Node 18+.
//
// What a correct receiver does, in order:
//   1. Verify the X-TADDY-WEBHOOK-SECRET header (the secret is shown in the dashboard when you create the webhook).
//   2. Validate the payload shape.
//   3. Return 200 immediately. Any other status is recorded as failed; failed events are kept 14 days and can be
//      resent with the replayFailedWebhookEvents mutation.
//   4. Hand the event to a queue and process it in a worker. Taddy adds ~50k episodes a day; do not do database
//      work inside the request handler to avoid blocking the request handler and be able to handle all webhook events.
//
// Env: TADDY_WEBHOOK_SECRET (required), PORT (optional)

import express from "express";

const SECRET = process.env.TADDY_WEBHOOK_SECRET;
if (!SECRET) throw new Error("TADDY_WEBHOOK_SECRET must be set");

const app = express();
app.use(express.json({ limit: "2mb" }));

app.post("/webhooks/taddy", (req, res) => {
  if (req.get("X-TADDY-WEBHOOK-SECRET") !== SECRET) return res.status(401).end();

  const event = req.body;
  // Every event has: uuid, taddyType ("podcastseries" | "podcastepisode" | "itunesinfo"),
  // action ("created" | "updated" | "deleted"), timestamp (epoch seconds), data (the object),
  // and matchingFilters (only when webhook filters are configured).
  if (!event?.uuid || !event?.taddyType || !event?.action || !event?.data) return res.status(400).end();

  res.status(200).end(); // acknowledge first

  enqueue(event).catch((err) => console.error("enqueue failed", event.uuid, err));
});

async function enqueue(event) {
  // Replace with SQS, Cloudflare Queues, BullMQ, Pub/Sub, etc. The worker that drains the queue should:
  //   - be idempotent: replays and retries deliver the same event more than once
  //   - dedupe on (data.uuid, data.hash): the same hash means nothing changed since the last event
  //   - treat action "updated" with data.isRemoved === true as "the episode left the RSS feed"
  //   - treat action "deleted" as a policy removal: delete or hide the record
  //   - never re-host data.audioUrl / data.imageUrl; store the URLs and play from the source
  console.log(`${event.taddyType}.${event.action}`, event.data.uuid, event.data.hash);
}

app.listen(process.env.PORT || 3000);
