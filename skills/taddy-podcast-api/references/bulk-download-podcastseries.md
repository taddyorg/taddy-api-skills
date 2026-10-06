# Bulk download all 4 million podcasts and 200 million episodes

The vast majority of Taddy API users signup for an API key and use the Free, Pro or Business plan. It is the quick and straightforward way to get podcast data into your application. 

However, there are some use cases where you might want to store all podcast and episode data in your own database. If this is your use case, Taddy makes it easy to:

- **Export all podcast data from Taddy API** - A one-time export of all podcast and episode data from Taddy’s database.
- **Keep your database in sync with our database** – Get a [webhook notification](./webhooks.md) for any new or updated podcast or episode. Taddy API is continuously checking RSS feed, when we see new or updated data we update our API and push any those updates to you via a webhook endpoint on your server.

When used together, the database export and webhooks allow you to keep your own up-to-date database of all podcasts and episodes. 

### **Costs** to you:

**Taddy API Costs:** One-time fee for data export ($3250, see more details below), plus a Taddy API Business plan ($150/month) is required to receive webhook events for new or updated episodes.

**Infrastructure Costs:** Yes. (~$200 to $400 per month to host your own infrastructure). 

**Additional Setup + Maintenance Costs:** Yes. (You need to maintain and host your own database/infrastructure).

### **Why Choose This Option?**

This option is ideal if you want complete control over your podcast data. If you are unsure, start with Taddy’s API for simplicity, and transition to full data control if / when needed. 

## **Export data from Taddy API**:

Taddy offers a **complete export** of our podcast data, including an export of these tables:

- podcast table (4 million podcasts)
- episodes table (200 million episodes)
- genres table (a podcast can belong to up to 5 genres)
- itunes_info table (additional information on the podcast from Apple iTunes)

📦 **Full Dataset Size:** ~80 GB

💰 **One-time Fee:** **`$3,250 USD`**

📎 [Download a Sample dataset](https://github.com/taddyorg/podcast-dataset-export) of 10,000 podcasts and episodes. 

If you have any further inquiries or want to purchase the full dataset, please contact **`danny@taddy.org`**

## Monthly Snapshots

If you have purchased the above one-time export and you are on the Taddy Business plan, you get access to monthly snapshots of podcast data from our database on the **1st of every month**.

**To download info on what snapshot files are available:** 

Download the JSON file at https://ax3.taddy.org/db-snapshot/contents.json. You must pass in your Taddy API `X-USER-ID` and `X-API-KEY` in the headers. 

**Example:**

```graphql
curl -H "X-USER-ID: 1" -H "X-API-KEY: xyz..." \                                                                                           
https://ax3.taddy.org/db-snapshot/contents.json > ~/Downloads/contents.json
```

The JSON file lists available tables, when they were last updated, and the corresponding file names. 

**Example:**

```graphql
[
  {
    "tableName": "podcastseries",
    "updatedAt": "2025-05-01T04:00:40.000Z",
    "fileNames": [
      "podcastseries.zip"
    ]
  },
  {
    "tableName": "podcastepisode",
    "updatedAt": "2025-05-01T06:18:16.000Z",
    "fileNames": [
      "podcastepisode-part1.zip",
      "podcastepisode-part2.zip",
      "podcastepisode-part3.zip"
    ]
  },
  {
    "tableName": "genres",
    "updatedAt": "2025-05-01T03:56:52.000Z",
    "fileNames": [
      "genres.zip"
    ]
  },
  {
    "tableName": "itunes_info",
    "updatedAt": "2025-05-01T03:58:17.000Z",
    "fileNames": [
      "itunes_info.zip"
    ]
  }
]
```

**Downloading each file:** 

To download each file listed in contents.json, use this format: https://ax3.taddy.org/db-snapshot/{fileName} and pass in your Taddy API `X-USER-ID` and `X-API-KEY` in the headers. 

**Example:**

```graphql
curl -H "X-USER-ID: 1" -H "X-API-KEY: xyz..." \                                                                                           
https://ax3.taddy.org/db-snapshot/podcastseries.zip > ~/Downloads/podcastseries.zip
```

**Note: If** you downgrade from Taddy Business Plan to a lower plan, you will lose access to future monthly snapshots.

If you have any questions, please contact **`danny@taddy.org`**

More Links:  

[Sign Up →](https://taddy.org/signup/developers)

[Taddy Dashboard →](https://taddy.org/dashboard) 

[Pricing](./pricing.md)

[Terms of Service](https://taddy.org/terms-of-service)

[Developer Policy](https://taddy.org/terms-of-service/developer-policy)