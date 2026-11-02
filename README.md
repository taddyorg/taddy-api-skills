# Taddy API skills

Agent skills for building on [Taddy API](https://taddy.org/developers/podcast-api).

| Skill | What it covers |
| --- | --- |
| [`taddy-podcast-api`](skills/taddy-podcast-api/SKILL.md) | Podcast and episode lookup, full-text search, latest-episode feeds, top charts, episode transcripts, webhooks. Bundles the GraphQL schema and the podcast docs. |

## Install

### Claude Code

```
/plugin marketplace add taddyorg/taddy-api-skills
/plugin install taddy-podcast-api@taddy-api
```

For updates, enable auto-update for the `taddy-api` marketplace in `/plugin`.

### Codex

```
codex plugin marketplace add taddyorg/taddy-api-skills
```

Then install `taddy-podcast-api` from the Plugins directory.

### Cursor

Add this repo as a team marketplace in **Dashboard → Plugins → Add Marketplace → Import from Repo**.

### Other agents

```
npx skills add taddyorg/taddy-api-skills
```

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
```

## Releasing a new version

Skill versions track the bundled schema. The schema changes rarely, and a skill release is the only time it is updated. Before tagging a release:

1. Copy the docs mirror into `references/` and refresh the schema:

   ```
   curl -sSfL https://ax0.taddy.org/docs/taddy-podcast-api-schema.graphql -o skills/taddy-podcast-api/references/schema.graphql
   ```

   Both files are podcast-only exports of the Taddy docs (the full docs and schema, covering every medium, are `taddy-api-docs.md` and `schema.graphql` under the same path).
2. Run `python3 scripts/sync-manifests.py --check`, plus `evals/check-refs.sh` if you have the local `evals/` folder (it is not in git).
3. If you have the local `evals/` folder, run the eval loop with the `skill-creator` skill in Claude Code, using `evals/evals.json`.
4. Bump `version` in `data.json` and in `SKILL.md`, run `python3 scripts/sync-manifests.py` to regenerate the manifests, and add a `CHANGELOG.md` entry. Never edit the generated `.json` manifests by hand.

Distribution: installs via `npx skills add` are what list the skill on [skills.sh](https://skills.sh) (nothing to submit). Listing on the public Cursor Marketplace is a separate submission at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish).

Announce skill releases alongside the [API changelog](https://taddy.org/developers/podcast-api/changelog).

## License

MIT
