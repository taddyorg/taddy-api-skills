# Setting Up a Webhook Filter

Webhook filters let you receive webhook events whenever a podcast contains data you care about, rather than receiving an event for every new podcast and episode.

Whenever new podcast data is released, we check to see if it matches any of the regex patterns you’ve set up and only send you the events that match your criteria.

## Use-cases for Webhook Filters

- **Brand monitoring** - Get notified when your company or product is mentioned on a new episode. Set up a filter with regex like `\byour-brand\b`.
- **Sales intelligence** - Track when prospects or competitors appear on podcasts. Combine this with our transcript API to extract context that can be used in lead scoring.
- **Industry research** — Monitor keywords or key executives in your industry. For example, a filter with regex like `\b(FDA approval|clinical trial|drug recall|Phase [1-3]|NDA filing)\b` keeps you on top of latest pharma trends.

## Add a Webhook Filter

Once you've set up a Taddy API [webhook endpoint](./webhooks.md), you can add one or more webhook filters. Click on ‘Add Filter’.

![Add a webhook filter](https://ax0.taddy.org/docs/add-new-webhook-filter.png)

Then, set up your filter by:

1. Selecting a filter type (e.g., `podcastepisode.created`).
2. Adding a regex expression

In the example below I’ve set up a filter to only receive webhook events when a new episode’s description contains “zune” or “iPod”. 

![Webhook filter regex example](https://ax0.taddy.org/docs/webhook-filter-example.png)

On Taddy’s server,  whenever a new episode is released, we check whether it matches any of your filters. If it does, we send the event to your webhook endpoint. Here's an example webhook event for a newly released episode that matches our example filter:

```graphql
// EXAMPLE WEBHOOK event for a PodcastEpisode
{
  "uuid": "5c04591a-ac2e-49a2-acf8-417776ab7bf0",
  "taddyType": "podcastepisode",
  "action": "created",
  "timestamp": 1762077600,
  "data": {
    "uuid": "5c04591a-ac2e-49a2-acf8-417776ab7bf0",
    "hash": "e9741462006248fc1ce94ac501240873e75a644414f41e638ca606664e706218",
    "name": "Version History: Zune",
    "description": "<p>In 2006, Microsoft came for the iPod's throne with an innovative MP3 player called the Zune. It had a bunch of features the iPod didn't: WiFi, music sharing, a bigger screen, a beautiful UI, even an FM radio. And to hear Microsoft describe it, it was even kind of a social network. Nilay Patel and Victoria Song join David Pierce to break down why, despite all that, the Zune never really took off. And why it came in brown.</p>\n<p><strong>If you like the show, ⁠</strong><a href=\"https://link.chtbl.com/versionhistory\">⁠subscribe to the Version History feed⁠</a><strong>⁠ to make sure you get every new episode.</strong></p>\n<p><strong></strong><a href=\"https://www.theverge.com/subscribe\">⁠Subscribe to The Verge⁠</a> for unlimited access to <a href=\"http://theverge.com/\">⁠</a><a href=\"http://theverge.com/\">theverge.com</a><a href=\"http://theverge.com/\">⁠</a>, subscriber-exclusive newsletters, and our <a href=\"https://www.theverge.com/bulletin/795051/verge-podcast-ad-free-set-up-how-to\">⁠ad-free podcast feed⁠</a>.</p>\n<p>We love hearing from you! Email your questions and thoughts to <a href=\"mailto:vergecast@theverge.com\">⁠vergecast@theverge.com⁠</a> or call us at 866-VERGE11.</p><p> </p><p>Learn more about your ad choices. Visit <a href=\"https://podcastchoices.com/adchoices\">podcastchoices.com/adchoices</a></p>",
    "imageUrl": null,
    "datePublished": 1762077600,
    "guid": "b1b3b8a4-97ea-11f0-8c9e-a31de8fbd080",
    "subtitle": null,
    "audioUrl": "https://www.podtrac.com/pts/redirect.mp3/pdst.fm/e/pscrb.fm/rss/p/traffic.megaphone.fm/VMP7431183096.mp3?updated=1762092793",
    "videoUrl": null,
    "fileLength": null,
    "fileType": "audio/mpeg",
    "duration": 4638,
    "episodeType": "FULL",
    "seasonNumber": null,
    "episodeNumber": null,
    "websiteUrl": null,
    "isExplicitContent": false,
    "isRemoved": null,
    "podcastSeries": {
      "uuid": "4bb5a32e-3c92-4669-b8f1-6360ada2cc94",
      "name": "The Vergecast",
      "rssUrl": "https://feeds.megaphone.fm/vergecast",
      "itunesId": 430333725,
      "language": "ENGLISH",
      "genres": ["PODCASTSERIES_TECHNOLOGY", "PODCASTSERIES_NEWS", "PODCASTSERIES_NEWS_TECH"],
      "popularityRank": "TOP_2000"
    }
  },
  matchingFilters: ['12345678-abcdefgh-12345678-abcdefgh']
}
```

**Notes:**

- You can set up multiple filters, when there is a new podcast or episode data, we check to see if it successfully matches regex expressions from ANY of your filters.
- By default, Business accounts come with 100 webhook filters, contact [`danny@taddy.org`](mailto:danny@taddy.org) if you’d like to add more to your account.
- If more than one filter matches for a webhook event, you still receive only one webhook event to your endpoint. The `matchingFilters` array will contain all the filter uuids that successfully matched for this event.
- You can add, update or remove filters via our Dashboard, but you can also do it via GraphQL mutations. See **Programmatically Adding and Removing Filters** section below.

## Regex Examples

| Pattern | Matches |
| --- | --- |
| `tech|developer` | Contains "tech" or “developer” |
| `developer api|dev tools`  | Matching words can contain spaces |
| `\btech\b` | Matching whole word "tech" (won't match "techno" or "biotech") |
| `the.+show` | Use `.+` as a wildcard to match unknown text. This matches "The Daily Show" or "The Late Night Show" |
| `\b(chris )?lattner\b` | Matches for Chris Lattner or just Lattner |
| `\b(chris )?lattner\b` AND `\b(apple|google|tesla|modular|mojo)\b` | You can add multiple conditions. This allows you match for more complex queries like: Chris Lattner AND (Apple or Google or Tesla or Modular or Mojo - places where he has worked). See Example 2 below for more details. |
| `TOP_(200|1000|2000|3000|4000|5000)` | Check if a podcast is a TOP_200 to TOP_5000 podcast |

**Notes:**

- We do case insensitive matching (regex containing iPod vs ipod is equivalent)
- There is a 500 character limit for regex expressions.
- We block regex patterns containing `*` , but not `+` . Use `.+` instead as a wildcard to match unknown text.
- If the property you are matching against returns an array, we will check each item in the array and check if it matches your regex expression. For example, In the zune example above, `podcastSeries.genres` returns the array `["PODCASTSERIES_TECHNOLOGY", "PODCASTSERIES_NEWS", "PODCASTSERIES_NEWS_TECH"]`. If you add an regex expression that matches for `PODCASTSERIES_TECHNOLOGY` we will successfully find this match.

## AllowList & BlockList

To every filter, you can also add a list of podcast uuids that the content has to be from (AllowList) or a list of podcast uuids that are excluded (BlockList). 

![Webhook filter allowlist and blocklist example](https://ax0.taddy.org/docs/webhook-filter-allowlist.png)

**Notes:**

- A useful use case for AllowLists is if you only need to keep track of a very small subset of the 4 million podcasts in Taddy API’s index.
- A useful use of BlockLists is if you have setup a filter and consistently see matches from a specific podcast that you want to exclude from receiving any future webhooks events.
- We match the exact value you provide in these lists against a podcast’s uuid, rssUrl or itunesId exact value and check if its a match.

## Examples

**Example 1:** Notify me when an episode's description contains keywords I care about and the podcast is in a genre I care about.

- `description` MATCHES `\b(radio|ipod|sony walkman|zune)\b`
- `podcastSeries.genres` MATCHES `PODCASTSERIES_TECHNOLOGY`

![Alternate webhook filter example](https://ax0.taddy.org/docs/webhook-filter-example-4.png)

**Example 2:** Notify me when a new interview of Chris Lattner is released. I want to make sure it is the Chris Lattner in tech, so I'm also going to check if the episode also has (Apple, Google, Tesla, Modular, Mojo - the companies he has worked in) in its description

- `name` MATCHES `\b(chris )?lattner\b`
- `description` MATCHES `\b(chris )?lattner\b`
- `description` MATCHES `\b(apple|google|tesla|modular|mojo)\b`

**Example 3:** Notify me when a new episode is released from the most popular podcasts.

- `podcastSeries.popularityRank` MATCHES `TOP_(200|1000|2000|3000|4000|5000)`

**Example 4:** Notify me when a new episode is released in the any of the Business sub-genres (`PODCASTSERIES_BUSINESS`, `PODCASTSERIES_BUSINESS_CAREERS`, `PODCASTSERIES_BUSINESS_ENTREPRENEURSHIP`, `PODCASTSERIES_BUSINESS_INVESTING`, `PODCASTSERIES_BUSINESS_MANAGEMENT`, `PODCASTSERIES_BUSINESS_MARKETING`, `PODCASTSERIES_BUSINESS_NON_PROFIT`) 

- `podcastSeries.genre` MATCHES `PODCASTSERIES_BUSINESS`

**Example 5:** Notify me when a new episode is released where the episode’s duration is greater than 1 hour (3600 seconds):.

- `duration` MATCHES `^(360[1-9]|36[1-9][0-9]|3[7-9][0-9]{2}|[4-9][0-9]{3}|[1-9][0-9]{4,})$`

```
**Regex Breakdown:**
- 360[1-9] → 3601-3609
- 36[1-9][0-9] → 3610-3699
- 3[7-9][0-9]{2} → 3700-3999
- [4-9][0-9]{3} → 4000-9999
- [1-9][0-9]{4,} → 10000+
```

## Mock Webhook Event

Want to test your regex expressions to make sure your webhook filters work as expected? Use the `mockWebhookEvent`mutation.

If you know a specific podcast or episode that should match your filters, you can use this mutation to simulate the webhook event. Taddy will process it against all your filters and, if there's a match, send it to your webhook endpoint, just like a real event. This lets you verify your filters are working correctly without waiting for new content to be released.

```graphql
mutation MockWebhookEvent($webhookId: ID!, $taddyType: String!, $action: WebhookEventActionType!, $contentUuid: String!) {
  mockWebhookEvent(webhookId: $webhookId, contentUuid: $contentUuid, taddyType: $taddyType, action: $action)
}

# input for mockWebhookEvent
{
  "webhookId": "your-webhook-id",
  "taddyType": "podcastseries", # podcastseries, or podcastepisode
  "action": "created", # created, updated, or deleted
  "contentUuid": "content-uuid"
}
```

Try this out at: [https://api.taddy.org](https://api.taddy.org) (our GraphQL Playground)

## Programmatically Adding and Removing Filters

You can add, update or delete webhook filters via GraphQL instead of our Dashboard. A use case for using this would be if you would like to create filters on behalf of your users. 

```graphql
mutation AddWebhookFilter($webhookId: ID!, $filter: WebhookFilterInput!) {
  addWebhookFilter(webhookId: $webhookId, filter: $filter) {
    id
  }
}

mutation UpdateWebhookFilter($webhookId: ID!, $filterUuid: ID!, $filter: WebhookFilterInput!) {
  updateWebhookFilter(webhookId: $webhookId, filterUuid: $filterUuid, filter: $filter) {
    id
  }
}

mutation DeleteWebhookFilter($webhookId: ID!, $filterUuid: ID!) {
  deleteWebhookFilter(webhookId: $webhookId, filterUuid: $filterUuid) {
    id
  }
}
```

Try this out at: [https://api.taddy.org](https://api.taddy.org) (our GraphQL Playground)

You can also add or remove items to the allowlist or blocklist programmatically.

```graphql
mutation AddUuidToWebhookFilterAllowlist($webhookId: ID!, $filterUuid: ID!, $contentUuid: String!) {
  addUuidToWebhookFilterAllowlist(webhookId: $webhookId, filterUuid: $filterUuid, contentUuid: $contentUuid) {
    uuid
  }
}

mutation DeleteUuidFromWebhookFilterAllowlist($webhookId: ID!, $filterUuid: ID!, $contentUuid: String!) {
  deleteUuidFromWebhookFilterAllowlist(webhookId: $webhookId, filterUuid: $filterUuid, contentUuid: $contentUuid) {
    uuid
  }
}

mutation AddUuidToWebhookFilterBlocklist($webhookId: ID!, $filterUuid: ID!, $contentUuid: String!) {
  addUuidToWebhookFilterBlocklist(webhookId: $webhookId, filterUuid: $filterUuid, contentUuid: $contentUuid) {
    uuid
  }
}

mutation DeleteUuidFromWebhookFilterBlocklist($webhookId: ID!, $filterUuid: ID!, $contentUuid: String!) {
  deleteUuidFromWebhookFilterBlocklist(webhookId: $webhookId, filterUuid: $filterUuid, contentUuid: $contentUuid) {
    uuid
  }
}
```

Contact [`danny@taddy.org`](mailto:danny@taddy.org) if you’d like to add more webhook filters to your account (every Business Account comes with 100 webhook filters).

Back to:

[Webhooks](./webhooks.md)

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