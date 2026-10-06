# Reporting a skill/API mismatch or a blocked use case

Read this at the end of a task when the skill and the live API disagreed, or when the user did not get what they asked for. It is self-contained. The report goes to Taddy through `scripts/taddy_feedback.js`; the script scrubs it, you show the scrubbed text to the user, and nothing is sent until they say yes in this conversation.

## When to offer a report

Offer once, at the end of the task, not mid-task. Two kinds:

| Kind | Offer it when | Not when |
| --- | --- | --- |
| `INCONSISTENCY` | The escape hatch fired: the API rejected a field or argument the bundled schema has, or accepted one it lacks. A limit, default, status or behaviour on a reference page did not match what the API did. A starter script needed a fix before it worked. | The user's own query had a typo, or the error was quota, auth or plan gating that the skill already documents. |
| `USE_CASE` | The user asked for something the API cannot do. The feature shipped only with a workaround. A reference page was unclear enough that the query took several attempts. | Everything worked first time. Only report a success when there was notable friction. |

Routing rule: "the skill said X and the API did Y" is `INCONSISTENCY`. "The skill did not say enough" is `USE_CASE` with the outcome `docs unclear`.

## The draft

Write three fields. The script fills `source` and `sourceVersion` from `SKILL.md` and drops anything else.

| Field | Required | Limit | What goes in |
| --- | --- | --- | --- |
| `kind` | yes | `INCONSISTENCY` or `USE_CASE` | See the table above |
| `summary` | yes | 140 chars | One line a reader can triage from |
| `details` | yes | 3000 chars | One of the two templates below, in plain text. A GraphQL operation is welcome, application code is not |
| `operations` | no | 10 names | Query, mutation or field names involved, e.g. `getPodcastSeries` |

`details` templates:

- `INCONSISTENCY`: `Skill said: <quote> (<references/page.md>). API did: <error code and message, or the behaviour seen>.`
- `USE_CASE`: `Wanted: <generic description>. Outcome: implemented with friction | workaround | not possible | docs unclear. Blocker: <what was missing>. Workaround: <what was done instead, or none>.`

Examples:

```json
{
  "kind": "INCONSISTENCY",
  "summary": "pagination.md says search allows page 20, API caps it at 10",
  "details": "Skill said: search page max 20 (references/pagination.md). API did: BAD_USER_INPUT \"page must be between 1 and 10\" for query ($term: String) { search(term: $term, page: 11) { ... } }.",
  "operations": ["search"]
}
```

```json
{
  "kind": "USE_CASE",
  "summary": "No way to get listener or download counts per episode",
  "details": "Wanted: a dashboard showing listener counts per episode for ~50 podcasts. Outcome: not possible. Blocker: the schema has no play or download statistics on PodcastEpisode. Workaround: showed popularityRank on the series instead and said so to the user."
}
```

## What never goes in

The script redacts header values, env assignments, bearer tokens, home-directory paths, emails, IPs, long hex or base64 tokens and every URL outside taddy.org. It cannot recognise the rest, so you must leave these out:

- App, company, product, project and repository names. Describe the app by category.
- Customer, user or team member names. The person you are helping is "the user".
- The user's own podcast by name or RSS url. Use its uuid; uuids are public data.
- Application code, database rows, `.env` contents, the conversation transcript. Quote only the GraphQL operation, with variable names and values generalised.

Before: "Acme Daily Digest, a newsletter for our 200 clients' shows, calls getLatestPodcastEpisodes from /Users/sam/acme/cron.ts". After: "a newsletter app listing new episodes across ~200 subscribed podcasts, calling getLatestPodcastEpisodes from a cron job".

## How to file

1. Write the draft JSON outside the project, in `$TMPDIR`, or pipe it on stdin. A stray `draft.json` in the repo is one `git add -A` away from being committed.
2. Preview: `node <skill>/scripts/taddy_feedback.js $TMPDIR/draft.json` (or `- < draft.json`). The script prints `redacted:` counts, `ignored:` for any dropped keys, the exact payload that would be sent, and a closing line. Exit 1 names the field and limit that failed; shorten and rerun.
3. Show the printed payload and the closing line to the user verbatim and ask whether to send it.
4. Only after an explicit yes: `node <skill>/scripts/taddy_feedback.js $TMPDIR/draft.json --send`. If the key lives in the project's `.env`, prefix with `node --env-file=.env`. The script re-validates, re-scrubs, prints the payload again and posts it with the `X-USER-ID` and `X-API-KEY` headers, so Taddy can follow up through the account. The body carries nothing else that identifies anyone.
5. Delete the draft. On success the script prints an id; keep it as the reference and do not resend.
