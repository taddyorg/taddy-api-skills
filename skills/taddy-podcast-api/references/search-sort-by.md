# SearchSortOrder

Choose if you want search results to be prioritized by exact term matching or popularity of the content.

```graphql
enum SearchSortOrder {
  EXACTNESS
  POPULARITY
}
```

`EXACTNESS`(Default) - Search results will prioritize exact matching based on title, description, publisher name and other relevant information. 

`POPULARITY` - Search will still match the terms you provide, but the result be filtered to include only the top 5% of the most popular podcasts. Popularity of the podcast is determined by the [iTunes Top Charts](./get-top-charts.md).  This is useful if you want popular (and usually higher quality) results over an exact match.