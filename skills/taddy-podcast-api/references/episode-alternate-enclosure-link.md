# AlternateEnclosureLink

Get links to alternative content formats for an episode. ex) a video file or higher (or lower) quality audio files available for this episode. Taken from the tag `<podcast:alternateEnclosure>` in the RSS feed.

```graphql
type AlternateEnclosureLink {
  " MIME type of the media "
  type: String

  " File size in bytes. Typed as Float (not Int) to support 64-bit integers (very large files)"
  length: Float

  " URI to the media file "
  uri: String

  " (Optional) Bitrate of media "
  bitrate: String

  " (Optional) Height in pixels (for video) "
  height: Int

  " (Optional) BCP 47 language tag "
  lang: String

  " (Optional) Human-readable title "
  title: String

  " (Optional) Relationship/grouping identifier "
  rel: String

  " (Optional) RFC 6381 codec string "
  codecs: String

  " (Optional) If true, this is the same content as the standard enclosure "
  default: Boolean

  " (Optional) Content type of this specific source, if different from the media type "
  sourceContentType: String
}
```

**Example:** Check out the recent episodes from the Podnews Daily podcast (uuid: “027bc08a-e1b5-471a-b9eb-175dab5aba63”). Each episode returns multiple audio files (mp3, acc, opus) and a video file (mp4)