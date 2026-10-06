# Plain HTTP client or typed GraphQL client

Taddy is one GraphQL endpoint, `POST https://api.taddy.org`, so any HTTP client works. The endpoint is fixed: hardcode it, there is no base-URL setting to expose. The question is whether generating types from the schema is worth a build step. Decide by how central podcast data is to the app.

| Situation | Use | Starter |
| --- | --- | --- |
| Side feature: one or two queries, a script, a cron job, a search box on an app that is not about podcasts | The HTTP client the project already has (fetch, axios, requests, httpx). No GraphQL library, no new dependency. | `scripts/taddy_client.js`, `scripts/taddy_client.py` |
| Podcast data is the product: a player, a subscription feed, a discovery app, anything with several operations and UI components that share podcast and episode shapes | A typed client generated from the schema. Field names are checked by the compiler, results are typed, fragments declare each shape once. | `scripts/taddy_client_typed.ts`, `scripts/codegen.ts`, `scripts/graphql/` (fragments and queries) |

Either way the API key stays server-side. For a mobile or browser app the typed client lives in the backend-for-frontend; if that BFF exposes its own GraphQL schema, the mobile client (Apollo iOS, Apollo Kotlin) targets the BFF schema, not Taddy.

## Where the schema comes from

- **Introspection from `https://api.taddy.org`** (default): the endpoint answers introspection without credentials, so the generator reads the live schema directly (`schema: "https://api.taddy.org"`). Generated types always match the production API. It needs network when the codegen runs, in CI too; otherwise commit the generated file.
- **SDL file**: copy the skill's `references/schema.graphql` to `graphql/schema.graphql` in the project and commit it. For TypeScript this is the offline or reproducible-build option (`schema: "graphql/schema.graphql"`). For every tool that reads a schema file at compile time (Rust `graphql-client` and `cynic`, Ruby `graphql-client`, Apollo iOS and Kotlin, StrawberryShake, ferry) it is the normal path: there is no introspection step to replace, so vendoring the SDL is expected, not a workaround. The file is podcast-only and pinned to the skill release; the same file is published at `https://ax0.taddy.org/docs/taddy-podcast-api-schema.graphql`, so `curl -sSfL` that URL into the repo when the project needs a refresh. It is for types only; requests still go to `https://api.taddy.org`. It goes stale the same way the skill does: re-download it (or, in TypeScript, switch back to introspection) when the API rejects or accepts a field the file does not have.
- The SDL marks key fields nullable (`uuid`, `id`, `url`, `searchId`, `topChartsId`, `popularityRankId`), but the API requires them in every selection and fragment on their type (SKILL.md, Workflow B step 2). Offline validation against the SDL passes a query that the API will reject, so include them from the start.
- No custom scalars, so no scalar mapping. `itunesId` and `fileLength` are `Float` because they exceed 32 bits; generated `number` / `float64` / `Double` types are correct.
- The live schema also contains comic and creator types (Taddy serves more than podcasts). Operation-scoped generators (the TypeScript setup below, genqlient, Apollo) only emit what your documents use, so this costs nothing. Whole-schema generators emit those types too; ignore them.

## TypeScript (default typed setup)

Layout example:

```
graphql/
  codegen.ts                       # GraphQL Code Generator config (copy of scripts/codegen.ts)
  fragments/
    MiniPodcastSeriesDetails.graphql   # list-row shape
    PodcastSeriesDetails.graphql       # detail-page shape, #imports the mini one
    PodcastEpisodeDetails.graphql      # player / episode-list shape
  queries/
    GetPodcastSeries.graphql
    SearchPodcasts.graphql
    GetLatestPodcastEpisodes.graphql
    GetEpisodeTranscript.graphql     # its own request, longer timeout, never inside a list
  operations.ts                    # generated: document constants + result and variable types
lib/taddy.ts                       # graphql-request transport (copy of scripts/taddy_client_typed.ts)
```

Install and generate:

```
npm i graphql graphql-request graphql-tag @graphql-typed-document-node/core
npm i -D @graphql-codegen/cli @graphql-codegen/typescript-operations @graphql-codegen/typescript-document-nodes
npx graphql-codegen --config graphql/codegen.ts      # add as the "graphql-codegen" script in package.json
```

Codegen 6.x / CLI 7.x is ESM-only and needs Node 22+ to run; the generated client itself runs on Node 20+.

`codegen.ts` (the full file with comments is `scripts/codegen.ts`):

```ts
const config: CodegenConfig = {
  overwrite: true,
  schema: "https://api.taddy.org",            // or "graphql/schema.graphql" for an offline build
  documents: ["graphql/fragments/**/*.graphql", "graphql/queries/**/*.graphql"],  // not graphql/**, which would parse a local schema file as a document
  generates: {
    "graphql/operations.ts": {
      plugins: ["typescript-operations", "typescript-document-nodes"],
      config: { gqlImport: "graphql-tag#gql" },   // named import; it types cleanly under "module": "nodenext"
    },
  },
};
```

With `@graphql-codegen/typescript-operations` 6.x the output is self-contained: it declares the helper types and every enum the documents use. Do not add the `typescript` plugin to the same file; with 6.x it declares the same enums a second time and the file fails to compile. With plugins 5.x and earlier (older projects) the `typescript` plugin is needed and the three-plugin list is correct.

Fragments are pulled in with `#import "./MiniPodcastSeriesDetails.graphql"` at the top of a document. Every operation gets a document constant (`GetPodcastSeries`), a result type (`GetPodcastSeriesQuery`) and a variables type (`GetPodcastSeriesQueryVariables`). Calling it:

```ts
import { query } from "./lib/taddy";
import { GetPodcastSeries, type GetPodcastSeriesQuery, type GetPodcastSeriesQueryVariables } from "./graphql/operations";

const data = await query<GetPodcastSeriesQuery, GetPodcastSeriesQueryVariables>(GetPodcastSeries, { name: "The Daily", limitPerPage: 10 });
data.getPodcastSeries?.episodes?.[0]?.audioUrl; // typed
```

Swap `typescript-document-nodes` for `typed-document-node` and the generics can be dropped: `query(GetPodcastSeriesDocument, { name })` infers both types.

Transport is `graphql-request` 7.x (`GraphQLClient` with the `X-USER-ID` and `X-API-KEY` headers), the library the Taddy docs and `github.com/taddyorg/example-project` use. Upstream has renamed it to Graffle, whose new line is still prerelease; 7.x lives on the [`graphql-request` branch](https://github.com/graffle-js/graffle/tree/graphql-request) and is the version to install. It throws `ClientError` for non-2xx and for a non-empty `errors[]`; the starter unwraps it into a `TaddyError` whose `code` comes from `errors[0].code` (Taddy puts the code at the top level of each error, with `extensions.code` as fallback) so `QUERY_TOO_COMPLEX`, `API_RATE_LIMIT_EXCEEDED` and the rest are matchable.

Alternatives, if the project already uses one: **client-preset** (same generator, `graphql()` calls inside `.ts` files instead of `.graphql` documents); **gql.tada** (types inferred at edit time from the schema, no codegen step); **Apollo Client** or **urql** (`@urql/core`; the `urql` package is the React bindings) on the server or in a BFF when a normalized cache is wanted. Native `fetch` stays the side-feature path.

## Other languages

| Language | Types from the schema | Transport | Notes |
| --- | --- | --- | --- |
| Python | [gql](https://github.com/graphql-python/gql) validates documents against the schema; [ariadne-codegen](https://github.com/mirumee/ariadne-codegen) generates Pydantic models and a client from `.graphql` files | `httpx` / `aiohttp` via gql transports | `scripts/taddy_client.py` is the plain path |
| Ruby | [graphql-client](https://github.com/github-community-projects/graphql-client): `GraphQL::Client.load_schema("graphql/schema.graphql")` (the vendored SDL above, no introspection dump needed), then parse each operation against it into a constant | Its HTTP adapter with the two headers | Sorbet-typed codegen exists ([graph_weaver](https://github.com/dpep/graph_weaver), very new); graphql-client remains the standard |
| Go | [genqlient](https://github.com/Khan/genqlient): one typed function per operation; [gqlgenc](https://github.com/gqlgo/gqlgenc) if the project already uses gqlgen | `net/http` with a header round-tripper | [hasura/go-graphql-client](https://github.com/hasura/go-graphql-client) for struct tags without codegen |
| Swift | [Apollo iOS](https://github.com/apollographql/apollo-ios) codegen | Apollo | BFF only: the key cannot ship in the app |
| Kotlin / Java | [Apollo Kotlin](https://github.com/apollographql/apollo-kotlin) codegen (Java users add [apollo-kotlin-java-support](https://github.com/apollographql/apollo-kotlin-java-support)) | Apollo | BFF only for Android; fine on a JVM server |
| Rust | [graphql-client](https://github.com/graphql-rust/graphql-client) or [cynic](https://codeberg.org/obmarg/cynic) derive macros. Both read an SDL file at compile time: vendor `graphql/schema.graphql` as above. graphql-client: `#[derive(GraphQLQuery)] #[graphql(schema_path = "graphql/schema.graphql", query_path = "graphql/queries/GetPodcastSeries.graphql", response_derives = "Debug")] struct GetPodcastSeries;`, one `.graphql` document per operation (graphql-client has no `#import`, so paste the fragments from `scripts/graphql/fragments/` into the same document). cynic: `cynic_codegen::register_schema("taddy").from_sdl_file("graphql/schema.graphql").as_default().unwrap()` in `build.rs`, then `#[derive(cynic::QueryFragment)]` structs | `reqwest` with the `X-USER-ID` and `X-API-KEY` headers; graphql-client's `reqwest` feature or cynic's `reqwest` integration | Thin proxy with a few fixed operations (an axum or actix backend-for-frontend): `reqwest` + `serde_json` with hand-written query strings is fine; validate them against the same SDL in a test if wanted |
| C# / .NET | [StrawberryShake](https://github.com/ChilliCream/graphql-platform) codegen (`StrawberryShake.Server` package) | HttpClient | Untyped path: plain `HttpClient` + `System.Text.Json`. GraphQL.Client has had no release since 2024 |
| Dart / Flutter | [ferry](https://github.com/gql-dart/ferry) codegen; [graphql_flutter](https://github.com/zino-hofmann/graphql-flutter) untyped (typed with `graphql_codegen`) | `gql_http_link` (ferry) / `HttpLink` (package:graphql) | BFF only for Flutter apps; fine in a Dart server |
| Anything else | [graphql.org/code](https://graphql.org/code/) | | |

## What a typed client does not change

- `QUERY_TOO_COMPLEX`, nested-list limits, pagination bounds and transcript credits are enforced server-side and apply identically. A small fragment set keeps field lists minimal; do not add `transcript` or nested `episodes` to a shared fragment.
- The error contract from SKILL.md still holds: non-2xx and a non-empty `errors[]` both surface with the Taddy `code`. Libraries that wrap errors (graphql-request, Apollo) need the small mapping shown above so `code` survives.
- A client-side normalized cache does not reduce Taddy request counts unless it sits in front of the call that reaches `api.taddy.org`. Taddy's own cache hits are free regardless.
- In a typed project, never hand-write result interfaces. Add a `.graphql` document next to the existing ones, regenerate, import the types.
- Key fields are still required: every fragment on `PodcastSeries` or `PodcastEpisode` includes `uuid`, on `TranscriptItem` or `Chapter` includes `id`, on `TranscriptLink` or `ChapterLink` includes `url`. The generator does not enforce this; the API does.
- Genre filters stay exact matches (no parent-to-sub-genre expansion), and `getEpisodeTranscript` still needs its own request with a longer timeout (SKILL.md, Workflow B step 5).
