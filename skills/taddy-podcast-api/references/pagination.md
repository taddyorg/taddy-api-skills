# Pagination and batch limits

Read this before writing any loop over a Taddy API list. Every list query has a maximum page size and a maximum page number; exceeding either is an error, and unbounded loops are the most common way to burn the monthly request quota. Numbers below come from the argument descriptions in `references/schema.graphql`; if the two disagree, the schema wins.

## Limits by query

| Query or field | Page argument (default / max) | Page size argument (default / max) | How to know you are done |
| --- | --- | --- | --- |
| `getPodcastSeries { episodes(...) }` | `page` (1 / 1000) | `limitPerPage` (10 / 25) | Fewer than `limitPerPage` items returned, or `page * limitPerPage >= totalEpisodesCount` (request `totalEpisodesCount` on the series once) |
| `getMultiplePodcastSeries { episodes(...) }` | `page` (1 / 1000) | `limitPerPage` (10 / 25) | same as above, per series |
| `getLatestPodcastEpisodes` | `page` (1 / 20) | `limitPerPage` (25 / 50) | Fewer than `limitPerPage` items returned. **Free tier: page 1 only, 25 items max.** Higher values error. |
| `search` | `page` (1 / 20) | `limitPerPage` (10 / 25) | `responseDetails { id type pagesCount totalCount }` returns the page count per content type. `pagesCount` can exceed the page limit (a broad term reports 1000 pages), so stop when `page >= min(pagesCount, 20)`; page 21 is `BAD_USER_INPUT` |
| `getTopChartsByCountry`, `getTopChartsByGenres` | `page` (1 / 20) | `limitPerPage` (10 / 25) | Empty list. Charts hold at most a few hundred entries |
| `getPopularContent` | `page` (1 / 20) | `limitPerPage` (10 / 25) | Empty list |
| `getMultiplePodcastSeries`, `getMultiplePodcastEpisodes` | none | `uuids` array, **max 25 per request** | Chunk the input into groups of 25 |
| `getLatestPodcastEpisodes` inputs | none | `uuids` or `rssUrls`, **max 1,000 per request** | Chunk the input into groups of 1,000 |
| `getEpisodeTranscript`, `getEpisodeChapters`, `getPodcastSeries`, `getPodcastEpisode` | not paginated | | One request per item |

`page` is 1-based. Pages are contiguous: page 2 with `limitPerPage: 25` is items 26 to 50.

Genre arguments (`filterForGenres` on `search`, up to 25 values; `genres` on `getTopChartsByGenres`; `filterByGenres` on `getPopularContent`) are exact matches with no parent-to-sub-genre expansion: pass the parent and all its sub-genres to cover a category.

## `episodes` options

- `sortOrder`: `LATEST` (default), `OLDEST`, or `SEARCH` with `searchTerm` to filter by title and description inside one podcast.
- `includeRemovedEpisodes: true` to include episodes that have been removed from the RSS feed (`isRemoved: true`). Default excludes them. `totalEpisodesCount(includeRemovedEpisodes: true)` includes the count of removed episodes.

## Rules for every loop

1. **Bound it.** Add a hard cap on pages (a constant, not the schema max) unless the user explicitly asked for exhaustive traversal. A podcast can have 1,000 pages of episodes; a subscription feed rarely needs more than 2.
2. **Stop on short pages.** A page shorter than `limitPerPage` is the last one. Do not request the next page to confirm.
3. **Guard against repeats.** Keep the first `uuid` of the previous page; if the new page starts with the same `uuid`, stop. This protects against a bug in your page arithmetic turning into a loop that spends quota.
4. **Never fetch pages to count.** For episode totals use `totalEpisodesCount`; for search use `responseDetails`.
5. **Chunk batch inputs before the request**, not after an error: 25 for `getMultiple*`, 1,000 for `getLatestPodcastEpisodes`.
6. **Prefer one wide request over many narrow ones.** A feed for 200 subscriptions is one `getLatestPodcastEpisodes` call, not 200 `getPodcastSeries` calls.
7. Free-tier callers hitting the `getLatestPodcastEpisodes` limits get an error, not an empty page. Catch it and show page 1 rather than retrying.

## Pattern

```js
// Bounded, short-page and repeat-guarded episode paging.
const LIMIT = 25;
const MAX_PAGES = 8; // cap chosen for the feature, not the schema max
let firstUuidOfPreviousPage = null;

for (let page = 1; page <= MAX_PAGES; page++) {
  const data = await query(
    `query ($uuid: ID, $page: Int, $limit: Int) {
       getPodcastSeries(uuid: $uuid) {
         episodes(page: $page, limitPerPage: $limit, sortOrder: LATEST) { uuid name datePublished audioUrl }
       }
     }`,
    { uuid, page, limit: LIMIT },
  );
  const episodes = data.getPodcastSeries?.episodes ?? [];
  if (episodes.length === 0 || episodes[0].uuid === firstUuidOfPreviousPage) break;
  firstUuidOfPreviousPage = episodes[0].uuid;
  handle(episodes);
  if (episodes.length < LIMIT) break;
}
```

```js
// Chunked batch lookup.
for (let i = 0; i < uuids.length; i += 25) {
  const data = await query(
    `query ($uuids: [ID]) { getMultiplePodcastSeries(uuids: $uuids) { uuid name imageUrl } }`,
    { uuids: uuids.slice(i, i + 25) },
  );
  handle(data.getMultiplePodcastSeries);
}
```
