# Get details on multiple episodes

Use getMultiplePodcastEpisodes to get details on multiple episodes. There is a max limit of 25 episodes per request.

## Example:

```graphql
{
  getMultiplePodcastEpisodes(uuids:["9ef0ddbf-65c4-4bba-89af-49d6f3f11464", "1ee4859c-cf17-48c8-9edb-a501544bdb75"]){
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
  }
}
```

Response from Taddy’s API:

```graphql
{
  "data": {
    "getMultiplePodcastEpisodes": [
      {
        "uuid": "9ef0ddbf-65c4-4bba-89af-49d6f3f11464",
        "hash": "1327b13c10209636b14d12f486e52aeadda8af21f070d11bedd0544b0dc36706",
        "name": "The Battle for Azovstal: A Soldier’s Story",
        "description": "<p>For the past two months, a group of Ukrainian fighters has been holed up in the Azovstal steel plant in the city of Mariupol, mounting a last stand against Russian forces in a critical part of eastern Ukraine.</p><p>On Monday, Ukraine finally surrendered the plant.</p><p>After the end of the determined resistance at Azovstal, we hear from Leonid Kuznetsov, a 25 year-old soldier who had been stationed inside.</p><p>Guest: <a href=\"https://www.nytimes.com/by/michael-schwirtz?smid=pc-thedaily\">Michael Schwirtz</a>, an investigative reporter for The New York Times.</p><p>Want more from The Daily? For one big idea on the news each week from our team, <a href=\"https://www.nytimes.com/newsletters/the-daily?module=inline\">subscribe to our newsletter</a>. </p><p>Background reading: </p><ul><li>Hundreds of Ukrainian soldiers who fought at the steel plant in Mariupol<a href=\"https://www.nytimes.com/2022/05/17/world/europe/ukraine-mariupol-fighters-surrender.html\"> face an uncertain future</a> in Russian custody.</li></ul><p>For more information on today’s episode, visit <a href=\"http://nytimes.com/thedaily?smid=pc-thedaily\">nytimes.com/thedaily</a>. Transcripts of each episode will be made available by the next workday. </p>\n",
        "imageUrl": null,
        "datePublished": 1652867700,
        "guid": "c1be4b7b-9109-42aa-8f74-3c2d0a429f59",
        "subtitle": "For the past two months, a group of Ukrainian fighters has been holed up in the Azovstal steel plant in the city of Mariupol, mounting a last stand against Russian forces in a critical part of eastern Ukraine.\n\nOn Monday, Ukraine finally surrendered the plant.\n\nAfter the end of the determined resistance at Azovstal, we hear from Leonid Kuznetsov, a 25 year-old soldier who had been stationed inside.\n\nGuest: Michael Schwirtz, an investigative reporter for The New York Times.",
        "audioUrl": "https://dts.podtrac.com/redirect.mp3/chrt.fm/track/8DB4DB/pdst.fm/e/nyt.simplecastaudio.com/03d8b493-87fc-4bd1-931f-8a8e9b945d8a/episodes/8484d0fb-6124-49c3-9b83-e95cf558847e/audio/128/default.mp3?aid=rss_feed&awCollectionId=03d8b493-87fc-4bd1-931f-8a8e9b945d8a&awEpisodeId=8484d0fb-6124-49c3-9b83-e95cf558847e&feed=54nAGcIl",
        "videoUrl": null,
        "fileLength": 29985152,
        "fileType": "audio/mpeg",
        "duration": 1874,
        "episodeType": "FULL",
        "seasonNumber": null,
        "episodeNumber": null,
        "websiteUrl": "https://www.nytimes.com/the-daily",
        "isExplicitContent": false,
        "isRemoved": null
      },
      {
        "uuid": "1ee4859c-cf17-48c8-9edb-a501544bdb75",
        "hash": "d951733fa92da746fa2d86177f97dd253d14d3e85a5cc831be8355b96f33f239",
        "name": "The Sunday Read: ‘I Lived the #VanLife. It Wasn’t Pretty.’",
        "description": "<p>The Times journalist Caity Weaver was tasked by her editor to go on an adventure: With an old college friend she would spend a week in California, living out of a converted camper van, in pursuit of the aesthetic fantasy known as #VanLife.</p><p>Given the discomfort that can arise even in the plushiest of vehicles, it’s a surprising trend that shows no sign of letting up. As Weaver explains, even the idea of living full time out of a vehicle has “become aspirational for a subset of millennials and Zoomers, despite the fact that, traditionally, residing in a car or van is usually an action taken as a last resort, from want of other options to protect oneself from the elements.”</p><p>Unpacking the craze by testing it herself, Weaver offers a humorous account of the trials of not being adequately prepared, claustrophobia, long restaurant lines, the increase in traffic within the national parks, and the disappointment that occurs when an Instagram aesthetic bumps up against reality. Sometimes fantasies are too good to be true.</p><p><i><strong>This story was written by Caity Weaver and recorded by Audm</strong>. To hear more audio stories from publications like The New York Times, </i><a href=\"https://www.audm.com/?utm_source=nytmag&utm_medium=embed&utm_campaign=age_old_question_jabr\" target=\"_blank\"><i>download Audm for iPhone or Android</i></a><i>.</i></p>\n",
        "imageUrl": null,
        "datePublished": 1652608800,
        "guid": "1b640a0c-01ea-427b-a115-16de63709157",
        "subtitle": "The Times journalist Caity Weaver was tasked by her editor to go on an adventure: With an old college friend she would spend a week in California, living out of a converted camper van, in pursuit of the aesthetic fantasy known as #VanLife.\n\nGiven the discomfort that can arise even in the plushiest of vehicles, it’s a surprising trend that shows no sign of letting up. As Weaver explains, even the idea of living full time out of a vehicle has “become aspirational for a subset of millennials and Zoomers, despite the fact that, traditionally, residing in a car or van is usually an action taken as a last resort, from want of other options to protect oneself from the elements.”\n\nUnpacking the craze by testing it herself, Weaver offers a humorous account of the trials of not being adequately prepared, claustrophobia, long restaurant lines, the increase in traffic within the national parks, and the disappointment that occurs when an Instagram aesthetic bumps up against reality. Sometimes f...",
        "audioUrl": "https://dts.podtrac.com/redirect.mp3/chrt.fm/track/8DB4DB/pdst.fm/e/nyt.simplecastaudio.com/03d8b493-87fc-4bd1-931f-8a8e9b945d8a/episodes/7f79bcdd-068e-4f78-9f2d-aaa7d0d33c36/audio/128/default.mp3?aid=rss_feed&awCollectionId=03d8b493-87fc-4bd1-931f-8a8e9b945d8a&awEpisodeId=7f79bcdd-068e-4f78-9f2d-aaa7d0d33c36&feed=54nAGcIl",
        "videoUrl": null,
        "fileLength": 31627013,
        "fileType": "audio/mpeg",
        "duration": 1976,
        "episodeType": "FULL",
        "seasonNumber": null,
        "episodeNumber": null,
        "websiteUrl": "https://www.nytimes.com/the-daily",
        "isExplicitContent": false,
        "isRemoved": null
      }
    ]
  }
}
```

## Query Input:

For getMultiplePodcastEpisodes, you can get details on episodes by passing in an array of uuids. 

```graphql
" An Array of taddy's unique identifier (uuid). Max 25 IDs allowed "
uuids: [ID]
```

## Query Response:

The response you get back is an array of [PodcastEpisode](./podcastepisode.md).

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
persons(
  " (Experimental) Include persons we have inferred using the episode's transcript "
  includeAutoGeneratedPersons: Boolean
): [Person]

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

[AlternateEnclosureLink](./episode-alternate-enclosure-link.md)

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