# TranscriptItem

Get the transcript for an episode. Includes text, timecodes and speaker info.

```graphql
type TranscriptItem {
  " The unique identifier for the transcript item "
  id: ID

  " The text of the transcript item "
  text: String

  " (Optional) The speaker of the transcript item "
  speaker: String

  " The start timecode of the transcript item in milliseconds "
  startTimecode: Int

  " The end timecode of the transcript item in milliseconds "
  endTimecode: Int
}
```

### TranscriptItemStyle

Depending on which style you pick, you will get back a different TranscriptItems.

```graphql
enum TranscriptItemStyle {
  UTTERANCE
  PARAGRAPH
}
```

`UTTERANCE` is a phrase, thought, or sentence spoken by a user and is the default returned via Open AI’s Whisper model. 

`PARAGRAPH` (Default): Combines utterances into a complete sentence and then different paragraphs based on if there is greater than a 500 millisecond break in speech.

Please see [transcripts](./episode-transcripts.md) for additional context.