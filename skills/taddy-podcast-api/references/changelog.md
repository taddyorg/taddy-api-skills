# Changelog

Recent updates to Taddy API. 

## New `useOnlyPodcastProvidedTranscript` argument for transcripts

October 2, 2026

- `getEpisodeTranscript`, `transcript` and `transcriptWithSpeakersAndTimecodes` accept a new optional argument `useOnlyPodcastProvidedTranscript` (default: false). When true, only a transcript published by the podcast itself is returned, and null is returned if the podcast does not provide one. It never uses Taddy’s on-demand transcription feature, and never uses a transcription credit. It takes precedence over `useOnDemandCreditsIfNeeded`. This is useful for Free users requesting transcripts, and for Paid users who want to guarantee a request uses no transcript credits.
- When a transcript requires a Pro or Business plan, Free users now receive the error code `ACCESS_NOT_ALLOWED` instead of `TADDY_SERVER_ERROR`. The error message is unchanged: i.e.) “You need to be a Pro or Business Taddy API user to access the transcript for this episode.”

## Auto-scaling Episode Transcripts.

August 27, 2026

- Business plans include 2,000 episode transcripts per month. If you believe you may need more than that, you can turn on auto-scaling for episode transcript on your dashboard. when you hit 95% of your current limit we'll automatically add a new transcript pack: 3,000 transcripts for $75 (2.5¢ each transcript). You can also set a max number of transcript packs your account can buy in a month.
- When your billing resets each month, your transcript limit resets back to the Business Plan default (2,000 episode transcripts/month) and you lose any unused transcripts credits from the previous month.

## BREAKING UPDATE - iTunes ID now returns Float instead of Int

August 5, 2026

- New podcasts on Apple Podcasts can now have iTunes IDs larger than the 32-bit integer limit. Our GraphQL schema previously returned these as type `Int` (which is limited to 32-bit values), causing some queries to error with "Int cannot represent non 32-bit signed integer value." We've updated the schema to return type `Float`, which can safely represent integer values well beyond the 32-bit limit.
- A podcast episode's `fileLength` had the same issue. Updating it to `Float` allows it to return much larger file sizes.

In total, these 4 properties were updated:

```graphql
PodcastSeries.itunesId: Int -> Float
iTunesInfo.publisherId: Int -> Float
PodcastEpisode.fileLength: Int -> Float
AlternateEnclosureLink.length: Int -> Float
```

And these 2 queries were updated:

```graphql
getPodcastSeries(itunesId: Int) -> getPodcastSeries(itunesId: Float)
getItunesInfo(itunesId: Int) -> getItunesInfo(itunesId: Float)
```

This is a breaking change that might affect you in 3 ways:

- **Typed GraphQL variables:** If you pass typed variables to these queries, e.g. `query($id: Int!) { getPodcastSeries(itunesId: $id) }`, update the type to `Float`: `query($id: Float!) { getPodcastSeries(itunesId: $id) }`
- **Codegen clients:** Strongly-typed codegen clients (Swift / Kotlin / Java / C# / Go) will see the generated model fields change from `Int` to `Double` on their next code generation.
- **Database storage:** If you save any of these 4 properties in your database as a 32-bit `int` column, migrate it to `bigint`to avoid overflow errors.

We try very hard not to introduce breaking changes to the Taddy API, but we believe this was the best solution for this bug. Over the next few days, we'll reach out via email to any user we see with failing queries related to this issue.

## Taddy API Status Page and Usage Alerts

June 17, 2026

- We launched a [status page](https://status.taddy.org/) for Taddy API.
- You can now [subscribe to get an email or webhook alert](https://taddy.org/dashboard/my-apps/notifications) when your API usage or transcribe credits cross certain thresholds.
- We have scheduled maintenance for Saturday June 27th from 5AM to 8AM PDT. During this time we expect a small amount of downtime (under 2 minutes) and a couple hours where background services like crawling RSS feeds and indexing new episodes are going to be delayed.

## HLS Video and other alternate enclosures

March 17, 2026

- You now access a list of all the [AlternateEnclosureLinks](./episode-alternate-enclosure-link.md) available for an episode. This means if a podcast creator wants to provide a video along with audio or different quality audio or video files, you now have access to all these alternate enclosure links.
- This also means an episode can now have a `audioUrl` and `videoUrl` available. We default to using the highest quality file to fill in the missing audioUrl or videoUrl if one is available.
- This tag is still not widely supported yet, but check out the latest episodes from the Podnews Daily podcast (uuid: “027bc08a-e1b5-471a-b9eb-175dab5aba63”) to see an example.

## Webhook Filters & Replaying failed webhook events!

January 16, 2026

- Add a [regex expression](./webhook-filters.md) so that you only get webhook events for podcast data you care about. You can use it for:
    - **Brand monitoring** - Get notified when your company or product is mentioned on a new episode. Set up a filter with regex like `\byour-brand\b`.
    - **Sales intelligence** - Track when prospects or competitors appear on podcasts. Combine this with our transcript API to extract context that can be used in lead scoring.
    - **Industry research** — Monitor keywords or key executives in your industry. For example, a filter with regex like `\b(FDA approval|clinical trial|drug recall|Phase [1-3]|NDA filing)\b` keeps you on top of latest pharma trends.
- Use [`replayFailedWebhookEvents`](./replay-webhook-events.md) to replay all webhook events that did not successfully get sent to your webhook endpoint over the last 14 days.

## Fix to Transcripts count

January 14, 2026

Pro users’ transcription count was not being reset to 0 on their billing cycle! Thanks for reporting the error. All transcripts counts were reset to 0 for Pro users and the error has been fixed. Sorry about the inconvenience!

## Fix to TopChartsQuery

November 20, 2025

The getTopChartsByCountry and getTopChartsByGenre queries (which returned the daily top charts from Apple) were not being updated for the past 7 days. We have fixed the issue and the charts are back in sync. Sorry about the inconvenience!

## Improvements to Transcripts!

September 12, 2025

- Episode transcripts are available to all paid users (Pro and Business)
- 100 Episode Transcripts/month are included on the Pro Plan
- 2000 Episode Transcripts/month are included on the Business Plan
- We've simplified our credit system for transcripts. Previously, we had 2 types of credits for transcripts (one for transcripts that Taddy API had already generated and one for transcripts we hadn't). Now, we combined both into one.

## Marketing Updates

August 20, 2025

Check out our new Taddy API [home page](https://taddy.org/developers), [pricing](https://taddy.org/developers/pricing) page, and [Why we Built Taddy](https://taddy.org/developers/why-we-built-taddy) page. 

## Improvement to getEpisode

May 21, 2025

We added `seriesUuidForLookup` to the [getEpisode](./get-podcast-episode.md) query. 

This is useful because an episode’s guid is not guaranteed to be unique (two different podcasts can use the same guid for episodes in their podcast). With`seriesUuidForLookup`, if you know the podcast’s uuid and an episode’s guid, you can get exactly the episode you want.

## Monthly Snapshots Added

May 1, 2025

If you pay for the one-time data export and have a Taddy Business Plan, you get access to a snapshot of all podcast data from our database on the 1st of every month. See [here](./bulk-download-podcastseries.md) for doc on how to access these monthly snapshots.

## 2 New Queries Added

April 22, 2025

- Added [getPopularContent](./most-popular-podcasts.md). It lists the most popular podcasts and allows you to filter by language and genres.
- Added [getLatestPodcastEpisodes](./latest-episodes-from-multiple-podcasts.md). It allows you to get the most recent episodes for multiple podcasts (ie: Makes it easy for you to build a Podcast Feed)
- Added the property `popularityRank` on PodcastSeries. ex) if a podcast is in the TOP_200, TOP_1000 podcast etc.

## New Search API

March 4, 2025

We’ve made search faster & improved the quality of search results returned. See [search](./search.md) for documentation. 

**Note:** The old search query (`searchForTerm`) now uses the new search engine behind the scenes, so you don't have to update your queries to see improved results. However, the new search query (`search`) does have some new features and improved syntax. So, try it out!

## Links from description

January 8, 2025

Added the GraphQL property `descriptionLinks` to [PodcastSeries](./podcastseries.md) and [PodcastEpisode](./podcastepisode.md). This gives you an easy way to get all the URLs inside a podcast’s or episode’s description.

## Even more transcripts

December 7, 2024

We made some updates to our transcription feature:

- We’ve updated the transcription model to use the latest Open AI Whisper model `large-v3-turbo`
- We stopped using pyannote-audio for speaker diarization and speaker identification. We found it hard to offer high-quality speaker diarization and identification for cheap. It resulted in users not using this feature. We try very hard not to deprecate any feature we build but we decided to stop using pyannote-audio and double-down on what people are currently using: high-quality transcripts.
- We’ve increased the number of transcripts on Taddy going from all episodes of the top 650 podcasts to all episodes from the top 2,000 podcasts in our directory. We plan to increase this even more in the next couple of months after we finish transcribing the back catalogue of these episodes.

## Updates to Queues

October 22, 2024

To ensure we are checking RSS feeds as efficiently as possible, we did an audit of feeds in our directory. 

This is the breakdown of how many podcasts are in each queue as of today:

`WEBSUB`  - 115,459

`HIGH` - 6,638

`MEDIUM` - 61,852

`REGULAR` - 2,783,065

`INACTIVE` - 1,175,194 (Podcast feed still works, but no new episodes within the last year)

`LOW` - 657,736 (Podcast feed no longer works)

## Episode Transcripts launched!

September 20, 2024

We launched episode transcripts, our most requested feature.

- [Episode transcripts](./episode-transcripts.md) for the most popular podcasts
- On-demand transcripts for any episode in our directory

Email `danny@taddy.org` if you have a feature request.