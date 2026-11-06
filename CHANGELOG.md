# Changelog

Skill versions track the bundled `references/schema.graphql`, downloaded from `https://ax0.taddy.org/docs/taddy-podcast-api-schema.graphql` at each release. Re-copy the docs mirror and bump the version whenever the API changes.

## 1.0.3 (2026-11-06)

- README: install is now one prompt that asks the agent to download the skill. The per-agent Claude Code, Codex and Cursor marketplace steps are gone. "Layout" is renamed "Architecture".

## 1.0.2 (2026-11-06)

- Docs mirror and `schema.graphql` re-copied from taddy.org.
- Schema: the webhook mutations and the `WebhookFilterInput` / `WebhookFilter` fields now have descriptions, covering AllowList and BlockList, AND/OR filter matching, and the fact that `updateWebhookFilter` replaces the whole filter.
- `getPopularContent`, `getTopChartsByCountry` and `getTopChartsByGenres` now allow page 8 at most (was 20).
- Search: the `matchBy` options are now `MOST_TERMS`, `ALL_TERMS` and `EXACT_PHRASE` (`FREQUENCY` is gone). `search.md` adds a section saying that transcript text is not searched.
- Transcripts: the wording says Paid, or Pro or Business, where it used to say Business. `taddyTranscribeStatus` explains that a transcript can be generated on demand whatever the status.
- `ai-tools-mcp-server.md`, the intro page and the "Get Started" banners now point to the skill and the MCP server.

## 1.0.1 (2026-11-05)

- README: rewrote the install instructions. Notes that Claude Code and Codex plugins can auto-update, adds the Codex `/plugin` step, and replaces `npx skills add` with a prompt that asks the agent to download the skill.

## 1.0.0 (2026-11-02)

- Typed client option: SKILL.md now keeps the plain HTTP client for side features and sets up a typed client (GraphQL Code Generator + graphql-request, Node 22+) when podcast data is the product. New `references/graphql-client-libraries.md` with per-language options, plus `scripts/taddy_client_typed.ts`, `scripts/codegen.ts`, and starter `scripts/graphql/` fragments and queries. Codegen introspects `https://api.taddy.org` at build time so generated types always match production.
- Error handling: `errors-and-quota.md` and SKILL.md now document the HTTP status behind each Taddy error code, the 4xx-vs-200-with-`errors[]` distinction, the per-minute rate limit, and the `QUERY_TOO_COMPLEX` cost model. The JS and Python clients surface the Taddy error code on non-2xx responses.
- Clients: endpoint fixed at `https://api.taddy.org` (no more `TADDY_API_URL`); all three clients default to a 30-second timeout and throw `TaddyError` with `code: "TIMEOUT"`.
- Throttling: new `scripts/taddy_throttled.js` and `scripts/taddy_throttled.py` wrap `query()` with a 250 ms pause after each request, so loops, cron jobs and polling stay under the per-minute rate limit. SKILL.md routes that work to them before the first `API_RATE_LIMIT_EXCEEDED`; `errors-and-quota.md` points at them from the 429 row.
- Podcast-only sources: the escape hatch and client-libraries page link the podcast-only schema and docs (`taddy-podcast-api-schema.graphql`, `taddy-podcast-api-docs.md`) instead of the all-media files.
- Feedback: new `references/skill-feedback.md` and `scripts/taddy_feedback.js`. The agent drafts a six-field report (kind, summary, details, operations; skill name and version filled in), the script validates and scrubs it, and only `--send` after the user's approval posts it with the account headers. Needs the feedback endpoint on taddy.org (spec in `proposals/skill-feedback-endpoint.md`); until it ships the script says so and nothing is sent. `evals/check-refs.sh` now syntax-checks every script and runs the redaction fixture.
- SKILL.md: triage by project state (setup / add a query / debug), query decision table, gotchas, reference routing, escape hatch.
- References: full podcast docs mirror (49 pages) plus `schema.graphql`, and two curated pages, `pagination.md` and `errors-and-quota.md`.
- Scripts: `taddy_client.js`, `taddy_client.py`, `webhook-express.js`.
- Manifests: the Claude Code `plugin.json` now sets `privacyPolicyUrl` and `supportUrl`, and the Codex support link points at `https://taddy.org/developers/support` instead of the terms of service. Both URLs live at the top level of `data.json`.
- Plugin manifests for Claude Code (`.claude-plugin/`), Cursor (`.cursor-plugin/`), Codex (`.agents/plugins/`), and the Agent Plugins standard (root `plugin.json`), all generated from `data.json` by `scripts/sync-manifests.py`.
