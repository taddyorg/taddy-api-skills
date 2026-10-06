# Get podcast details

Use getPodcastSeries to get details on a specific podcast. 

## Examples:

1. Get details on a podcast with the name “This American Life”:

```graphql
{
  getPodcastSeries(name:"This American Life"){
    uuid
    name
    itunesId
    description
    imageUrl
    totalEpisodesCount
    itunesInfo{
      uuid
      publisherName
      baseArtworkUrlOf(size: 640)
    }
  }
}
```

Example response from this query:

```graphql
{
  "data": {
    "getPodcastSeries": {
      "uuid": "d682a935-ad2d-46ee-a0ac-139198b83bcc",
      "name": "This American Life",
      "itunesId": 201671138,
      "description": "Each week we choose a theme. Then anything can happen. This American Life is true stories that unfold like little movies for radio. Personal stories with funny moments, big feelings, and surprising plot twists. Newsy stories that try to capture what it’s like to be alive right now. It’s the most popular weekly podcast in the world, and winner of the first ever Pulitzer Prize for a radio show or podcast. Hosted by Ira Glass and produced in collaboration with WBEZ Chicago.",
      "imageUrl": "https://thisamericanlife.org/sites/all/themes/thislife/img/tal-logo-3000x3000.png",
      "totalEpisodesCount": 11,
      "itunesInfo": {
        "uuid": "d682a935-ad2d-46ee-a0ac-139198b83bcc",
        "publisherName": "This American Life",
        "baseArtworkUrlOf": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts123/v4/4e/b9/bb/4eb9bb9b-ed19-f0b7-7739-1177f1b35207/mza_8452563123961176873.png/640x640bb.png"
      },
    }
  }
}
```

2. Get details on a podcast by its uuid and return the most recent 10 episodes for the podcast

```graphql
{
  getPodcastSeries(uuid:"d682a935-ad2d-46ee-a0ac-139198b83bcc"){
    uuid
    name
    itunesId
    description
    imageUrl
    totalEpisodesCount
    itunesInfo{
      uuid
      publisherName
      baseArtworkUrlOf(size: 640)
    }
    episodes{
      uuid
      name
      description
      audioUrl
    }
  }
}
```

3. Get the 2nd page of results of the most recent episodes. (Pagination)

```graphql
{
  getPodcastSeries(uuid:"d682a935-ad2d-46ee-a0ac-139198b83bcc"){
    uuid
    name
    itunesId
    description
    imageUrl
    totalEpisodesCount
    itunesInfo{
      uuid
      publisherName
      baseArtworkUrlOf(size: 640)
    }
    episodes(page:2, limitPerPage:10){
      uuid
      name
      description
      audioUrl
    }
  }
}
```

## Query Input:

For getPodcastSeries, you can get details on any podcast by passing in any one of the following:

```graphql
" Taddy's unique identifier (uuid) "
uuid: ID

" A podcast's iTunes ID. Typed as Float (not Int) to support 64-bit integers "
itunesId: Float

" A podcast's RSS Feed "
rssUrl: String

" The name (title) of a podcast. Note: Multiple podcasts can have the exact same name, in that case we always try to return the most popular podcast (based on infomation we have on the podcast popularity)"
name: String
```

## Query Response:

The response you get back is a [PodcastSeries](./podcastseries.md). That means you can return any of the following details:

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

" Extract all links from within the description. " 
descriptionLinks: [String]

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

[Genre](./genre.md)

[PopularityRank](./popularity-rank.md)

[Language](./language.md)

[iTunesInfo](./itunesinfo.md)

[Person](./person.md)

[SortOrder](./sort-order.md)

[PodcastSeriesType](./podcast-series-type.md)

[PodcastContentType](./podcast-content-type.md)

[PodcastSeriesTranscriptionStatus](./podcastseries-transcription-status.md)

[FeedRefreshDetails](./feed-refresh-details.md)

<aside>
👋 If you are new to using Taddy’s API, **Get Started** with our [Intro to Taddy’s API](https://taddy.org/developers/intro-to-taddy-graphql-api)**.**

</aside>

More Links:  

[Sign Up →](https://taddy.org/signup/developers)

[Taddy Dashboard →](https://taddy.org/dashboard) 

[Pricing](./pricing.md)

[Terms of Service](https://taddy.org/terms-of-service)

[Developer Policy](https://taddy.org/terms-of-service/developer-policy)