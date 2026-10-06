# Add a Podcast to Taddy’s Directory

Taddy’s Directory has over 4 million podcasts and we add more podcasts to our directory every day. Once you add your podcast to Taddy’s Directory, we notify all the podcast players that use Taddy’s API that there is a new podcast that has been released.

## How to add a Podcast to Taddy

1. Use the REST endpoint: **** **https://taddy.org/feeds/add-podcastseries** (POST)
2. Add your `X-USER-ID` and `X-API-KEY` values to the headers (see [Intro Guide](https://taddy.org/developers/intro-to-taddy-graphql-api) for instructions on how to get your API Key and User ID)

```graphql
{
	"X-USER-ID": 7,
	"X-API-KEY": "96c5007c18858e86d..."
}
```

 3. Add `rssUrl` (required) and `itunesId` (optional) values to the data being passed with the POST request.

```graphql
{
	"rssUrl": "http://feed.thisamericanlife.org/talpodcast",
	"itunesId":  201671138
}
```

You will get back one of the following responses:

**Success:** On a successful response you get back a `status` and the `uuid` for the added podcast (uuid is the distinct identifier for all content on Taddy).

```graphql
{
	"status": "success",
	"uuid":  "d682a935-ad2d-46ee-a0ac-139198b83bcc"
}
```

**Error:** When we encounter an error adding a new podcast to Taddy. We send back a string with the error message.

```graphql
`Could not add podcastseries to Taddy`
```

### Example:

```graphql
curl -X POST \
https://taddy.org/feeds/add-podcastseries \
-H "Content-Type: application/json" \
-H "X-USER-ID: 7" \
-H "X-API-KEY: 96c5007c18858e86d..." \
-d '{ "rssUrl": "http://feed.thisamericanlife.org/talpodcast", "itunesId": 201671138 }'
```

**Notes:**

- Once you send a request: 1) We immediately add the podcast to Taddy’s Directory and 2) Queue up a job to parse the podcast feed’s XML, including all episodes. This second step may take up to 30 mins but is usually much sooner.
- Adding the itunesId is optional, especially if you don't know it yet. We check the iTunes API every day for new podcasts and will match the rssUrl to one given from iTunes API to update the itunesId for a podcast without one.
- Trying to re-add a podcast that has already been added to our directory will return a successful response and return the uuid for the podcast series.
- If you are run into any issues, please contact `danny@taddy.org`.

<aside>
👋 If you are new to using Taddy’s API, **Get Started** with our [**🤖 Intro to Taddy’s API](./intro-to-taddy-podcast-api.md).**

</aside>

More Links:  

[Sign Up →](https://taddy.org/signup/developers)

[Taddy Dashboard →](https://taddy.org/dashboard) 

[Pricing](./pricing.md)

[Terms of Service](https://taddy.org/terms-of-service)

[Developer Policy](https://taddy.org/terms-of-service/developer-policy)