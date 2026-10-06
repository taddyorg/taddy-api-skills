# PodcastEpisodeTranscriptionStatus

Useful to check if Taddy is automatically generating transcripts and chapters for this podcast

```graphql
enum PodcastEpisodeTranscriptionStatus {
  NOT_TRANSCRIBING
  PROCESSING
  COMPLETED
  FAILED
}
```

`COMPLETED` - Transcript are now available. (This can be either be because the podcast has provided it or because we have automatically transcribed the episode)

`PROCESSING` - Currently in a queue, waiting to be transcribed. Please note that there can be 10k+ episodes that are queued to be transcribed (so it does not necessarily mean it is going to be transcribed in the next couple minutes).

`NOT_TRANSCRIBING` - We are not planning to transcribe this episode.

`FAILED` - There was an error generating a transcript for this episode.

For episodes in the `PROCESSING` or  `NOT_TRANSCRIBING` state, you still can get the transcript, however they are generated on-demand (takes ~10 seconds to transcribe every ~1hr of audio).

Please see [transcripts](./episode-transcripts.md) for more details.