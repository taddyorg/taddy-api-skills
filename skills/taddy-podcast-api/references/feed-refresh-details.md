# FeedRefreshDetails

Options for how often Taddy checks a podcast feed for updates.

```graphql
enum FeedRefreshPriority {
  WEBSUB
  HIGH
  MEDIUM
  REGULAR
  LOW
  INACTIVE
  NEVER
}
```

`WEBSUB` - Feed is checked immediately for updates (within 5 mins, usually much sooner). Taddy gets notified of a change to the podcast feed via a [WebSub](https://en.wikipedia.org/wiki/WebSub) notification.

`HIGH` - Feed is checked every 2 hours. This is used for very popular podcasts that do not have WebSub support

`MEDIUM` -  Feed is checked every 6 hours. This is used for popular podcasts that do not have WebSub support

`REGULAR` - Feed is checked every day. This is the most common queue for podcasts that do not support WebSub.

`INACTIVE` - Feed is checked once a week.  This is used for podcast feeds that have not been updated in over a year.

`LOW` - Feed is checked once a month. This is used for podcast feeds that throw an error.

`NEVER` - Feed is no longer checked for updates. This is only used in the rare circumstance a podcast violates our [distribution policy](https://taddy.org/terms-of-service/distribution-policy).

If a feed has been set as LOW, INACTIVE, or NEVER priority, you can check the reason why: 

```graphql
enum FeedRefreshPriorityReason {
  INACTIVE_FOR_OVER_1_YEAR
  DUPLICATE_FEED
  ERROR_PARSING_FEED
  FEED_URL_NOT_WORKING
  PRIVATE_PODCAST_FEED
  VIOLATES_TADDY_DISTRIBUTION_POLICY 
}
```

`INACTIVE_FOR_OVER_1_YEAR` - Feed has not had any updates in the last 12 months

`DUPLICATE_FEED` - There is another feed in our database that links to the same content

`ERROR_PARSING_FEED` - Error parsing document when trying to check the feed for new updates

`FEED_URL_NOT_WORKING` - Error when trying to load the feed url (404 error, etc)

`PRIVATE_PODCAST_FEED` - This is a private Patreon or Supercast feed that is not meant for the public

`VIOLATES_TADDY_DISTRIBUTION_POLICY` - The feed has been reviewed by a Taddy staff member and is in violation of [our distribution policy](https://taddy.org/terms-of-service/distribution-policy). We may remove some details but still keep a record of the feed so that it cannot be added back and because we want to be transparent about what we have removed from our API.

## How to check the FeedRefreshPriority for a podcast

If you would like to know how often a [PodcastSeries](./podcastseries.md) is being checked for updates, check its `feedRefreshDetails` property.

```graphql
type FeedRefreshDetails {
  " Taddy's unique identifier "
  uuid: ID

  " How often a feed is refreshed "
  priority: FeedRefreshPriority

  " The reason why feed has a LOW, INACTIVE, or NEVER priority "
  priorityReason: FeedRefreshPriorityReason

  " Date when the feed was refreshed last (Epoch time in seconds) "
  dateLastRefreshed: Int

  " Websub Details (if available)"
  websubDetails: WebsubDetails
}
```

Details for the WebSub hub that notifies Taddy of any changes for a podcast. (Only some podcasts have websub enabled and if it does not WebsubDetails will return null)

```graphql
" Websub Details "
type WebsubDetails {
  " Taddy's unique identifier "
  uuid: ID

  " The feed url for the websub "
  topicUrl: String

  " The url for the hub where you get the websub notification "
  websubHubUrl: String

  " If the websub notification is currently active "
  isVerified: Boolean
}
```