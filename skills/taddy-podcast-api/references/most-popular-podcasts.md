# Get the most popular podcasts

Use getPopularContent to get details on the most popular podcasts. Moreover, you can filter by language or genre. 

## Example

To get the most popular podcasts in English:

```graphql
{
  getPopularContent(filterByLanguage:ENGLISH){
    popularityRankId
    podcastSeries{
      uuid
      name
      description
      popularityRank
    }
  }
}
```

To get the most popular podcasts in the Business genre. 

**Note:** filterByGenres takes an array of genres so that you can use multiple genres and subgenres. Please see [Genre](./genre.md) for a full list of possible genres.

```graphql
{
  getPopularContent(filterByLanguage:ENGLISH, filterByGenres:[PODCASTSERIES_BUSINESS, PODCASTSERIES_NEWS_BUSINESS, PODCASTSERIES_BUSINESS_CAREERS, PODCASTSERIES_BUSINESS_INVESTING, PODCASTSERIES_BUSINESS_MARKETING, PODCASTSERIES_BUSINESS_MANAGEMENT, PODCASTSERIES_BUSINESS_NON_PROFIT, PODCASTSERIES_BUSINESS_ENTREPRENEURSHIP]){
    popularityRankId
    podcastSeries{
      uuid
      name
      description
      popularityRank
    }
  }
}
```

## Query Input:

For getPopularContent, you can get back a list of podcasts with the following input:

```graphql
" (Optional) Allows for filtering by language. "
filterByLanguage: Language

" (Optional) Allows for filtering by genres. "
filterByGenres: [Genre!]

" (Optional) Allows for pagination. Default is 1 (ie: page 1 of the results). Max value is 20. "
page: Int

" (Optional) The number of results per page. Default is 10. Max value is 25 (ie: that max results you can return in one query in 25) "
limitPerPage: Int
```

## Query Response:

The response you get back includes an array of [PodcastSeries](./podcastseries.md) . 

```graphql
" Identifier for the popularity query being sent (Used for caching) "
popularityRankId: ID!

" A list of PodcastSeries items "
podcastSeries: [PodcastSeries]
```

### Referenced types in this document:

[PodcastSeries](./podcastseries.md)

[PodcastEpisode](./podcastepisode.md)

[SortOrder](./sort-order.md)

[PodcastSeriesType](./podcast-series-type.md)

[PodcastContentType](./podcast-content-type.md)

[PodcastSeriesTranscriptionStatus](./podcastseries-transcription-status.md)

[Person](./person.md)

[iTunesInfo](./itunesinfo.md)

[Language](./language.md)

[FeedRefreshDetails](./feed-refresh-details.md)

<aside>
👋 If you are new to using Taddy’s API, **Get Started** with our [**🤖 Intro to Taddy’s API](./intro-to-taddy-podcast-api.md).**

</aside>

More Links:  

[Sign Up →](https://taddy.org/signup/developers)

[Taddy Dashboard →](https://taddy.org/dashboard) 

[Pricing](./pricing.md)

[Terms of Service](https://taddy.org/terms-of-service)

[Developer Policy](https://taddy.org/terms-of-service/developer-policy)