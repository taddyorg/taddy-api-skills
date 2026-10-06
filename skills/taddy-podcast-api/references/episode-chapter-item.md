# Chapter

Get details on the chapters for an episode.

```graphql
type Chapter {
  " The unique identifier for the chapter "
  id: ID

  " The title of the chapter "
  title: String

  " The start timecode of the chapter in milliseconds "
  startTimecode: Int
}
```