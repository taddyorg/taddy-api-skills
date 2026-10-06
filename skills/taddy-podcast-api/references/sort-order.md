# SortOrder

SortOrder gives you the ability to return different items based on what option you pass in.

```graphql
enum SortOrder {
  LATEST
  OLDEST
  SEARCH
}
```

`LATEST` - Return latest (newest) first

`OLDEST` - Return oldest first

`SEARCH` - Return only episodes that match filtered `searchTerm` (another property that should be passed in whenever `SEARCH` is chosen as the SortOrder).