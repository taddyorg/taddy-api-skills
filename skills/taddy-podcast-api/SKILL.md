---
name: taddy-podcast-api
description: 'Build against the Taddy API (api.taddy.org), a GraphQL API for podcast data: details on any podcast or episode, full-text search, latest episodes across a list of podcasts, Apple top charts, episode transcripts, and webhooks for new or updated podcasts or episodes. Use this skill whenever the user mentions Taddy, a podcast API, podcast or episode data, transcripts, podcast or episode search, podcast webhooks, RSS feed monitoring, or podcast charts, or is building anything that needs podcast data (a player, a feed, a newsletter, brand monitoring, a research tool), even if they never say "Taddy". Also use it for Taddy error codes, API key and auth setup, rate limits, API request counts, or transcript credits.'
license: MIT
metadata:
  version: "0.1.0"
  updated: "2026-10-06"
  source: "https://github.com/taddyorg/taddy-api-skills"
---

# Taddy Podcast API Skill

Taddy Podcast API is a GraphQL API with details about over 4 million podcasts and 200 million episodes: full-text search for podcasts and episodes, Apple top charts, episode transcripts, and webhooks for new or updated podcast data. One endpoint: `POST https://api.taddy.org`.

## Start here: pick the workflow from the codebase

Search the project before writing anything:

```
grep -rn "TADDY_USER_ID\|TADDY_API_KEY\|api.taddy.org\|taddy" --include=*.{js,ts,tsx,py,rb,go,env,example,graphql,yml,yaml} .
```

- Existing client found, plain or typed → **Workflow B** (add or modify a query). Do not redo setup. A codegen config or `.graphql` documents mean the project is typed: add operations the same way and regenerate.
- Nothing found → **Workflow A** (initial setup), then B.
- User pasted an error code, or asks about quota, credits, or "why is this slow or failing" → **Workflow C** (debug).

## Workflow A: initial setup (once per project)

1. **Endpoint and auth.** `POST https://api.taddy.org`, `Content-Type: application/json`, headers `X-USER-ID` and `X-API-KEY`. Read them from env vars named exactly `TADDY_USER_ID` and `TADDY_API_KEY` (this is how the triage step finds the integration later). Keys come from https://taddy.org/dashboard.
2. **Security boundary.** The key lives server-side only: a server route, serverless function, or backend-for-frontend. Never in a browser bundle, mobile binary, public env var (`NEXT_PUBLIC_*`, `VITE_*`, `EXPO_PUBLIC_*`), source control, URL, log line, or error message. If the app is a static site or a client-only app with no backend, add a proxy first and say so; do not call Taddy from the client. A safe proxy exposes a few fixed operations (search, lookup) rather than forwarding raw GraphQL, locks CORS to the site's origin, and rate limits per client, so a visitor cannot drain the monthly quota.
3. **Client.** Decide by how central podcast data is. *Side feature* (one or two queries, a script, a cron job, a search box on a non-podcast app): reuse the project's HTTP client (fetch, axios, requests, httpx); it is one POST, so no GraphQL library and no new dependency. *Podcast data is the product* (player, subscription feed, discovery app, several operations, UI components that share podcast and episode shapes): use a typed client generated from the schema. TypeScript default: GraphQL Code Generator introspecting `https://api.taddy.org` at build time (no credentials needed; the bundled `references/schema.graphql` is for reading, not for the build), operations as `.graphql` files, transport `graphql-request`. Other languages, the layout, and the reasoning: `references/graphql-client-libraries.md`. Typed or not, the key stays server-side and every quota and complexity rule in this skill still applies.
4. **Create the client** in the project's language: `query(gql, variables)` that sends the POST with a default request timeout (30 s; a timeout throws with code `TIMEOUT`), throws on non-2xx, and throws on a non-empty `errors[]` with the error `code` attached. Adapt `scripts/taddy_client.js` or `scripts/taddy_client.py`. Anything that calls the API in a loop (a cron job, a batch over uuids, polling) goes through `scripts/taddy_throttled.js` or `scripts/taddy_throttled.py` instead of calling `query` directly: it pauses 250 ms after each request, so the loop stays under the per-minute rate limit and never sees `API_RATE_LIMIT_EXCEEDED`. A single user-facing request does not need it. Typed path: copy `scripts/codegen.ts`, `scripts/graphql/` (fragments, queries) and `scripts/taddy_client_typed.ts`, run the codegen (needs network), keep the same error contract.
5. **Design storage in from the start.** You may store API metadata (names, descriptions, uuids, hashes, podcast or episode art, transcripts) in your own database and serve it to your users. Do not re-host the podcast audio or video: play them from the original URLs so creator analytics survive. Developer policy: https://taddy.org/terms-of-service/developer-policy.
6. **Smoke test** with one small query, for example `{ getPodcastSeries(name:"The Daily"){ uuid name } }`.
7. **Verify:** key never crosses a client boundary; every request goes to `https://api.taddy.org`; non-2xx and `errors[]` both surface with the code; env var names are exactly as above; on the typed path the codegen run and the type check pass; the codegen introspects `https://api.taddy.org`, so CI needs outbound network for that step, or the generated `operations.ts` is committed.

## Workflow B: add or update a query (most of the time)

1. Pick the query from the decision table below and open only that reference page.
2. Open `references/schema.graphql` for the exact argument and field names. Never invent a field. If a field is marked `@deprecated`, use the replacement named in its reason. In a typed project the compiler checks fields against the live schema when the codegen runs, but still read the bundled schema for deprecation reasons and argument semantics; add the operation as a `.graphql` document next to the existing ones and regenerate instead of hand-writing result types.
3. Request only the fields (or fragments in a typed project) the feature renders. Try to avoid nested lists (`episodes { ... }` inside a batch query) as they are what trigger `QUERY_TOO_COMPLEX`. You can split into multiple requests if you need to.
4. Bound every pagination loop using `references/pagination.md`. Every list query has a max page and max page size, and the free tier has extra limits on `getLatestPodcastEpisodes`.
5. **Transcripts** are the query most likely to spend credits or slow down a response. Fetch them with a separate `getEpisodeTranscript` query rather than the `transcript` fields on `PodcastEpisode`: if Taddy has to generate the transcript on demand (about 10 seconds per hour of audio), the episode details are not held back waiting for it. A credit is spent at most once per episode per billing month, however many times that episode is requested, and podcast-provided transcripts (VTT or SRT in the feed) are free for Free and Paid users and never use a credit. On the Free plan, or whenever a request must not spend a credit, pass `useOnlyPodcastProvidedTranscript: true`: it returns null instead of `ACCESS_NOT_ALLOWED` when the podcast publishes no transcript. Details: `references/episode-transcripts.md`.
6. **Knowing when new or updated podcasts or episodes are available** Instead of polling, prefer webhooks (Business plan) to instantly know when new or updated podcasts or episodes are available. A webhook endpoint is a public HTTPS endpoint you control that Taddy sends webhook notifications to, not a query you send. You register it in the dashboard, pick the events (`podcastseries.*`, `podcastepisode.*`, `itunesinfo.*`), and add regex filters if the user only wants some shows. The handler verifies `X-TADDY-WEBHOOK-SECRET`, returns `200` before doing any work, then writes the payload to your app's own database. Test with `mockWebhookEvent`; if the endpoint was down, `replayFailedWebhookEvents` resends what events were missed. Webhooks are also the only area with mutations: endpoints and filters can be created from code (`addWebhookUrlForUser`, `addWebhookFilter`, and the matching update and delete mutations) when the app manages webhooks on behalf of its users. If polling is unavoidable, compare `hash` (podcast details changed) and `childrenHash` (episodes changed) instead of re-fetching the full list, batch the uuids (25 per `getMultiplePodcastSeries`, 1,000 per `getLatestPodcastEpisodes`), and run the loop through `scripts/taddy_throttled.js` or `scripts/taddy_throttled.py` so it stays under the per-minute rate limit. Starter handler: `scripts/webhook-express.js`. Details: `references/webhooks.md`, `references/webhook-filters.md`, `references/replay-webhook-events.md`. 
7. **Verify:** every field in the query exists in the schema; pagination is bounded; the field list is minimal; nothing polls where a webhook or hash check fits; epoch-second dates are converted correctly.

## Workflow C: debug or answer a question

The error codes are `API_KEY_INVALID`, `API_RATE_LIMIT_EXCEEDED` (per-minute limit or monthly quota), `INVALID_QUERY_OR_SYNTAX`, `QUERY_TOO_COMPLEX`, `BAD_USER_INPUT`, `REQUIRES_USER_AUTHENTICATION`, `ACCESS_NOT_ALLOWED`, `TADDY_SERVER_ERROR`; they arrive in `errors[].code`. The first four come with HTTP 401, 429, 400, 400 and no `data` (the request was rejected before it ran); the rest come with HTTP 200 and partial `data`, so check `errors[]` on every response. Open `references/errors-and-quota.md`. It maps each code to a fix, and explains the two separate quotas (API requests and transcript credits).

## When the skill and the API disagree, or a use case did not work

At the end of the task, offer to report it to Taddy when the API contradicted this skill (a field, limit or behaviour from the schema or a reference page did not hold), when the user settled for a workaround or gave up, or when a reference page was unclear enough to cost several attempts. Open `references/skill-feedback.md`, write the draft it describes, run `scripts/taddy_feedback.js` without `--send` to scrub it, show the user the printed report, and run `--send` only after they say yes. Never send on your own, and never put app names, customer data or application code in the report.

## Query decision table

| Intent | Query | Reference page |
| --- | --- | --- |
| One podcast by name, uuid, iTunes id, or RSS url | `getPodcastSeries` | `references/get-podcast-series.md` |
| A podcast's episodes, paged | `getPodcastSeries { episodes(...) }` | `references/get-podcast-series.md` |
| One episode by uuid, guid, or name | `getPodcastEpisode` | `references/get-podcast-episode.md` |
| Up to 25 podcasts or episodes at once | `getMultiplePodcastSeries`, `getMultiplePodcastEpisodes` | `references/get-multiple-podcast-series.md`, `references/get-multiple-podcast-episodes.md` |
| Full-text search over titles, show notes and podcast or people names, with filters (genre, language, date, duration, has transcript). Transcript text is not searched | `search` | `references/search.md` |
| Feed of newest episodes across a user's subscriptions (up to 1,000 shows per request) | `getLatestPodcastEpisodes` | `references/latest-episodes-from-multiple-podcasts.md` |
| Today's Apple top charts by country or genre | `getTopChartsByCountry(taddyType:, country:)`, `getTopChartsByGenres(taddyType:, genres:)` | `references/get-top-charts.md` |
| Most popular podcasts overall, by language or genre | `getPopularContent` | `references/most-popular-podcasts.md` |
| Episode transcript, plain or with speakers and timecodes | `getEpisodeTranscript` | `references/episode-transcripts.md` |
| Episode chapters | `getEpisodeChapters` | `references/get-podcast-episode.md` |
| Be told when podcasts or episodes are added or updated | Webhooks (dashboard setup), optional regex filters | `references/webhooks.md`, `references/webhook-filters.md` |
| Detect changes without webhooks | `hash`, `childrenHash` on `PodcastSeries` | `references/podcastseries.md` |
| Add a podcast to the directory | REST `POST https://taddy.org/feeds/add-podcastseries` | `references/add-a-podcastseries-to-taddy.md` |
| A copy of the whole directory | Not the query API; enterprise export plus webhooks | `references/bulk-download-podcastseries.md` |
| Remaining monthly requests or transcript credits | `getApiRequestsRemaining`, `getTranscriptCreditsRemaining` | `references/errors-and-quota.md` |

## Gotchas that bite every integration

- Multiple podcasts or episodes can have the same name. Prefer `uuid` once you have one.
- Multiple episodes can have the same `guid`. `guid` is only garunteed to be unique within a podcast. Prefer `uuid` once you have one.
- `datePublished` and every other date is epoch **seconds**. Transcript `startTimecode` and `endTimecode` are **milliseconds**.
- `itunesId` is a `Float` (64-bit), not `Int`. Type it as a number that can exceed 2^31.
- `description` contains HTML unless you request `description(shouldStripHtmlTags: true)`.
- `isRemoved: true` means the episode left the RSS feed; the uuid still resolves. `isBlocked: true` means it violated distribution policy and will not update.
- `getPodcastSeries(name:)` returns the most popular match when names collide. Prefer `uuid` or `rssUrl` once you have one.
- `episodes` defaults to the latest 10. `getLatestPodcastEpisodes` returns 25 per page and the free tier cannot page past 1.
- There is a per-minute rate limit as well as the monthly quota. A loop with no gap between requests trips `API_RATE_LIMIT_EXCEEDED` within seconds. Batch first, then call through `scripts/taddy_throttled.js` or `scripts/taddy_throttled.py` (one request, then a 250 ms pause).
- The `transcript` field on an episode can hold the whole response for 10+ seconds while on-demand transcription runs. Fetch it separately with `getEpisodeTranscript` if this is a user-facing feature.
- Genre filters are exact matches: `filterForGenres` on `search`, `genres` on `getTopChartsByGenres` and `filterByGenres` on `getPopularContent` never expand a parent genre into its sub-genres. To cover a category pass the parent and every sub-genre (all values sharing its prefix in `references/genre.md`; `search` takes up to 25). Podcasts usually carry the parent next to the sub-genre, so the parent alone mostly works for podcasts, but episode top charts are tagged with the podcast's first genre (usually the sub-genre) and miss most episodes on the parent alone. A podcast in several of the requested charts can appear twice.
- `search` indexes episode and podcast titles, show notes, podcast names and author, owner and persons fields. It never indexes transcript text, so a company discussed in audio but absent from the notes is not findable with `search`;
- Every object selection must include its key field (`uuid`, `id`, `url`, `searchId`, `topChartsId`, `popularityRankId`. `getEpisodeTranscript { text }` without `id` is rejected.
- Transcript `startTimecode` and `endTimecode` come from the audio copy Taddy transcribed. On feeds with dynamic ad insertion the listener's file carries different ads, so the offset drifts in either direction and changes after every ad break, and the API exposes no ad positions or transcribed-audio length.
- `taddyType` is required on both top-charts queries: `PODCASTSERIES` fills `podcastSeries`, `PODCASTEPISODE` fills `podcastEpisodes`, and the other list comes back empty. Episodes by genre also need `filterByCountry`.
- Webhook `podcastepisode.updated` with `isRemoved: true` is how removal is signalled; `*.deleted` is reserved for policy violations. Verify `X-TADDY-WEBHOOK-SECRET` and return `200` fast, or the event is recorded as failed.
- Webhook filter clauses are ANDed inside a filter and ORed across filters; an event type with no filter delivers everything. "Title or show notes" is two filters, not one filter with two clauses.
- A webhook filter regex is case-insensitive and unanchored (`apple` matches "pineapple"), `description` is matched as raw HTML, and null, empty or `false` values never match, so you cannot filter for `isRemoved` being false.

## Reference routing

Open the page that matches the task; each is self-contained. Type pages (PodcastSeries, PodcastEpisode, enums) are linked from the query pages.

| Need | File |
| --- | --- |
| Exact field and argument names, deprecations | `references/schema.graphql` |
| Page sizes, max pages, free-tier limits, stop conditions | `references/pagination.md` |
| Plain HTTP client or typed GraphQL client, per language and stack | `references/graphql-client-libraries.md` |
| Error codes, quotas, cost control, what support must answer | `references/errors-and-quota.md` |
| Podcast lookup and episode paging | `references/get-podcast-series.md` |
| Episode lookup and chapters | `references/get-podcast-episode.md` |
| Batch lookup | `references/get-multiple-podcast-series.md`, `references/get-multiple-podcast-episodes.md` |
| Search, filters, sorting, matching | `references/search.md` |
| Subscription feed | `references/latest-episodes-from-multiple-podcasts.md` |
| Top charts | `references/get-top-charts.md` |
| Popularity | `references/most-popular-podcasts.md` |
| Transcripts, credits, statuses | `references/episode-transcripts.md` |
| Webhooks: events, payloads, architecture, filter fields and matching rules, filter types, mock and replay semantics | `references/webhooks.md`, `references/webhook-filters.md`, `references/webhook-filter-type.md`, `references/replay-webhook-events.md` |
| Enum values for arguments | `references/genre.md`, `references/country.md`, `references/language.md`, `references/feed-refresh-details.md` |
| Type shapes | `references/podcastseries.md`, `references/podcastepisode.md`, `references/itunesinfo.md`, `references/person.md` |
| Throttled requests for loops, cron jobs, polling | `scripts/taddy_throttled.js`, `scripts/taddy_throttled.py` |
| Starter code, plain | `scripts/taddy_client.js`, `scripts/taddy_client.py`, `scripts/taddy_throttled.js`, `scripts/taddy_throttled.py`, `scripts/webhook-express.js` |
| Starter code, typed (TypeScript) | `scripts/taddy_client_typed.ts`, `scripts/codegen.ts`, `scripts/graphql/` (fragments and queries, including `scripts/graphql/queries/GetEpisodeTranscript.graphql`) |
| Report a skill/API mismatch or a blocked use case to Taddy | `references/skill-feedback.md`, `scripts/taddy_feedback.js` |

## Escape hatch

If the API rejects a field or argument as unknown, or accepts one the bundled schema lacks, the bundle is behind the API. Introspect `https://api.taddy.org` (works without credentials) or fetch `https://ax0.taddy.org/docs/taddy-podcast-api-schema.graphql` and re-check; in a typed project rerun the codegen. Podcast docs in one file: `https://ax0.taddy.org/docs/taddy-podcast-api-docs.md`. Then tell the user the skill needs an update.
