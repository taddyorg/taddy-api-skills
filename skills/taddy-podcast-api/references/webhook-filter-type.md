# WebhookFilterInput, WebhookFilter & Webhook Types

You can [add, update or remove a webhook filter](./webhook-filters.md) programatically. When you do so you pass in the webhookId and a WebhookFilterInput, and the filters come back as WebhookFilter.

```graphql
" Input for creating/updating a filter "
input WebhookFilterInput {
  " The event type this filter applies to, in the form taddyType.action (e.g. podcastepisode.created). Must be an event type the webhook is subscribed to "
  eventType: String!

  " (Optional) A label for this filter. Not used for matching, so you can store your own key in it (e.g. watchlist:AAPL:name) "
  description: String

  " (Optional) Clause 1: a field from the event payload (e.g. name, description, podcastSeries.genres). Valid fields depend on the taddyType in eventType. Must be set together with value1 "
  field1: String

  " (Optional) Clause 1: the regex that field1 must match. Case-insensitive, matched anywhere in the value, max 500 characters; * is not allowed (use .+ or a bounded repeat). All clauses in a filter must match (AND); any filter may match (OR) "
  value1: String

  " (Optional) Clause 2, see field1 "
  field2: String

  " (Optional) Clause 2, see value1 "
  value2: String

  " (Optional) Clause 3, see field1 "
  field3: String

  " (Optional) Clause 3, see value1 "
  value3: String

  " (Optional) Clause 4, see field1 "
  field4: String

  " (Optional) Clause 4, see value1 "
  value4: String

  " (Optional) Clause 5, see field1 "
  field5: String

  " (Optional) Clause 5, see value1 "
  value5: String

  " (Optional) AllowList: only content from these podcasts matches. Each entry is a podcast uuid, rssUrl or itunesId "
  includedUuids: [String]

  " (Optional) BlockList: content from these podcasts never matches. Each entry is a podcast uuid, rssUrl or itunesId "
  excludedUuids: [String]
}

" A filter for a webhook (one row = one event type + clauses) "
type WebhookFilter {
  " The unique identifier for the filter "
  uuid: ID!

  " The label you gave the filter "
  description: String

  " The webhook this filter belongs to "
  webhookId: ID

  " The event type this filter applies to (e.g. podcastepisode.created) "
  eventType: String!

  " Clause 1 as one string: 'field1' MATCHES 'value1', with the regex exactly as stored. Null when the clause is not set. To compare with your own field and regex, split on the first ' MATCHES ' and remove the outer single quotes "
  clause1: String

  " Clause 2, same format as clause1 "
  clause2: String

  " Clause 3, same format as clause1 "
  clause3: String

  " Clause 4, same format as clause1 "
  clause4: String

  " Clause 5, same format as clause1 "
  clause5: String

  " True if the filter has an AllowList "
  hasIncludedUuids: Boolean

  " True if the filter has a BlockList "
  hasExcludedUuids: Boolean

  " AllowList entries "
  includedUuids: [String]

  " BlockList entries "
  excludedUuids: [String]
}

" Webhook Details "
type Webhook {
  " The unique identifier for the webhook "
  id: ID!

  " Date created (Epoch time in seconds) "
  createdAt: Int

  " User that created the webhook "
  user: User

  " URL for the webhook "
  endpointUrl: String

  " Secret for the webhook "
  webhookSecret: String

  "If the webhook is verified or not"
  isVerified: Boolean

  "If the webhook is active or not"
  isActive: Boolean

  "Events that get triggered for the webhook"
  events: [String]

  " Filters for this webhook "
  filters: [WebhookFilter]
}
```