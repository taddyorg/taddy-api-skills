// Throttled Taddy API client: one request, then a 250 ms pause. Node 20+, no dependencies.
// Use it for anything that calls the API in a loop (a cron job, a batch over uuids, polling hash / childrenHash):
// a 250 ms pause plus the response time works out to about 3 requests per second, well under the per-minute rate
// limit, so the loop never sees API_RATE_LIMIT_EXCEEDED.
// A single user-facing request does not need this; call query() from taddy_client.js directly.
// Server-side only: the API key must never reach a browser or mobile bundle.
//
// Usage:
//   import { throttledQuery } from "./taddy_throttled.js";
//   for (const uuid of uuids) {
//     const data = await throttledQuery(`query ($uuid: ID) { getPodcastSeries(uuid: $uuid) { uuid childrenHash } }`, { uuid });
//   }
//
// Call it one at a time (await inside a for loop). The pause only spaces sequential calls; Promise.all over a list
// would still fire every request at once.
//
// Options: same as query() ({ timeoutMs = 30000, signal }), passed straight through. Errors are not caught here;
// a TaddyError from query() propagates unchanged.
//
// Env: TADDY_USER_ID, TADDY_API_KEY (required). The endpoint is always https://api.taddy.org.

import { query } from "./taddy_client.js";

const GAP_MS = 250; // a 250 ms pause after each request

export async function throttledQuery(gql, variables = {}, opts = {}) {
  const data = await query(gql, variables, opts);
  await new Promise((resolve) => setTimeout(resolve, GAP_MS));
  return data;
}

// Smoke test: node scripts/taddy_throttled.js (three calls, about 1 s)
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const started = Date.now();
  try {
    for (let i = 0; i < 3; i++) {
      const data = await throttledQuery(`{ getPodcastSeries(name: "The Daily") { uuid name } }`);
      console.log(JSON.stringify(data.getPodcastSeries));
    }
    console.log(`3 requests in ${Date.now() - started} ms`);
  } catch (err) {
    console.error(`${err.name}: ${err.message}`, err.code ? `(code ${err.code})` : "");
    process.exit(1);
  }
}
