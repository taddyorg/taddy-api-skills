# Get episode details

Use getPodcastEpisode to get details on a specific podcast episode.

### Example:

```graphql
{
  getPodcastEpisode(uuid: "eb9d1c8f-58a4-4adb-a3d3-6bca573d31a2"){
    uuid
    hash
    name
    description
    imageUrl
    datePublished
    guid
    subtitle
    audioUrl
    videoUrl
    fileLength
    fileType
    duration
    episodeType
    seasonNumber
    episodeNumber
    websiteUrl
    isExplicitContent
    isRemoved
    podcastSeries{
      uuid
      name
    }
  }
}
```

Example response from Taddy’s API:

```graphql
{
  "data": {
    "getPodcastEpisode": {
      "uuid": "eb9d1c8f-58a4-4adb-a3d3-6bca573d31a2",
      "hash": "700d5eca3bd6ea013760bfe5956a9c4ddbd7399f26c2eb2a5b0360a7e76fa448",
      "name": "Case #2 Britney",
      "description": "<p>Andrea's a writer no one reads. Then she makes a shocking discovery.</p><p> </p><p>Learn more about your ad choices. Visit <a href=\"https://podcastchoices.com/adchoices\">podcastchoices.com/adchoices</a></p>",
      "imageUrl": null,
      "datePublished": 1432958400,
      "guid": "http://www.wnyc.org/story/case-2-britney/",
      "subtitle": "The Case:  Andrea's a writer no one reads. Then she makes a shocking discovery. The Facts:  Mystery Show is produced by myself, Alex Blumberg, Melinda Shopsin and Eric Mennel. Producing help from Chris Neary and Wendy Dorr. Eli Horowitz is contributing ed",
      "audioUrl": "https://traffic.megaphone.fm/GLT5025099642.mp3?updated=1511216902",
      "videoUrl": null,
      "fileLength": null,
      "fileType": "audio/mpeg",
      "duration": 2964,
      "episodeType": "FULL",
      "seasonNumber": null,
      "episodeNumber": null,
      "websiteUrl": null,
      "isExplicitContent": false,
      "isRemoved": null,
      "podcastSeries": {
        "uuid": "8c9998d7-7114-4514-ab17-1a0ad05f73fc",
        "name": "Mystery Show"
      }
    }
  }
}
```

## Query Breakdown:

For getPodcastEpisode, you can get details on any episode using one of the following properties:

```graphql
" Taddy's unique identifier (uuid) "
uuid: ID,

" An episode's guid (from its RSS Feed). Note: guid is not guaranteed to be unique (two different podcasts can use the same guid for two different episodes). If you know the podcast series uuid, you can use seriesUuidForLookup to filter the results to only return episodes for that series "
guid: String,

" The name (title) of a episode. Note: Multiple episodes can have the exact same name. If you know the podcast series uuid, you can use seriesUuidForLookup to filter the results to only return episodes for that series "
name: String,

" If you know the podcast series uuid, you can use this to filter the results to only return episodes for that series. This is useful if you using this query and passing in guid or name and want to ensure you get the correct episode "
seriesUuidForLookup: ID,
```

The response you get back is a [PodcastEpisode](./podcastepisode.md). That means you can get back any of the following details for a podcast episode:

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

### Referenced types in this document:

[PodcastEpisode](./podcastepisode.md)

[PodcastSeries](./podcastseries.md)

[PodcastEpisodeType](./podcast-episode-type.md)

[PodcastEpisodeTranscriptionStatus](./podcastepisode-transcription-status.md)

[Person](./person.md)

[TranscriptItem](./episode-transcript-item.md)

[TranscriptLink](./episode-transcript-link.md)

[AlternativeEnclosureLink](./episode-alternate-enclosure-link.md)

[ChapterLink](./episode-chapter-link.md)

[Chapter](./episode-chapter-item.md)

<aside>
👋 If you are new to using Taddy’s API, **Get Started** with our [**🤖 Intro to Taddy’s API](./intro-to-taddy-podcast-api.md).**

</aside>

More Links:  

[Sign Up →](https://taddy.org/signup/developers)

[Taddy Dashboard →](https://taddy.org/dashboard) 

[Pricing](./pricing.md)

[Terms of Service](https://taddy.org/terms-of-service)

[Developer Policy](https://taddy.org/terms-of-service/developer-policy)