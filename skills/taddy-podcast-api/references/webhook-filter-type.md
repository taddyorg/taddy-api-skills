# WebhookFilterInput & Webhook Type

You can [add, update or remove a webhook filter](./webhook-filters.md) programatically. When do you do so you have to pass in the webhookId and WebhookFilterInput. 

```graphql
" Input for creating/updating a filter "
input WebhookFilterInput {
  eventType: String!
  description: String
  field1: String
  value1: String
  field2: String
  value2: String
  field3: String
  value3: String
  field4: String
  value4: String
  field5: String
  value5: String
  includedUuids: [String]
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