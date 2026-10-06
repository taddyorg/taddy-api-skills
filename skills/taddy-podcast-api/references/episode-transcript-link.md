# TranscriptLink

Link details where you can download an episode’s transcript. Along with the url, it also contains additional information like file type and language, which may be useful to you.

```graphql
type TranscriptLink {
  " The url to the transcript "
  url: String

  " Mime type of file"
  type: String
  
  " If the transcript is exclusive to Taddy API Business users and you need an API key to access it "
  isTaddyExclusive: Boolean

  " (Optional) The language of the transcript "
  language: String

  " (Optional) If the transcript has timecodes "
  hasTimecodes: Boolean
}
```

Please see [transcripts](./episode-transcripts.md) for additional context.