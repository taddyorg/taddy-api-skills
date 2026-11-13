# Support Tickets

You can programatically create a support ticket when:
- Your users report a problem with a podcast, like a feed that stopped updating, a broken audio or image link, or a missing podcast.
- You want to change how Taddy handles something, like refreshing a feed more often.
- You have feedback or a feature request for the Taddy API.

Taddy notifies you via a webhook (if provided) when the ticket is resolved, so you don't have to follow up over email.

## Create a ticket

```graphql
mutation {
  createSupportTicket(
    comment: "Latest episode's audio url returns 404"
    seriesUuid: "cb8d858a-3ef4-4645-8942-67e55c0927f2"
    callbackUrl: "https://example.com/webhooks/taddy-support"
  ) {
    uuid
    status
    createdAt
  }
}
```

| Argument | Required | Notes |
| --- | --- | --- |
| `comment` | yes | What is wrong, max 1000 characters. Say what you expected and what happened. For a missing podcast, include its RSS url. |
| `seriesUuid` | no | The podcast the ticket is about. Leave it out for a podcast that is not on Taddy yet. |
| `callbackUrl` | no | A public `https` url Taddy POSTs to when the ticket is resolved. |

## When it is resolved

If you passed a `callbackUrl`, Taddy sends a POST to that endpoint when the issue is resolved:

```json
{
  "uuid": "1916fc5e-59f0-4c1d-bbba-d5ecce697360",
  "status": "RESOLVED",
  "seriesUuid": "cb8d858a-3ef4-4645-8942-67e55c0927f2",
  "resolutionNote": "Re-crawled the feed; the enclosure urls are fixed",
  "resolvedAt": 1794522454
}
```

If you did not pass in a `callbackUrl`, we will email you a response.

## List your tickets

```graphql
{
  getMySupportTickets(status: OPEN, page: 1, limitPerPage: 10) {
    userId
    supportTickets {
      uuid
      status
      comment
      seriesUuid
      createdAt
      resolvedAt
      resolutionNote
    }
  }
}
```

Newest first. `status` is optional (`OPEN` or `RESOLVED`), `page` is 1-1000 (default 1), `limitPerPage` is 1-25 (default 10). Dates are epoch seconds. Use this when you skipped `callbackUrl`, or to show your own users the status of what they reported.