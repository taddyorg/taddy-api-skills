# Get details on multiple podcasts

Use getMultiplePodcastSeries to get details on multiple podcasts. There is a max limit of 25 podcasts per request.

## Example:

```graphql
{
  getMultiplePodcastSeries(uuids:["cb8d858a-3ef4-4645-8942-67e55c0927f2", "d682a935-ad2d-46ee-a0ac-139198b83bcc"]){
    uuid
    name
    itunesId
    description
    imageUrl
    itunesInfo{
      uuid
      publisherName
      baseArtworkUrlOf(size: 640)
    }
  }
}
```

Response from Taddy’s API:

```graphql
{
  "data": {
    "getMultiplePodcastSeries": [
      {
        "uuid": "cb8d858a-3ef4-4645-8942-67e55c0927f2",
        "name": "The Daily",
        "itunesId": 1200361736,
        "description": "This is what the news should sound like. The biggest stories of our time, told by the best journalists in the world. Hosted by Michael Barbaro and Sabrina Tavernise. Twenty minutes a day, five days a week, ready by 6 a.m.",
        "imageUrl": "https://image.simplecastcdn.com/images/03d8b493-87fc-4bd1-931f-8a8e9b945d8a/2cce5659-f647-4366-b318-46e4b67afcfa/3000x3000/c81936f538106550b804e7e4fe2c236319bab7fba37941a6e8f7e5c3d3048b88fc5b2182fb790f7d446bdc820406456c94287f245db89d8656c105d5511ec3de.jpeg?aid=rss_feed",
        "itunesInfo": {
          "uuid": "cb8d858a-3ef4-4645-8942-67e55c0927f2",
          "publisherName": "The New York Times",
          "baseArtworkUrlOf": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts115/v4/1c/ac/04/1cac0421-4483-ff09-4f80-19710d9feda4/mza_12421371692158516891.jpeg/640x640bb.png"
        }
      },
      {
        "uuid": "d682a935-ad2d-46ee-a0ac-139198b83bcc",
        "name": "This American Life",
        "itunesId": 201671138,
        "description": "This American Life is a weekly public radio show, heard by 2.2 million people on more than 500 stations. Another 2.5 million people download the weekly podcast. It is hosted by Ira Glass, produced in collaboration with Chicago Public Media, delivered to stations by PRX The Public Radio Exchange, and has won all of the major broadcasting awards.",
        "imageUrl": "https://files.thisamericanlife.org/sites/all/themes/thislife/img/tal-name-1400x1400.png",
        "itunesInfo": {
          "uuid": "d682a935-ad2d-46ee-a0ac-139198b83bcc",
          "publisherName": "This American Life",
          "baseArtworkUrlOf": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts123/v4/4e/b9/bb/4eb9bb9b-ed19-f0b7-7739-1177f1b35207/mza_8452563123961176873.png/640x640bb.png"
        }
      }
    ]
  }
}
```

## Query Input:

For getMultiplePodcastSeries, you can get details on podcasts by passing in an array of uuids. 

```graphql
" An Array of taddy's unique identifier (uuid). Max 25 IDs allowed "
uuids: [ID]
```

## Query Response:

The response you get back is an array of [PodcastSeries](./podcastseries.md).

```graphql
" Taddy's unique identifier (an uuid) "
uuid: ID

" Date when the podcast was published (Epoch time in seconds) "
datePublished: Int

" The name (title) for a podcast "
name: String

" The description for a podcast "
description(
  " (Optional) Option to remove the html tags from the description or leave the description as is (which may include html tags). Default is false (leave description as is)."
  shouldStripHtmlTags: Boolean
): String

" The cover art for a podcast "
imageUrl: String

" itunesId for the podcast. Typed as Float (not Int) to support 64-bit integers "
itunesId: Float

" A hash of all podcast details. It may be useful for you to save this property in your database and compare it to know if any podcast details have updated since the last time you checked "
hash: String

" A hash of all episode details. It may be useful for you to save this property in your database and compare it to know if there are any new or updated episodes since the last time you checked "
childrenHash: String

" A list of episodes for this podcast "
episodes(
  " (Optional) Returns episodes based on SortOrder. Default is LATEST (newest episodes first), another option is OLDEST (oldest episodes first), and another option is SEARCH (pass in the property searchTerm) to filter for episodes by title or description. "
  sortOrder: SortOrder,

  " (Optional) Taddy paginates the results returned. Default is 1, Max value allowed is 1000 "
  page: Int,

  " (Optional) Return up to this number of episodes. Default is 10, Max value allowed is 25 results per page "
  limitPerPage: Int,

  " (Optional) Only to be used when sortOrder is SEARCH. Filters through the title & description of episodes for the searchTerm "
  searchTerm: String,

" (Optional) The option to show episodes that were once on the RSS feed but have now been removed. Default is false (do not include removed episodes) "
  includeRemovedEpisodes: Boolean,
): [PodcastEpisode]

" The number of episodes for this podcast "
totalEpisodesCount(
  " (Optional) Option to include episodes that were once on the RSS feed but have now been removed. Default is false (do not include removed episodes) "
  includeRemovedEpisodes: Boolean
): Int

" A podcast can belong to multiple genres but they are listed in order of importance. Limit of 5 genres per podcast"
genres: [Genre]

" Additional info from itunes on the podcast "
itunesInfo: iTunesInfo

" Podcast type (serial or episodic) "
seriesType: PodcastSeriesType

" Language spoken on the podcast "
language: Language

" Podcast's Content Type (Is the podcast primarily an Audio or Video Podcast) "
contentType: PodcastContentType

" Boolean for if the podcast contain's explicit content "
isExplicitContent: Boolean

" Copyright details for the podcast "
copyright: String

" The podcast's website "
websiteUrl: String

" Url for the podcast's RSS feed "
rssUrl: String

" Name to use for contacting the owner of this podcast feed "
rssOwnerName: String

" Email to use for contacting the owner of this podcast feed "
rssOwnerPublicEmail: String

" Name of the Podcast creator (the podcast creator and the owner of the podcast feed can be different)"
authorName: String

" Details on how often the RSS feed is checked for new episodes "
feedRefreshDetails: FeedRefreshDetails

" Whether the podcast is being automatically transcribed by our API "
taddyTranscribeStatus: PodcastSeriesTranscriptionStatus

" The popularity of the podcast. ex) TOP_200, TOP_1000 etc "
popularityRank: PopularityRank

" People listed on the podcast including thier roles (Hosts, Guests, etc) "
persons: [Person]

" If the podcast is finished / complete "
isCompleted: Boolean

" If the content has violated Taddy's distribution policies for illegal or harmful content it will be blocked from getting any updates "
isBlocked: Boolean
```

### Referenced types in this document:

[PodcastSeries](./podcastseries.md)

[PodcastEpisode](./podcastepisode.md)

[SortOrder](./sort-order.md)

[PodcastSeriesType](./podcast-series-type.md)

[PodcastContentType](./podcast-content-type.md)

[PodcastSeriesTranscriptionStatus](./podcastseries-transcription-status.md)

[PopularityRank](./popularity-rank.md)

[Person](./person.md)

[iTunesInfo](./itunesinfo.md)

[Language](./language.md)

[FeedRefreshDetails](./feed-refresh-details.md)

<aside>
👋 If you are new to using Taddy’s API, **Get Started** with our [**🤖 Intro to Taddy’s API](./intro-to-taddy-podcast-api.md).**

</aside>

More Links:  

[Sign Up →](https://taddy.org/signup/developers)

[Taddy Dashboard →](https://taddy.org/dashboard) 

[Pricing](./pricing.md)

[Terms of Service](https://taddy.org/terms-of-service)

[Developer Policy](https://taddy.org/terms-of-service/developer-policy)