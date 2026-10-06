# SearchResponseDetails

Additional details about the search request.

```graphql
type SearchResponseDetails {
  " Identifier for the search query being sent "
  id: ID!

  " The type of item being returned in the search results "
  type: SearchContentType

  " Total number of search results returned for this type "
  totalCount: Int

  " Total number of pages of results returned for this type "
  pagesCount: Int
}
```