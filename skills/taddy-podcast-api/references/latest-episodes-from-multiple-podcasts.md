# Get the most recent episodes

Use getLatestPodcastEpisodes if you are building a podcast feed and want to return the most recent episodes from multiple podcasts.

## Example

```graphql
{
  getLatestPodcastEpisodes(uuids:["fc3c8bb1-1b2a-4619-a029-8866610ae292", "f8de4489-7054-4ce1-9325-87fb4a69e123", "afd89860-866c-4ceb-b4f0-c290d77dad90", "c86d311c-0744-4f6b-9e29-3317d9626a37"]){
    uuid
    name
    datePublished
    audioUrl
	}
}
```

Example response from this query:

```graphql
{
  "data": {
    "getLatestPodcastEpisodes": [
      {
        "uuid": "026c604c-1dcb-49b5-821e-22746d79f738",
        "name": "Richard III: Good Guy or Evil Putz?",
        "datePublished": 1745312400,
        "audioUrl": "https://podtrac.com/pts/redirect.mp3/pscrb.fm/rss/p/traffic.omny.fm/d/clips/e73c998e-6e60-432f-8610-ae210140c5b1/a91018a4-ea4f-4130-bf55-ae270180c327/dd66d63a-6391-4af2-ac7e-b2c6014dcd39/audio.mp3?utm_source=Podcast&in_playlist=44710ecc-10bb-48d1-93c7-ae270180c33e"
      },
      {
        "uuid": "ef8dda4d-b653-4940-b3df-811ee35215f6",
        "name": "MURDERED: Solomon Robinson",
        "datePublished": 1745218800,
        "audioUrl": "https://tracking.swap.fm/track/fxUKVg2nSMaPSHLeKNKH/pscrb.fm/rss/p/stitcher.simplecastaudio.com/ec74d48c-cbf1-4764-923e-7d584dce50fa/episodes/0cccb36f-e11a-4ffa-a8f6-a7d78105fdea/audio/128/default.mp3?aid=rss_feed&awCollectionId=ec74d48c-cbf1-4764-923e-7d584dce50fa&awEpisodeId=0cccb36f-e11a-4ffa-a8f6-a7d78105fdea&feed=qm_9xx0g"
      },
      {
        "uuid": "3ec2d79b-eb21-45e6-8d08-d788c39b37d3",
        "name": "Lore 278: Bad For Business",
        "datePublished": 1745208060,
        "audioUrl": "https://pdst.fm/e/pscrb.fm/rss/p/claritaspod.com/measure/dts.podtrac.com/redirect.mp3/mgln.ai/e/35/traffic.libsyn.com/secure/lorepodcast/Lore278b.mp3?dest-id=259905"
      },
      //returns 25 episodes in total
  }
}
```

## Query Input:

For getLatestPodcastEpisodes, you can get back the most recent episodes with the following parameterst:

```graphql
" An Array of taddy's unique identifier (uuid). Max 1000 uuids allowed "
uuids: [ID],

" An Array of urls to the RSS feeds for the podcasts. Max 1000 rssUrls allowed "
rssUrls: [String],

" Allows for pagination. The page number to return. Default is 1. Max value is 20 "
page: Int,

" Allows for pagination. The number of episodes to return per page. Default is 25. Max value is 50 "
limitPerPage: Int
```

**Notes:**

- The query supports up to 1,000 UUIDs (or rssUrls) per request.
- Under the hood this can be a complex query, and because of that, Free users are limited to only page 1 and to only return 25 episodes (the default for the query). Paid Taddy API users can get paginated responses and return up to 50 episodes back.

## Query Response:

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

" Status of automatically generated transcription "
taddyTranscribeStatus: PodcastEpisodeTranscriptionStatus

" Downloads the transcript, parses it and returns an array of text in paragraphs. "
transcript: [String]

" A list of urls where you can download the transcript for this episode "
transcriptUrls: [String]

" A list of urls where you can download the transcript for this episode, including more details "
transcriptUrlsWithDetails: [TranscriptLink]

" Download the transcript, parse it and return an array of transcript items (which include text, speakers and timecodes) "
transcriptWithSpeakersAndTimecodes(
  " (Optional) Style option for transcript. Default is PARAGRAPH"
  style: TranscriptItemStyle
): [TranscriptItem]

" Download and parse the chapters "
chapters: [Chapter]

" A list of urls where you can download chapter details "
chaptersUrls: [String]

" A list of urls where you can download chapter details, including more details "
chaptersUrlsWithDetails: [ChapterLink]
```

### Referenced types in this document:

[PodcastEpisode](./podcastepisode.md)

[PodcastSeries](./podcastseries.md)

[PodcastEpisodeType](./podcast-episode-type.md)

[PodcastEpisodeTranscriptionStatus](./podcastepisode-transcription-status.md)

[Person](./person.md)

[TranscriptItem](./episode-transcript-item.md)

[TranscriptLink](./episode-transcript-link.md)

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