# PodcastEpisode

GraphQL Type for a Podcast Episode.

```graphql
" Taddy's unique identifier (an uuid) "
uuid: ID

" Date when the episode was published (Epoch time in seconds) "
datePublished: Int

" The name of an episode "
name: String

" The description for a episode "
description(
  " (Optional) Option to remove the html tags from the description or leave the description as is (which might include html tags). Default is false (do not strip html tags from description)."
  shouldStripHtmlTags: Boolean
): String

" Extract all links from within the description. " 
descriptionLinks: [String]

" Cover Art for the episode (it may be different than podcast cover art) "
imageUrl: String

" A different hash means that details for this episode have updated since the last hash "
hash: String

" An episode's unique identifier from its RSS feed "
guid: String

" The subtitle of an episode (shorter version of episode description, limited to 255 characters long) "
subtitle: String

" Link to Audio Content "
audioUrl: String

" Link to Video Content "
videoUrl: String

" File Length of Content. Typed as Float (not Int) to support 64-bit integers (very large files) "
fileLength: Float

" Exact File Type of Content "
fileType: String

" Duration of Content (in seconds) "
duration: Int

" Episode Type ie) trailer, bonus or full "
episodeType: PodcastEpisodeType

" Season Number (if provided) "
seasonNumber: Int

" Episode Number (if provided) "
episodeNumber: Int

" Website Link for episode "
websiteUrl: String

" If the episode contain's explicit content "
isExplicitContent: Boolean

" If the episode has now been removed from the RSS Feed "
isRemoved: Boolean

" If the content has violated Taddy's distribution policies for illegal or harmful content it will be blocked from getting any updates "
isBlocked: Boolean

" Details on the podcast for which this episode belongs to "
podcastSeries: PodcastSeries

" People listed on the episode including thier roles (Hosts, Guests, etc) "
persons: [Person]

" Status of transcript (complete, processing, not transcribed) "
taddyTranscribeStatus: PodcastEpisodeTranscriptionStatus

" Downloads the transcript, parses it and returns an array of text in paragraphs. "
transcript: [String]

" Download the transcript, parses it and return an array of transcript items (which includes text, speakers and timecodes) "
transcriptWithSpeakersAndTimecodes(
  " (Optional) Style option for transcript. Default is PARAGRAPH"
  style: TranscriptItemStyle
): [TranscriptItem]

" A list of urls where you can download the transcript for this episode "
transcriptUrls: [String]

" A list of urls where you can download the transcript for this episode, including more details "
transcriptUrlsWithDetails: [TranscriptLink]

" Download and parse the chapters "
chapters: [Chapter]

" A list of urls where you can download chapter details "
chaptersUrls: [String]

" A list of urls where you can download chapter details, including more details "
chaptersUrlsWithDetails: [ChapterLink]

" Alternate enclosures available for this episode (different formats, qualities, video) "
alternateEnclosureUrlsWithDetails: [AlternateEnclosureLink]
```

### Other Referenced types in this document:

[PodcastSeries](./podcastseries.md)

[PodcastEpisodeType](./podcast-episode-type.md)

[PodcastEpisodeTranscriptionStatus](./podcastepisode-transcription-status.md)

[Person](./person.md)

[TranscriptItem](./episode-transcript-item.md)

[TranscriptLink](./episode-transcript-link.md)

[AlternateEnclosureLink](./episode-alternate-enclosure-link.md)

[ChapterLink](./episode-chapter-link.md)

[Chapter](./episode-chapter-item.md)