# Search for podcasts or episodes

Use search to search through all 4 million podcasts and 200 million episodes in blazing fast speed.

## Examples:

### Searching

1. Searching for podcasts that match the term "Planet Money"

```graphql
{
  search(term:"Planet Money", filterForTypes:PODCASTSERIES){
    searchId
    podcastSeries{
      uuid
      name
      description
    }
  }
}
```

2. Searching for podcasts and episodes that match "Tim Ferriss"

```graphql
{
  search(term:"Tim Ferriss", filterForTypes:[PODCASTSERIES, PODCASTEPISODE]){
    searchId
    podcastSeries{
      uuid
      name
      description
    }
    podcastEpisodes{
      uuid
      name
      description
      audioUrl
    }
  }
}
```

### Pagination

3. Searching for episodes from page 2 that match "Tim Ferriss"

```graphql
{
  search(term:"Tim Ferriss", filterForTypes:PODCASTEPISODE, page:2, limitPerPage: 25){
    searchId
    podcastEpisodes{
      uuid
      name
      description
      audioUrl
    }
  }
}
```

### Sorting

By default, `search` will return the results that best match the exact term you pass it. However, you may want to prioritize results from popular podcasts over an exact match. 

4. When searching for podcasts with the term "Dentist" with sortBy: `EXACTNESS` (default) it will rank podcasts that have the exact title or description "Dentist" highest. 

However, if you use sortBy: `POPULARITY` it 1) only looks at the top 5% of most popular podcasts and 2) gives more weight to the podcast’s popularity over an exact match. This is good if you care about exclusively popular (and usually higher quality) results over an exact match. 

```graphql
{
  search(term:"Dentist", filterForTypes:PODCASTSERIES, sortBy:POPULARITY){
    searchId
    podcastSeries{
      uuid
      name
      description
    }
  }
}
```

**Note:** See [Sorting](./search-sort-by.md) documentation for more details.

### Matching

You have the ability to match the results being returned from `EXACT_PHRASE` (Strict), `ALL_TERMS`, or `MOST_TERMS`(Least strict & default). 

5. Searching "Jim Farley" episodes with matchBy: `EXACT_PHRASE` requires the exact phrase to be in the search results (which makes this option useful when searching for someone’s name)

```graphql
{
  search(term:"Jim Farley", filterForTypes:PODCASTEPISODE, matchBy:EXACT_PHRASE, sortBy:POPULARITY){
    searchId
    podcastEpisodes{
      uuid
      name
      description
      audioUrl
      podcastSeries{
	      uuid
	      name
	    }
    }
  }
}
```

6. Searching "Music Theory Jazz" episodes with matchBy: `ALL_TERMS` requires all passed in words to be present.

```graphql
{
  search(term:"Music Theory Jazz", filterForTypes:PODCASTEPISODE, matchBy:ALL_TERMS, sortBy:POPULARITY){
    searchId
    podcastEpisodes{
      uuid
      name
      description
      audioUrl
      podcastSeries{
	      uuid
	      name
	    }
    }
  }
}
```

**Note:** See [Matching](./search-match-by.md) documentation for more details.

### Filtering

You can filter your search for results from a specific country, genre, language, from a particular podcast, before or after a certain publish date, before or after the latest episode was published, or if there is a transcript available. You can see the full list of filtering options available in the [Query Input](./search.md) section below. 

7. Searching for Neil deGrasse Tyson episodes but only after a certain publish date

```graphql
{
  search(term:"Neil deGrasse Tyson", filterForTypes:PODCASTEPISODE, sortBy:POPULARITY, filterForPublishedAfter:1596649011){
    searchId
    podcastEpisodes{
      uuid
      name
      datePublished
      description
      audioUrl
      podcastSeries{
	      uuid
	      name
	    }
    }
  }
}
```

8. Searching for only Neil deGrasse Tyson episodes but only if they have a transcript available. 

```graphql
{
  search(term:"Neil deGrasse Tyson", filterForTypes:PODCASTEPISODE, sortBy:POPULARITY, filterForHasTranscript:true){
    searchId
    podcastEpisodes{
      uuid
      name
      datePublished
      description
      audioUrl
      transcript
      podcastSeries{
	      uuid
	      name
	    }
    }
  }
}
```

**Note:** All Taddy users can view transcripts that have been provided by the podcast, but you will need to be a Taddy Business user to view [transcripts that we automatically generate](./episode-transcripts.md).  

9. Searching for the term "James Webb Space Telescope" but filter only for episodes from the podcast StarTalk Radio.

```graphql
{
  search(term:"James Webb Space Telescope", filterForTypes:PODCASTEPISODE, filterForSeriesUuids:"e02ffac2-4a0e-4c6d-a42a-c59d02fe37bc"){
    searchId
    podcastEpisodes{
      uuid
      name
      description
      audioUrl
      podcastSeries{
	      uuid
	      name
	    }
    }
  }
}
```

### Ranking Score

10. You can check the ranking score for each search result. The higher the ranking score, the more relevant the result.

```graphql
{
  search(term:"James Webb Space Telescope Black Hole", filterForTypes:PODCASTEPISODE, sortBy:POPULARITY){
    searchId
    podcastEpisodes{
      uuid
      name
      description
      audioUrl
      podcastSeries{
        uuid
        name
      }
    }
    rankingDetails{
      id
      uuid
      rankingScore
    }
  }
}
```

### Exclude search terms

11. You can limit the results you get back by excluding words you don’t want. You do this by adding a minus sign in front of any word you want to exclude.

```graphql
{
  search(term:"Tim Ferriss -crypto", filterForTypes:PODCASTEPISODE){
    searchId
    podcastEpisodes{
      uuid
      name
      description
      audioUrl
    }
  }
}
```

## Query Input:

For search, you can search for podcasts or episodes using these properties:

```graphql
" The term you are searching for "
term: String

" (Optional) Allows for pagination. Default is 1 (ie: page 1 of the results). Max value is 20. "
page: Int

" (Optional) The number of results per page. Default is 10. Max value is 25 (ie: that max results you can return in one query in 25) "
limitPerPage: Int

" (Optional) Filter for certain types of content. Default is PODCASTSERIES. Possible values are PODCASTSERIES, PODCASTEPISODE, COMICSERIES, CREATOR "
filterForTypes: [SearchContentType]

" (Optional) Filter for only content made in certain countries "
filterForCountries: [Country]

" (Optional) Filter for only content made in certain languages "
filterForLanguages: [Language]

" (Optional) Filter for only content from certain genres "
filterForGenres: [Genre]

" (Optional) Filter for results only from certain series "
filterForSeriesUuids: [ID]

" (Optional) Filter for results that are not from certain series "
filterForNotInSeriesUuids: [ID]

" (Optional) Filter to return only AUDIO or VIDEO podcasts. Default is null (include both AUDIO & VIDEO podcasts)."
filterForPodcastContentType: [PodcastContentType]

" (Optional) Filter for results that are published after a certain date (Epoch time in seconds)"
filterForPublishedAfter: Int

" (Optional) Filter for results that are published before a certain date (Epoch time in seconds) "
filterForPublishedBefore: Int

" (Optional - for PODCASTSERIES) Filter for content that have an episode published after a certain date (Epoch time in seconds). This filter is only for PODCASTSERIES and will return an empty array for PODCASTEPISODE "
filterForLastUpdatedAfter: Int

" (Optional - for PODCASTSERIES) Filter for results that have an episode published before a certain date (Epoch time in seconds). This filter is only for PODCASTSERIES and will return an empty array for PODCASTEPISODE "
filterForLastUpdatedBefore: Int

" (Optional - for PODCASTSERIES) Filter for only content that has a certain total number of episodes. This filter is only for PODCASTSERIES and will return an empty array for any other type "
filterForTotalEpisodesLessThan: Int

" (Optional - for PODCASTSERIES) Filter for only content that has a certain total number of episodes. This filter is only for PODCASTSERIES and will return an empty array for any other type "
filterForTotalEpisodesGreaterThan: Int

" (Optional - for PODCASTEPISODE) Filter for episodes that have a duration less than a certain number of seconds. This filter is only for PODCASTEPISODE and will return an empty array for any other type "
filterForDurationLessThan: Int

" (Optional - for PODCASTEPISODE) Filter for episodes that have a duration greater than a certain number of seconds. This filter is only for PODCASTEPISODE and will return an empty array for any other type "
filterForDurationGreaterThan: Int

" (Optional - for PODCASTEPISODE) Filter for episodes that have a transcript available. This filter is only for PODCASTEPISODE and will return an empty array for any other type "
filterForHasTranscript: Boolean

" (Optional - for PODCASTEPISODE) Filter for episodes that have chapter files available. This filter is only for PODCASTEPISODE and will return an empty array for any other type "
filterForHasChapters: Boolean

" (Optional) Choose how the results are sorted. Default is sort by EXACTNESS. Possible values are EXACTNESS and POPULARITY. "
sortBy: SearchSortOrder

" (Optional) Choose which results are matched as valid search results. Default is MOST_TERMS. Possible values are MOST_TERMS, ALL_TERMS, FREQUENCY. If you search has multiple terms, FREQUENCY gives more weight to the terms that appear less frequently in results "
matchBy: SearchMatchType

" (Optional) Choose to only return safe (not explicit) content or all content. Default is false (include everything, including explicit content) "
isSafeMode: Boolean
```

## Query Response:

The response you get back includes an array of [PodcastSeries](./podcastseries.md) and [PodcastEpisodes](./podcastepisode.md) that match your search term.

```graphql
" Identifier for the search query being sent (Used for caching)"
searchId: ID!

" A list of PodcastSeries items "
podcastSeries: [PodcastSeries]

" A list of PodcastEpisode items "
podcastEpisodes: [PodcastEpisode]

" Ranking information for each search result "
rankingDetails: [SearchRankingDetails]

" Additional information on the search results (Total # of results, pages, etc) "
responseDetails: [SearchResponseDetails]
```

### Referenced types in this document:

[Country](./country.md)

[Language](./language.md)

[Genre](./genre.md)

[TaddyType](./taddytype.md)

[PodcastSeries](./podcastseries.md)

[PodcastEpisode](./podcastepisode.md)

[SearchContentType](./search-content-type.md)

[SearchMatchType](./search-match-by.md)

[SearchSortOrder](./search-sort-by.md)

[SearchRankingDetails](./search-query-ranking-details.md)

[SearchResponseDetails](./search-query-response-details.md)

<aside>
👋 If you are new to using Taddy’s API, **Get Started** with our [**🤖 Intro to Taddy’s API](./intro-to-taddy-podcast-api.md).**

</aside>

More Links:  

[Sign Up →](https://taddy.org/signup/developers)

[Taddy Dashboard →](https://taddy.org/dashboard) 

[Pricing](./pricing.md)

[Terms of Service](https://taddy.org/terms-of-service)

[Developer Policy](https://taddy.org/terms-of-service/developer-policy)