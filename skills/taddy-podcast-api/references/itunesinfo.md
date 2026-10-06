# iTunesInfo

GraphQL Type for additional information from iTunes on a particular podcast. (A small number of podcasts on Taddy API are not on Apple Podcasts and those will not return null for iTunesInfo details)

```graphql
" PodcastSeries unique identifier linked to this iTunesInfo "
uuid: ID

" A different hash signals that itunes information has changed since the last hash "
hash: String

" Subtitle given in Apple Podcasts "
subtitle: String

" Summary given in Apple Podcasts "
summary: String

" Base Url to the podcast's cover art from iTunes. NOTE: To get a working image, you need to pass in a size at the end of the url in the format {baseArtworkUrl}{size}x{size}bb.png ex {baseArtworkUrl}640x640bb.png "
baseArtworkUrl: String

" Helper Url to the podcast's cover art from iTunes. Pass in an interger for the size of the image you want "
baseArtworkUrlOf(
  size: Int
): String

" Publisher Id from iTunes. Typed as Float (not Int) to support 64-bit integers "
publisherId: Float

" Publisher name from iTunes "
publisherName: String

" Country where the podcast is made "
country: Country

" PodcastSeries linked to this iTunesInfo "
podcastSeries: PodcastSeries
```