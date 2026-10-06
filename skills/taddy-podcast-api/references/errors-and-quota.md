# Errors and quota

Read this when a Taddy API call fails, when the user pastes an error code, or when they ask about API requests, transcript credits, cost, or rate limits. It is self-contained.

## Response shape

Every request is `POST https://api.taddy.org` with headers `Content-Type: application/json`, `X-USER-ID`, `X-API-KEY`. A success has the result under `data`. Failures come in two tiers, and both put the code in `errors[]`:

- **HTTP 400, 401, 429**: the request was rejected before it ran. The body has `errors[]` and no `data`. Auth, rate limit, syntax, and complexity errors arrive this way.
- **HTTP 200 with `errors[]`**: the request ran but some or all fields failed. Fields that succeeded are still in `data`, so a 200 is not a success until you have checked `errors[]`.

```json
{
  "errors": [ { "code": "BAD_USER_INPUT", "message": "uuid must be 36 characters" } ],
  "data": { "getPodcastEpisode": null }
}
```

Surface `errors[0].code` (fall back to `errors[0].extensions.code`) in the exception your client throws, so callers can branch on it. Read it from the body on 4xx responses too; do not collapse every non-2xx into a generic HTTP error, or `API_KEY_INVALID` and `API_RATE_LIMIT_EXCEEDED` become indistinguishable.

## Error codes and fixes

| Code | HTTP | Meaning | Fix |
| --- | --- | --- | --- |
| `API_KEY_INVALID` | 401 | `X-USER-ID` or `X-API-KEY` missing or wrong | Confirm both headers are sent on every request and read from `TADDY_USER_ID` / `TADDY_API_KEY`. The user id is a number, the key a string. Regenerate at https://taddy.org/dashboard if in doubt. Never log the key while debugging. |
| `API_RATE_LIMIT_EXCEEDED` | 429 | The **per-minute** rate limit was hit, or the **monthly** request quota is used up | Run `{ getApiRequestsRemaining }`. If it is above zero this was a burst: batch the calls (see below) and send the loop through `scripts/taddy_throttled.js` or `scripts/taddy_throttled.py`, which pauses 250 ms after every request so a loop never reaches the per-minute limit. If it is zero the month's quota is gone and retrying is pointless; reduce usage with the list below, or the account owner upgrades. Never tight-loop on this code; a steady 429 is a quota problem, not a transient one. |
| `INVALID_QUERY_OR_SYNTAX` | 400 | GraphQL syntax error, unknown field, a required argument is missing, or a selection leaves out its key field | Read `message`; it names the problem. Check every field and argument against `references/schema.graphql`. "The type X is required to return the property Y. Inside of Z please add the property Y to the query." means the selection (or a fragment on that type) must include the key field: `uuid` on `PodcastSeries`, `PodcastEpisode`, `Person`, `iTunesInfo`; `id` on `TranscriptItem` and `Chapter`; `url` on `TranscriptLink` and `ChapterLink`; `searchId`, `topChartsId`, `popularityRankId` on the search, top-charts and popularity results. The schema marks these nullable, but the API still requires them in the query. If the field is genuinely new, fetch the live schema (see the escape hatch in SKILL.md). |
| `QUERY_TOO_COMPLEX` | 400 | The query's computed cost is over the limit | Every field you request adds to the cost, and fields inside a list are multiplied by the number of items requested, so `limitPerPage` is a multiplier. The error's `extensions.queryCost` and `extensions.maxQueryCostAllowed` give you an estimate of how much to cut. Remove nested lists and expensive fields: `episodes { ... }` inside a batch query, `transcript` or `transcriptWithSpeakersAndTimecodes` on every episode in a list, `persons`, `chapters`. Split into two requests: a cheap list, then details for the item the user opens. Lower `limitPerPage`. |
| `BAD_USER_INPUT` | 200 | An argument value is invalid | Read `message`. Common causes: uuid not 36 characters, `itunesId` sent as a string, an enum value that is not in the schema, `page` or `limitPerPage` over the max (see `references/pagination.md`), more than 25 uuids in `getMultiple*`, more than 1,000 in `getLatestPodcastEpisodes`. |
| `REQUIRES_USER_AUTHENTICATION` | 200 | The query or mutation needs a logged-in user context | Only affects mutations and account queries (webhook management, `me`). Make sure the headers are present; if they are, this is account state for support. |
| `ACCESS_NOT_ALLOWED` | 200 | Your account plan does not include this feature | Webhooks are a paid feature; paginating `getLatestPodcastEpisodes` past page 1 is paid. If `message` starts "You need to be a Pro or Business Taddy API user to access the transcript for this episode", a Free account asked for a transcript Taddy generated: show a plan message and do not retry. Podcast-provided transcripts still work on the Free plan; pass `useOnlyPodcastProvidedTranscript: true` and the request returns null instead of this error when the podcast publishes none. Tell the user which feature gated the call and point them at https://taddy.org/developers/pricing rather than quoting numbers. |
| `TADDY_SERVER_ERROR` | 200 | Something failed on Taddy's side | Retry once with backoff. If it persists, status page and danny@taddy.org. Not a bug in your query. |

HTTP-level failures (network errors, timeouts, 5xx with no JSON body) should be retried with backoff. GraphQL `errors[]` should not, with two exceptions: `TADDY_SERVER_ERROR` (once, with backoff) and a 429 `API_RATE_LIMIT_EXCEEDED` while `getApiRequestsRemaining` is still above zero (once, after a pause). The starter clients apply a 30-second request timeout by default (`timeoutMs` in Node, `timeout` in Python) and throw `code: "TIMEOUT"` when it elapses; treat it like any other network failure.

## Two separate quotas

| Quota | What consumes it | Check |
| --- | --- | --- |
| API requests per month | Every request. Cached responses are not counted towards this quota. | `{ getApiRequestsRemaining }` |
| Episode transcript credits per month | The first fetch in the billing month of each transcript Taddy generated, whether Taddy transcribed it earlier (top 5,000 shows, `taddyTranscribeStatus: COMPLETED`) or generates it on demand for this request. Episode transcripts provided by the podcast itself (VTT or SRT in the feed) are free on every plan and do not consume a credit. | `{ getTranscriptCreditsRemaining }` |

Rules that change how you design a feature:

- Cached responses do not count towards your API limits. Repeating the same query is cheap; varying it is not.
- Receiving webhook events are free and do not count towards your API limits.
- A Taddy-generated transcript costs one credit the first time the account fetches it in a billing month, even when Taddy transcribed it long ago for a top-5,000 show. The same episode requested again in the same month counts once, so re-requests do not drain credits. Load transcripts on an explicit user action, not for every episode in a list.
- Transcripts provided by the podcast itself (VTT or SRT in the feed) are free on every plan and do not count towards your transcript credits.
- `useOnDemandCreditsIfNeeded: false` on `getEpisodeTranscript` stops Taddy from generating a transcript for this request; it returns nothing when no transcript exists yet. It does not make an already-generated Taddy transcript free: fetching one still spends the credit.
- `useOnlyPodcastProvidedTranscript: true` on `getEpisodeTranscript`, `transcript` or `transcriptWithSpeakersAndTimecodes` returns only a transcript the podcast published itself, never generates one and never spends a credit, on every plan. It overrides `useOnDemandCreditsIfNeeded`. Use it for Free-plan apps and for any request that must cost nothing; expect null for most episodes, since about 1% of podcasts publish transcripts.

## Transcript result is null or empty

`getEpisodeTranscript` (and the `transcript` fields on `PodcastEpisode`) return null without an `errors[]` entry for every failure except the Free-plan `ACCESS_NOT_ALLOWED` case above. Causes, and how to tell them apart:

| Cause | How to recognise it |
| --- | --- |
| No transcript exists and `useOnDemandCreditsIfNeeded: false` | `taddyTranscribeStatus` on the episode is not `COMPLETED` |
| `useOnlyPodcastProvidedTranscript: true` and the podcast publishes no transcript | Expected for about 99% of podcasts; nothing to retry, show the "no transcript available" state |
| Free plan and the episode would need on-demand transcription | `{ getTranscriptCreditsRemaining }` is 0 on a Free account; an episode Taddy already transcribed gives `ACCESS_NOT_ALLOWED` instead |
| Paid plan out of credits | `{ getTranscriptCreditsRemaining }` is 0. The request does not fall back to a podcast-provided file |
| Generation took longer than about 5 minutes | Very long episode; the transcript is not kept, so request it again later |

## Cutting request volume

1. Batch: `getMultiplePodcastSeries` and `getMultiplePodcastEpisodes` take up to 25 uuids per request.
2. Feeds: `getLatestPodcastEpisodes` takes up to 1,000 uuids or RSS urls and returns the newest episodes across all of them in one request. Use this instead of looping over subscriptions calling `getPodcastSeries` each time.
3. Webhooks instead of polling. If polling is unavoidable, compare `hash` and `childrenHash` on `PodcastSeries`, only fetch episodes when `childrenHash` changed, and run the poll through `scripts/taddy_throttled.js` or `scripts/taddy_throttled.py`.
4. Request only the fields the UI renders. Smaller queries are also less likely to hit `QUERY_TOO_COMPLEX`.
5. Store what you fetch. API metadata (names, descriptions, uuids, hashes, transcripts) may be kept in your own database and served to users. Audio, video, and artwork must be served from the original URLs, never re-hosted. Policy: https://taddy.org/terms-of-service/developer-policy.

## When the query API is the wrong tool

- Copying the whole directory (millions of podcasts and hundreds of millions of episodes) is an enterprise one-time export plus webhooks to stay in sync, not paginated queries. See `references/bulk-download-podcastseries.md`.
- Adding a podcast to the directory is a REST call, `POST https://taddy.org/feeds/add-podcastseries`, not a GraphQL mutation. See `references/add-a-podcastseries-to-taddy.md`.
- Testing webhook filters without waiting for new episodes: the `mockWebhookEvent` mutation. Recovering events your endpoint failed to acknowledge: `replayFailedWebhookEvents` (14-day window).
