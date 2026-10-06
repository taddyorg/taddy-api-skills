# PodcastSeriesTranscriptionStatus

Useful to check if Taddy is automatically generating transcripts and chapters for this podcast

```graphql
enum PodcastSeriesTranscriptionStatus {
  TRANSCRIBING
  NOT_TRANSCRIBING
  CREATOR_ASKED_NOT_TO_TRANSCRIBE
}
```

`TRANSCRIBING` - Taddy API Business Users get access to automatically generated transcripts and chapters for episodes of this podcast. 

`NOT_TRANSCRIBING` - We do not automatically generate transcripts or chapters. 

`CREATOR_ASKED_NOT_TO_TRANSCRIBE` - A creator can contact us and asks us not to transcribe their episodes.

Please see [transcripts](./episode-transcripts.md) for additional context.