# Webhooks

Taddy API is constantly being updated with the latest podcasts and episodes. If you use our webhooks feature, instead of you having to manually check Taddy API for new podcasts or episodes, we send you the details on new podcasts and episodes to an endpoint on your server.

Moreover, you have the ability to [add webhook filters](./webhook-filters.md), so instead of getting a webhook event for every new podcast or episode, you can use filters to add a regex expression and only get notified for the specific content you care about.

## Use-cases for Webhooks

- Do you want to monitor your brand? Set up a filter to get notified whenever your brand or website are mentioned.
- Are you doing sales intelligence or lead nurturing? Set up a filter to get notified when a potential lead appears on an episode, get the transcript of the episode and use this data for insights or lead scoring.
- Are you doing competitor or industry research? Set up a filter to get notified when an industry keyword or competitor’s key executive is mentioned, get the transcript of the episode and use this data for insights.
- Are you building a podcast player and want to send push notifications for new episodes? Set up a webhook without any filters to get notified whenever a new episode is released, then on your server, match against your users' subscriptions and send them a push notification.

## Setting Up a Webhook

- Open up the [**Taddy Dashboard**](https://taddy.org/dashboard), you will see a “Setup a New Webhook” button.

![Add a new Webhook](https://ax0.taddy.org/docs/add-new-webbook.png)

Then, make sure you:

1. Enter in the endpoint where you want to receive the notifications (usually on your own server, but you can also point this to a Zapier, n8n, Make or Gumloop workflow)
2. Select which webhook events you would like to receive.
3. Optionally, you can add one or more [webhook filters](./webhook-filters.md).

**Note:** 

- You must be on the Business plan to add a webhook to your account.
- Receiving a webhook event does not count against your monthly API limits 🥳.
- You can use [webhook.site](https://webhook.site/) to easily check what a webhook event sent from Taddy API looks like. Just paste in the unique URL from the website as your webhook endpoint to start receiving webhook events.
- Alternatively, here is some [example code](https://gist.github.com/dmathewwws/ae9045ef66b63c8ab6aedc75759afc71) to set up your webhook endpoint.
- The endpoint url you enter into the Taddy API Dashboard needs to be one publicly accessible over the internet. (For example, 127.0.0.1 and localhost URLs will not work, since Taddy servers will not be able to contact your local computer). If you’d like to test receiving these notifications locally on your computer, [Cloudflare Quick Tunnel](https://try.cloudflare.com) or [Ngrok](https://ngrok.com) provide useful & free options to do so. (They provides you a public url that is mapped to your localhost).
- Your endpoint url needs to be a  `POST` endpoint
- On the Taddy API Dashboard, after you set up a webhook we will display your webhook’s secret. This is an optional but recommended security feature. We include this secret in the `X-TADDY-WEBHOOK-SECRET` header with every webhook event sent to your endpoint. Keep this secret confidential, your endpoint URL may be publicly accessible, but by verifying that the `X-TADDY-WEBHOOK-SECRET` header matches your secret you can be confident that any data you receive on your endpoint is from us and can be trusted.
- By default, every business account has access to one webhook endpoint. Reach out to `danny@taddy.org` if would like to increase your limits.

## Webhook Events

You can receive webhook events for new or updated `PodcastSeries`, `PodcastEpisodes`, or `iTunesInfo`. 

Each webhook event is made up of:  `uuid`, `taddyType`, `action`, `timestamp`, `data` (and `matchingFilters` if you have setup a filter).

### PodcastEpisode

| **Event** | **Description** |
| --- | --- |
| `podcastepisode.created` | Get a notification when a new podcast episode has been released |
| `podcastepisode.updated` | Get a notification when a podcast episode’s details have been updated (e.g. title, description, audioUrl, etc.).  |
| `podcastepisode.deleted` | Get a notification when a podcast episode has been removed from Taddy API. |

```graphql
// EXAMPLE WEBHOOK event for a PodcastEpisode
{
  uuid: 'a2b41ecd-565c-4f29-8cf9-ac737bcc8d99',
  taddyType: 'podcastepisode',
  action: 'updated',
  timestamp: 1673984261,
  data: {
    uuid: 'a2b41ecd-565c-4f29-8cf9-ac737bcc8d99',
    hash: '8130da98420b6ea1bcafd9a7e411625bf0437e93cd2e44b0a2291430e7cd940c',
    name: 'Consider the Burying Beetle. (Or Else.)',
    description: '<p>The current level of biodiversity loss is extraordinary in human history: The global rate of species extinction is at least tens to hundreds of times higher than the average over the past 10 million years. </p><p>At the end of 2022, countries around the world came together in Montreal for an agreement akin to the Paris climate accord to tackle the biodiversity crisis. Here’s more on the effort and how it seeks to confront the problem.</p><p>Guest: <a href="https://www.nytimes.com/by/catrin-einhorn">Catrin Einhorn</a>, who reports on biodiversity and climate for The New York Times.</p><p>Background reading: </p><ul><li>Last year, roughly 190 nations, aiming to halt a dangerous decline in biodiversity,<a href="https://www.nytimes.com/2022/12/19/climate/biodiversity-cop15-montreal-30x30.html"> agreed to preserve 30 percent of the planet’s land and seas</a>. </li></ul><p>For more information on today’s episode, visit <a href="http://nytimes.com/thedaily?smid=pc-thedaily">nytimes.com/thedaily</a>. Transcripts of each episode will be made available by the next workday. </p>\n',
    imageUrl: null,
    datePublished: 1673001900,
    guid: '848d3475-dc4d-4c53-b97c-e69f05bad846',
    subtitle: 'The current level of biodiversity loss is extraordinary in human history: The global rate of species extinction is at least tens to hundreds of times higher than the average over the past 10 million years. \n' +
      '\n' +
      'At the end of 2022, countries around the world came together in Montreal for an agreement akin to the Paris climate accord to tackle the biodiversity crisis. Here’s more on the effort and how it seeks to confront the problem.\n' +
      '\n' +
      'Guest: Catrin Einhorn, who reports on biodiversity and climate for The New York Times.',
    audioUrl: 'https://dts.podtrac.com/redirect.mp3/chrt.fm/track/8DB4DB/pdst.fm/e/nyt.simplecastaudio.com/03d8b493-87fc-4bd1-931f-8a8e9b945d8a/episodes/b8f7e904-bf5d-4c60-b3d7-de67dfc271fc/audio/128/default.mp3?aid=rss_feed&awCollectionId=03d8b493-87fc-4bd1-931f-8a8e9b945d8a&awEpisodeId=b8f7e904-bf5d-4c60-b3d7-de67dfc271fc&feed=54nAGcIl',
    videoUrl: null,
    fileLength: 24695702,
    fileType: 'audio/mpeg',
    duration: 1543,
    episodeType: 'FULL',
    seasonNumber: null,
    episodeNumber: null,
    websiteUrl: 'https://www.nytimes.com/the-daily',
    isExplicitContent: false,
    isRemoved: null,
    podcastSeries: {
      uuid: 'cb8d858a-3ef4-4645-8942-67e55c0927f2',
      name: 'The Daily',
      rssUrl: 'https://feeds.simplecast.com/54nAGcIl',
      itunesId: 1200361736,
      language: 'ENGLISH',
      genres: [ 'PODCASTSERIES_NEWS_DAILY_NEWS', 'PODCASTSERIES_NEWS' ],
      popularityRank: 'TOP_200'
    }
  }
}
```

**Note:** When an episode has been removed by a podcast we send a `podcastepisode.updated` event with `isRemoved` set to true (instead of sending a `podcastepisode.deleted` event). 

This is an opinionated decision made by us, but the advantage is that the uuid for every episode is persistent ie) you can query for an episode by its uuid and get back results even if it has been removed.

`podcastepisode.deleted` is reserved for the extreme scenario where an episode contains unlawful or harmful content, is tagged with [`VIOLATES_TADDY_DISTRIBUTION_POLICY`](./feed-refresh-details.md) and is deleted from Taddy API.

### PodcastSeries

| **Event** | **Description** |
| --- | --- |
| `podcastseries.created` | Get a notification when a new podcast series has been added to Taddy |
| `podcastseries.updated` | Get a notification when any podcast series details have been updated (e.g. title, description, etc.) |
| `podcastseries.deleted` | Get a notification when a podcast series has been removed from Taddy API. |
| `podcastseries.feed_updated` | Get a notification when the podcast's RSS feed has been updated (e.g. new episodes, updated episodes, updated podcast details, etc.). This is useful if you're parsing the podcast RSS feed yourself and want to be alerted to parse it again. Most users won't need this event. |

```graphql
// EXAMPLE WEBHOOK event for a PodcastSeries
{
  uuid: 'cb8d858a-3ef4-4645-8942-67e55c0927f2',
  taddyType: 'podcastseries',
  action: 'updated',
  timestamp: 1673984316,
  data: {
    uuid: 'cb8d858a-3ef4-4645-8942-67e55c0927f2',
    hash: 'b8f97d07ce3a9916aeba1feda9db610b58aee8d62a2dfa0495a0b1893e857d91',
    name: 'The Daily',
    description: 'This is what the news should sound like. The biggest stories of our time, told by the best journalists in the world. Hosted by Michael Barbaro and Sabrina Tavernise. Twenty minutes a day, five days a week, ready by 6 a.m.',
    imageUrl: 'https://image.simplecastcdn.com/images/03d8b493-87fc-4bd1-931f-8a8e9b945d8a/2cce5659-f647-4366-b318-46e4b67afcfa/3000x3000/c81936f538106550b804e7e4fe2c236319bab7fba37941a6e8f7e5c3d3048b88fc5b2182fb790f7d446bdc820406456c94287f245db89d8656c105d5511ec3de.jpeg?aid=rss_feed',
    datePublished: 1484687987,
    language: 'ENGLISH',
    seriesType: 'EPISODIC',
    contentType: 'AUDIO',
    isExplicitContent: false,
    copyright: '© 2020-2021 THE NEW YORK TIMES COMPANY; The New York Times encourages the use of RSS feeds for personal use in a news reader or as part of a non-commercial blog, subject to your agreement to our Terms of Service.',
    websiteUrl: 'https://www.nytimes.com/the-daily',
    rssUrl: 'https://feeds.simplecast.com/54nAGcIl',
    rssOwnerName: 'The New York Times',
    rssOwnerPublicEmail: 'thedaily@nytimes.com',
    authorName: 'The New York Times',
    isCompleted: false,
    isBlocked: null,
    itunesId: 1200361736,
    genres: [ 'PODCASTSERIES_NEWS_DAILY_NEWS', 'PODCASTSERIES_NEWS' ],
    childrenHash: '95ef1fee188406c415e32915f85855eab3cf49e0f9052785e42ef368792333db',
    popularityRank: 'TOP_200',
    itunesInfo: {
      uuid: 'cb8d858a-3ef4-4645-8942-67e55c0927f2',
      publisherId: 121664449,
      publisherName: 'The New York Times',
      baseArtworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts115/v4/1c/ac/04/1cac0421-4483-ff09-4f80-19710d9feda4/mza_12421371692158516891.jpeg/',
      baseArtworkUrlOf: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts115/v4/1c/ac/04/1cac0421-4483-ff09-4f80-19710d9feda4/mza_12421371692158516891.jpeg/640x640bb.png'
    }
  }
}
```

### iTunesInfo

| **Event** | **Description** |
| --- | --- |
| `itunesinfo.created` | Get a notification when itunes information for a podcast series has been added to Taddy (e.g. itunes artwork etc.) This is information from iTunes and not found on the podcast's RSS feed |
| `itunesinfo.updated` | Get a notification when itunes information for a podcast series has been updated (e.g. itunes artwork etc.) This is information from iTunes and not found on the podcast's RSS feed |
| `itunesinfo.deleted` | Get a notification when itunes information for a podcast series has been removed from Taddy, usually because it has been removed from iTunes |

```graphql
// EXAMPLE WEBHOOK event for iTunesInfo
{
  uuid: 'cb8d858a-3ef4-4645-8942-67e55c0927f2',
  taddyType: 'itunesinfo',
  action: 'updated',
  timestamp: 1673984345,
  data: {
    uuid: 'cb8d858a-3ef4-4645-8942-67e55c0927f2',
    hash: '2c022ad3c4482664cdecbcb05e87313e917aff2b697f1f674b69bb6514f55ed6',
    subtitle: null,
    summary: 'This is what the news should sound like. The biggest stories of our time, told by the best journalists in the world. Hosted by Michael Barbaro and Sabrina Tavernise. Twenty minutes a day, five days a week, ready by 6 a.m.',
    baseArtworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts115/v4/1c/ac/04/1cac0421-4483-ff09-4f80-19710d9feda4/mza_12421371692158516891.jpeg/',
    publisherId: 121664449,
    publisherName: 'The New York Times',
    country: 'UNITED_STATES_OF_AMERICA',
    podcastSeries: {
      uuid: 'cb8d858a-3ef4-4645-8942-67e55c0927f2',
      name: 'The Daily',
      rssUrl: 'https://feeds.simplecast.com/54nAGcIl',
      itunesId: 1200361736,
      language: 'ENGLISH',
      genres: [ 'PODCASTSERIES_NEWS_DAILY_NEWS', 'PODCASTSERIES_NEWS' ],
      popularityRank: 'TOP_200'
    }
  }
}
```

## Setting Up Webhook Filters

Instead of receiving a webhook event for every new podcast and episode, you might just want to receive a webhook event for podcasts or episodes that are relevant to your business. 

If that is the case, you can add [one or more webhook filters](./webhook-filters.md). When you set up a webhook filter, we filter webhook events on our server based on regex you set and only send you the webhook events that match your criteria. 

For examples, here is a screenshot of me setting up a filter to receive a notification whenever a new episode is released that has “podcast api” in the description.

![Webhook filter example](https://ax0.taddy.org/docs/webhook-filter-example-1.png)

## **Replay Failed Webhook Events**

Behind the scenes, we keep track of all webhook events that failed to successfully be received by your endpoint and store them for 14 days. 

If you want to replay those failed webhook events, use [replayFailedWebhookEvents](./replay-webhook-events.md).

## Recommended Architecture for Webhooks

Taddy API adds ~1k new podcasts and ~50k new episodes daily. Whenever we add or update podcast data in our own database, we also send this data to you via a webhook event. To handle this volume of data being sent to your server, we recommend this type of architecture:

![Recommended Architecture for receiving Taddy API webhooks](https://ax0.taddy.org/docs/webhook-architecture-2.png)

**Key Points from image above:** 

- Taddy API is continuously checking 4 million podcast feeds for new and updated podcast data. Whenever we update our database with new data, we also send it to you via your Webhook endpoint (1)
- We recommend using a lambda function (or equivalent) for your Webhook endpoint. The function receives new podcast data from Taddy API and adds it to a queue to be processed at a later time. (2)
- We recommend having a worker (or workers) process messages in your queue and add this data into your database. Set up a Dead-letter Queue for failed message processing, which can be re-processed at a later time (3)

Sample Lambda code: [https://gist.github.com/dmathewwws/d3d56529313cb2959bc2a7ec62792a5a](https://gist.github.com/dmathewwws/d3d56529313cb2959bc2a7ec62792a5a)

**Note:** We have showcased AWS architecture in the above example, but you can accomplish this same workflow using Cloudflare Workers + Queues or by implementing this on your server - just make sure it can handle the volume of data being sent. If you have any questions, please contact **`danny@taddy.org`**

More Links:  

[Setting Up a Webhook Filter](./webhook-filters.md)

[Replaying failed webhook events](./replay-webhook-events.md)

[Taddy Dashboard →](https://taddy.org/dashboard) 

[Pricing](./pricing.md)

[Terms of Service](https://taddy.org/terms-of-service)

[Developer Policy](https://taddy.org/terms-of-service/developer-policy)

[Sign Up →](https://taddy.org/signup/developers)

GraphQL Types mentioned:  

[PodcastSeries](./podcastseries.md)

[PodcastEpisode](./podcastepisode.md)

[Genre](./genre.md)

[PopularityRank](./popularity-rank.md)

[iTunesInfo](./itunesinfo.md)

[Language](./language.md)

[PodcastSeriesType](./podcast-series-type.md)

[PodcastEpisodeType](./podcast-episode-type.md)

[PodcastContentType](./podcast-content-type.md)

[FeedRefreshDetails](./feed-refresh-details.md)