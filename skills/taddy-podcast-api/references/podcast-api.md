# Podcast API

An API for developers to get details on over 4 million podcasts, 200 million episodes, episode transcripts, webhook notifications for new and updated podcasts and more.

## What can you do with the API?

- Get details on any [podcast](./get-podcast-series.md) or [episode](./get-podcast-episode.md).
- Blazing fast [full-text search](./search.md) to find podcasts and episodes.
- Get the [transcript](./episode-transcripts.md) for any episode.
- Get a [webhook event](./webhooks.md) for new or updated podcast data, or set up a [webhook filter](./webhook-filters.md) to get notified whenever your brand gets mentioned on an podcast.
- A list of the [most popular podcasts](./most-popular-podcasts.md) on Taddy Podcast API, plus the [daily top charts](./get-top-charts.md) for podcasts and episodes.
- Return the [latest episodes](./latest-episodes-from-multiple-podcasts.md) for a list of podcasts (helps you easily build a podcast feed).
- Get details on [multiple podcasts](./get-multiple-podcast-series.md) or [multiple episodes](./get-multiple-podcast-episodes.md) (returns an array instead of one item).
- [Add a podcast](./add-a-podcastseries-to-taddy.md) to our directory.
- **Use Taddy with your AI Tools:** A [Skill](./ai-tools-mcp-server.md) to give your AI coding tools useful context about our API and an [MCP Server](./ai-tools-mcp-server.md) to agentically use our API.
- **Enterprise features:** [Bulk download all 4+ million podcasts](./bulk-download-podcastseries.md) from our directory.

<aside>
👋 If you are new to using Taddy’s API, **Get Started** with our [**🤖 Intro to Taddy’s API](./intro-to-taddy-podcast-api.md).**

</aside>

### How to get the most out of Taddy API

[https://www.youtube.com/watch?v=kzjSjVjCMlk](https://www.youtube.com/watch?v=kzjSjVjCMlk)

### API Reference:

[PodcastSeries](./podcastseries.md) - Information on a podcast

[PodcastEpisode](./podcastepisode.md) - Information on an episode

[iTunesInfo](./itunesinfo.md) - Additional information from iTunes on a podcast

[Country](./country.md) - The country in which the podcast is made

[Language](./language.md) - The language spoken on the podcast

[Genre](./genre.md) - The genre of the podcast

[SortOrder](./sort-order.md) - The option to have returned items sorted by newest or oldest.

[PodcastContentType](./podcast-content-type.md) - Helps you distinguish between audio and video podcasts

[PodcastSeriesType](./podcast-series-type.md) - Helps you distinguish between episodic and serial podcasts

[PodcastEpisodeType](./podcast-episode-type.md) - Helps you distinguish between episodic and serial podcasts

[TaddyType](./taddytype.md) - The types of media available on Taddy

[TopChartsSource](./top-charts-source.md) - A list of platforms you can get Top Charts data from

[TopChartsType](./top-charts-type.md) - A list of possible categories for podcasts or episodes to be ranked in

[SearchContentType](./search-content-type.md) - The types of media available to search for on Taddy

[SearchMatchType](./search-match-by.md) - Choose between searching for all terms, some terms or frequency

[SearchSortOrder](./search-sort-by.md) - The option to have search results be prioritized by exact term matching or popularity

[SearchRankingDetails](./search-query-ranking-details.md) - Ranking details for each search result

[SearchResponseDetails](./search-query-response-details.md) - Additional details for search request

[FeedRefreshDetails](./feed-refresh-details.md) - Details on how often Taddy checks a podcast feed for updates

[WebhookFilter](./webhook-filter-type.md) - Programmatically add, update or remove webhook filters.

[Person](./person.md) - People listed on the podcast including their roles (Host, Guest, etc).

[PopularityRank](./popularity-rank.md) - Returns how popular the podcast is

[PodcastSeriesTranscriptionStatus](./podcastseries-transcription-status.md) - Check if Taddy is automatically generating transcripts and chapters for this podcast

[PodcastEpisodeTranscriptionStatus](./podcastepisode-transcription-status.md) - Check the status of automatically generated transcripts

[TranscriptItem](./episode-transcript-item.md) -  Transcript details including text, timecodes and speaker info.

[TranscriptLink](./episode-transcript-link.md) - Link details where you can download the transcript for an episode.

[Chapter](./episode-chapter-item.md) - Details on the chapters for an episode.

[ChapterLink](./episode-chapter-link.md) - Link details where you can download chapters for an episode.

[AlternateEnclosureLink](./episode-alternate-enclosure-link.md) - Link details to alternative content formats for an episode (video or higher quality audio files)

More Links:  

[Sign Up →](https://taddy.org/signup/developers)

[Webcomics API](https://taddy.org/developers/comics-api)

[Taddy Dashboard →](https://taddy.org/dashboard) 

[Changelog](./changelog.md)

[Pricing](./pricing.md)

[Terms of Service](https://taddy.org/terms-of-service)

[Developer Policy](https://taddy.org/terms-of-service/developer-policy)

[Intro To Taddy API](./intro-to-taddy-podcast-api.md)

Blog Posts:

[The 5 Top Podcast APIs](https://taddy.org/blog/best-podcast-api-tools)

[iTunes API vs Taddy API - Which is better?](https://taddy.org/blog/itunes-vs-taddy-podcast-api)

[Listen Notes API vs Taddy API - Which is better?](https://taddy.org/blog/listen-notes-vs-taddy-podcast-api)

[PodcastIndex.org API vs Taddy - Which is better?](https://taddy.org/blog/podcastindex-vs-taddy-podcast-api)

[Should I rebuild my app on Bluesky’s AT Protocol?](https://taddy.org/blog/indie-developer-weighs-pro-cons-of-rebuilding-app-on-atprotocol)

- **Download our Docs:** [Download our docs](./helpful-docs-for-ai-coding-tools.md) to give your .