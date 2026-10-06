# ChapterLink

Link details where you can download chapters for an episode.

```graphql
" A url link to the chapters for an episode "
type ChapterLink {
  " The url to the chapter "
  url: String

  " Mime type of file "
  type: String

  " If the transcript is exclusive to Taddy API Business users and you need an API key to access it "
  isTaddyExclusive: Boolean
}
```