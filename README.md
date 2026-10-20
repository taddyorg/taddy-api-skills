# Taddy API skills

Agent skills for building on [Taddy API](https://taddy.org/developers/podcast-api), the GraphQL podcast API. Skills follow the [Agent Skills](https://agentskills.io) specification, so one folder installs into Claude Code, Codex, Cursor, and any other agent that reads `SKILL.md`.

| Skill | What it covers |
| --- | --- |
| [`taddy-podcast-api`](skills/taddy-podcast-api/SKILL.md) | Podcast and episode lookup, full-text search, latest-episode feeds, top charts, episode transcripts, webhooks. Bundles the GraphQL schema and the podcast docs. |

The skill is a judgment layer: which query fits, what burns quota and how to handle errors and quota limits. The docs and the podcast-only GraphQL schema are bundled under `references/` for the agent to read; typed clients it sets up introspect `api.taddy.org` directly, and every request goes to that one endpoint.

## Install

### Skills CLI (any agent)

```
npx skills add taddyorg/taddy-api-skills
```

Add `--agent codex`, `--agent cursor`, etc. to target one agent. Installs through this command are what list the skill on [skills.sh](https://skills.sh); there is nothing to submit.

### Claude Code

```
/plugin marketplace add taddyorg/taddy-api-skills
/plugin install taddy-podcast-api@taddy-api
```

Third-party marketplaces do not auto-update by default. Enable auto-update for the `taddy-api` marketplace in `/plugin`, or run `claude plugin update taddy-podcast-api` after a release.

### OpenAI Codex

As a skill, either of:

```
npx skills add taddyorg/taddy-api-skills --agent codex
```

or inside Codex, `$skill-installer` with the skill folder URL (the repo URL alone is not enough, the installer needs the path):

```
https://github.com/taddyorg/taddy-api-skills/tree/main/skills/taddy-podcast-api
```

As a plugin, the repo is a Codex marketplace (`.agents/plugins/marketplace.json`, plugin manifest at the root `plugin.json`):

```
codex plugin marketplace add taddyorg/taddy-api-skills
```

then install `taddy-podcast-api` from the Plugins directory.

### Cursor

As a skill, `npx skills add taddyorg/taddy-api-skills --agent cursor`, or copy the folder as in the table below.

As a plugin, the repo carries `.cursor-plugin/plugin.json`, so a team marketplace can add it with **Dashboard, Plugins, Add Marketplace, Import from Repo**. Listing on the public Cursor Marketplace is a separate submission at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish).

### Manual install

Copy `skills/taddy-podcast-api/` into the agent's skills directory:

| Agent | Global | Per project |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Cursor | `~/.cursor/skills/` | `.cursor/skills/` |
| Codex and others | `$HOME/.agents/skills/` | `.agents/skills/` |

A per-project install (this table, or `npx skills add` without `-g`) puts the skill's `scripts/*.ts` inside the app. Templates whose `tsconfig.json` includes every `.ts` file (React Router, Vite) will type-check them against packages the app may not have; add the skill directory (`.claude`, `.cursor` or `.agents`) to `exclude`.

### Claude.ai

Zip `skills/taddy-podcast-api/` and upload it as a skill. There is no auto-update; re-upload after a release.

## Using it

The skill reads the codebase first. If it finds `TADDY_USER_ID` and `TADDY_API_KEY` or a call to `api.taddy.org`, it adds a query to the existing client. If not, it sets up a server-side client: a plain HTTP client when podcast data is a side feature, or a typed GraphQL client generated from the schema (GraphQL Code Generator plus graphql-request in TypeScript) when podcast data is the product, such as a player or a subscription feed. If you paste an error code or ask about quota, it goes to the debugging page. When the skill and the API disagree, or a use case did not work out, it offers to send Taddy a short report; the report is scrubbed of app names, paths, secrets and URLs, you see the exact text, and nothing is sent until you approve it.

Your API key comes from the [Taddy dashboard](https://taddy.org/dashboard). Keep it server-side; the skill will refuse to put it in a browser bundle.

## Layout

```
data.json                 name, version, description, author, logo, categories, marketplace: the source for every manifest below
plugin.json               Agent Plugins manifest (agent-plugins.org), read by Cursor and Codex
assets/taddy-logo.png     square 1024x1024 logo referenced by the Claude, Codex and Cursor manifests
.claude-plugin/           Claude Code plugin + marketplace manifests
.cursor-plugin/           Cursor plugin manifest
.agents/plugins/          Codex marketplace manifest
scripts/
└── sync-manifests.py     regenerates every manifest from data.json (--check to verify)
skills/taddy-podcast-api/
├── SKILL.md              triage, three workflows, decision table, gotchas, routing
├── references/
│   ├── pagination.md     limits and stop conditions for every list query
│   ├── errors-and-quota.md
│   ├── graphql-client-libraries.md   plain HTTP client vs typed GraphQL client, per language
│   ├── skill-feedback.md     when and how to report a skill/API mismatch or a blocked use case to Taddy
│   ├── schema.graphql    podcast-only SDL for the agent to read (codegen introspects api.taddy.org instead)
│   └── *.md              the podcast docs, one page per file
└── scripts/
    ├── taddy_client.js   minimal client, Node 20+
    ├── taddy_client.py   minimal client, Python 3.9+
    ├── taddy_throttled.js   one request then a 250 ms pause, for loops and polling, Node 20+
    ├── taddy_throttled.py   same, Python 3.9+
    ├── taddy_client_typed.ts   graphql-request transport for generated documents
    ├── codegen.ts        GraphQL Code Generator config (introspects api.taddy.org)
    ├── graphql/          starter fragments/ and queries/ for the typed setup, copied into the project
    ├── taddy_feedback.js   validates and scrubs a feedback report, posts it only with --send, Node 20.19+
    └── webhook-express.js
proposals/
└── skill-feedback-endpoint.md   spec for the taddy.org endpoint the feedback script posts to; not part of the skill
```

## Releasing

Skill versions track the bundled schema. The schema changes rarely, and a skill release is the only time it is updated. Before tagging a release:

1. Copy the docs mirror into `references/` and refresh the schema:

   ```
   curl -sSfL https://ax0.taddy.org/docs/taddy-podcast-api-schema.graphql -o skills/taddy-podcast-api/references/schema.graphql
   ```

   Both files are podcast-only exports of the Taddy docs (the full docs and schema, covering every medium, are `taddy-api-docs.md` and `schema.graphql` under the same path).
2. Run `python3 scripts/sync-manifests.py --check`, plus `evals/check-refs.sh` if you have the local `evals/` folder (it is not in git).
3. If you have the local `evals/` folder, run the eval loop with the `skill-creator` skill in Claude Code, using `evals/evals.json`.
4. Bump `version` in `data.json` and in `SKILL.md`, run `python3 scripts/sync-manifests.py` to regenerate the manifests, and add a `CHANGELOG.md` entry. Never edit the generated `.json` manifests by hand.

Announce skill releases alongside the [API changelog](https://taddy.org/developers/podcast-api/changelog).

## License

MIT
