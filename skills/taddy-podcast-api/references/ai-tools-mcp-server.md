# The Taddy MCP server and this skill

Taddy offers three ways to use the Podcast API with AI tools. They serve different consumers, and a coding session can use two of them at once.

| | Who it is for | What it gives | Where the API key lives |
| --- | --- | --- | --- |
| **This skill** | A coding agent writing an integration | Docs, the schema, the workflows and gotchas in `SKILL.md` | The app's server-side env (`TADDY_USER_ID`, `TADDY_API_KEY`) |
| **MCP server** (`https://taddy.org/mcp/podcast-api`) | Any MCP client that needs podcast data now: Claude, ChatGPT, Claude Code, Cursor | Typed tools over the same API, with the gotchas in the tool descriptions, and prompts for common asks | The MCP client config, sent as HTTP headers |
| **Raw docs** | Anyone pasting context into a tool by hand | [Schema](https://ax0.taddy.org/docs/taddy-podcast-api-schema.graphql) and [docs in one Markdown file](https://ax0.taddy.org/docs/taddy-podcast-api-docs.md); the inputs this skill was built from | n/a |

## The MCP server

A thin client of the public GraphQL API: every tool call is forwarded to `api.taddy.org` with the caller's own key, so quota, rate limits and plan gating apply exactly as for direct API use, and each call counts as one API request (except `get_api_usage_remaining`).

Install, with the credentials from https://taddy.org/dashboard:

```bash
# Claude Code
claude mcp add --transport http taddy https://taddy.org/mcp/podcast-api \
  --header "X-USER-ID: <user id>" --header "X-API-KEY: <api key>"
```

Claude.ai and ChatGPT: add a custom connector / MCP server with the URL above and the two headers. `initialize` and `tools/list` work without credentials; a tool call without them returns an error naming the headers to set.

### Tools and the queries behind them

Useful when a user tried something through the MCP server and now wants it in code: the tool maps to the query page in this skill.

| MCP tool | Podcast API field | Reference page |
| --- | --- | --- |
| `search_podcasts` | `search` | `search.md` |
| `get_podcast_series`, `get_podcast_series_episodes` | `getPodcastSeries` (+ `episodes`) | `get-podcast-series.md` |
| `get_podcast_episode` | `getPodcastEpisode` | `get-podcast-episode.md` |
| `get_multiple_podcast_series`, `get_multiple_podcast_episodes` | `getMultiplePodcastSeries`, `getMultiplePodcastEpisodes` | `get-multiple-podcast-series.md`, `get-multiple-podcast-episodes.md` |
| `get_latest_podcast_episodes` | `getLatestPodcastEpisodes` | `latest-episodes-from-multiple-podcasts.md` |
| `get_popular_podcasts` | `getPopularContent` | `most-popular-podcasts.md` |
| `get_top_charts_by_country`, `get_top_charts_by_genres` | `getTopChartsByCountry`, `getTopChartsByGenres` | `get-top-charts.md` |
| `get_episode_transcript`, `get_episode_chapters` | `getEpisodeTranscript`, `getEpisodeChapters` | `episode-transcripts.md`, `get-podcast-episode.md` |
| `get_itunes_info` | `getItunesInfo` | `itunesinfo.md` |
| `get_api_usage_remaining` | `getApiRequestsRemaining`, `getTranscriptCreditsRemaining` | `errors-and-quota.md` |
| `list_webhooks`, `add_webhook`, `update_webhook`, `delete_webhook` | `getMyDeveloperWebhooks`, `addWebhookUrlForUser`, `updateWebhookForUser`, `deleteWebhookForUser` | `webhooks.md` |
| `get_webhook_filter`, `add_webhook_filter`, `update_webhook_filter`, `delete_webhook_filter` | `getWebhookFilterByUuid`, `addWebhookFilter`, `updateWebhookFilter`, `deleteWebhookFilter` | `webhook-filters.md`, `webhook-filter-type.md` |
| `add_uuid_to_webhook_filter_allowlist`, `delete_uuid_from_webhook_filter_allowlist`, `add_uuid_to_webhook_filter_blocklist`, `delete_uuid_from_webhook_filter_blocklist` | `addUuidToWebhookFilterAllowlist`, `deleteUuidFromWebhookFilterAllowlist`, `addUuidToWebhookFilterBlocklist`, `deleteUuidFromWebhookFilterBlocklist` | `webhook-filters.md` |
| `mock_webhook_event` | `mockWebhookEvent` | `webhook-filters.md` |
| `replay_failed_webhook_events` | `replayFailedWebhookEvents` | `replay-webhook-events.md` |
| `run_graphql_query`, `get_graphql_schema_for`, `get_full_graphql_schema` | any operation; the published schema | `schema.graphql` |

Every tool returns a default field set (the same fields the matching webhook payload carries) and takes a `fields` argument: a GraphQL selection in the same syntax as a query, so a selection that works as `fields` in the MCP tool is the selection to put in the code.

## Using both in one coding session

When a `taddy` MCP server is connected to the coding agent alongside this skill:

- **Explore with the tools, build with the skill.** Resolve a show to its uuid, look at what fields a real episode carries, check `get_api_usage_remaining`, or try a `fields` selection through the tool before writing the query. It is faster than a hand-written curl and the errors come back with hints.
- **Do not route the app through the MCP server.** The app calls `https://api.taddy.org` directly with its own server-side key, as in Workflow A. The MCP server is a developer and end-user tool, not an application backend.
- **Same rules apply.** A tool call is an API request against the same monthly quota as the app, and `get_episode_transcript` can spend a transcript credit; prefer `useOnlyPodcastProvidedTranscript: true` while exploring.
- **Anything you learned from a tool error** (a plan limit, a page cap, a rejected regex) holds for the code too; the tool descriptions and this skill come from the same source.

More links: [Sign up](https://taddy.org/signup/developers), [Dashboard](https://taddy.org/dashboard), [Pricing](./pricing.md), [Terms of Service](https://taddy.org/terms-of-service), [Developer Policy](https://taddy.org/terms-of-service/developer-policy).
