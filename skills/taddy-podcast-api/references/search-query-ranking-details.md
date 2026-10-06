# SearchRankingDetails

Ranking details (including score) about each search result.

```graphql
type SearchRankingDetails {
  " Identifier for the search query being sent "
  id: ID!

  " The UUID of the item being returned in the search results "
  uuid: ID

  " The type of item being returned in the search results "
  type: SearchContentType

  " The ranking score for the search results from 100 to 0. The higher the score the more relevant the result. "
  rankingScore: Int
}
```