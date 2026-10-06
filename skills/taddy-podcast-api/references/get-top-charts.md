# Top Charts on Apple Podcasts

Use getTopChartsByCountry or getTopChartsByGenres to get the top podcasts or episodes from Apple Podcasts.

**Notes:**

- Top Charts are updated daily (~ 9 AM PST)
- For Podcasts, you can get Top Charts by country or genre
- For Episodes, you can only get Top Charts by country.

## Examples:

1. Get today’s Top Podcasts in the US

```graphql
{
  getTopChartsByCountry(taddyType:PODCASTSERIES, country:UNITED_STATES_OF_AMERICA){
    topChartsId
    podcastSeries{
      uuid
      name
    }
    podcastEpisodes{
      uuid
      name
      podcastSeries{
        uuid
        name
      }
    }
  }
}
```

2. Get today’s Top Episodes in the US

```graphql
{
  getTopChartsByCountry(taddyType:PODCASTEPISODE, country:UNITED_STATES_OF_AMERICA){
    topChartsId
    podcastSeries{
      uuid
      name
    }
    podcastEpisodes{
      uuid
      name
      podcastSeries{
        uuid
        name
      }
    }
  }
}
```

3. Get today’s Top Podcasts in the `PODCASTSERIES_TRUE_CRIME` Genre

```graphql
{
  getTopChartsByGenres(taddyType:PODCASTSERIES, genres:PODCASTSERIES_TRUE_CRIME){
    topChartsId
    podcastSeries{
      uuid
      name
    }
    podcastEpisodes{
      uuid
      name
      podcastSeries{
        uuid
        name
      }
    }
  }
}
```

4. (BONUS) You can get Top Episodes by Genre and Country. Use `getTopChartsByGenres` and pass in the `filterByCountry`. Behind the scenes, this is the same data from Apple’s Top 200 Episodes chart for a country, we filter by genre to get a Top Episodes by Genre and Country chart. Since Apple provides only 200 top episodes per day per country, there is a chance that some genres will return no episodes.

```graphql
{
  getTopChartsByGenres(taddyType:PODCASTEPISODE, genres:PODCASTSERIES_TRUE_CRIME, filterByCountry:UNITED_STATES_OF_AMERICA){
    topChartsId
    podcastSeries{
      uuid
      name
    }
    podcastEpisodes{
      uuid
      name
      podcastSeries{
        uuid
        name
      }
    }
  }
}
```

## Query Input:

1. For getTopChartsByCountry, you can get the top charts for a specific platform (for podcasts or episodes):

```graphql
" The type of content you want to get top charts information on. "
taddyType: TaddyType!

" Which country do you want the Top Charts for."
country: Country!

" (Optional) The platform to check for top charts content. Default is APPLE_PODCASTS "
source: TopChartsSource

" (Optional) Allows for pagination. Default is 1 (ie: page 1 of the results). Max value is 20. "
page: Int

" (Optional) The number of results per page. Default is 10. Max value is 25 (ie: that max results you can return in one query in 25) "
limitPerPage: Int
```

2. For getTopChartsByGenres, you can get the top charts for a specific platform (for podcasts or episodes):

```graphql
" The type of content you want to get top charts information on. "
taddyType: TaddyType!

" Which genres do you want the Top Charts for."
genres: [Genre!]

" (Optional) The platform to check for top charts content. Default is APPLE_PODCASTS "
source: TopChartsSource

" (Optional) We filter the results by country (needed for PODCASTEPISODE taddyType)"
filterByCountry: Country

" (Optional) Allows for pagination. Default is 1 (ie: page 1 of the results). Max value is 20. "
page: Int

" (Optional) The number of results per page. Default is 10. Max value is 25 (ie: that max results you can return in one query in 25) "
limitPerPage: Int
```

## Query Response:

The response you get back includes an array of [PodcastSeries](./podcastseries.md) and [PodcastEpisodes](./podcastepisode.md) that match your top charts query.

```graphql
" Identifier for the top charts query being sent (Used for caching) "
topChartsId: ID!

" A list of PodcastSeries items "
podcastSeries: [PodcastSeries]

" A list of PodcastEpisode items "
podcastEpisodes: [PodcastEpisode]
```

### Referenced types in this document:

[TaddyType](./taddytype.md)

[Country](./country.md)

[Genre](./genre.md)

[TopChartsSource](./top-charts-source.md)

[TopChartsType](./top-charts-type.md)

<aside>
👋 If you are new to using Taddy’s API, **Get Started** with our [**🤖 Intro to Taddy’s API](./intro-to-taddy-podcast-api.md).**

</aside>

More Links:  

[Sign Up →](https://taddy.org/signup/developers)

[Taddy Dashboard →](https://taddy.org/dashboard) 

[Pricing](./pricing.md)

[Terms of Service](https://taddy.org/terms-of-service)

[Developer Policy](https://taddy.org/terms-of-service/developer-policy)