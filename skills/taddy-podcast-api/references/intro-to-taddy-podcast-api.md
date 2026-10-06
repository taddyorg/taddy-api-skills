# Intro To Taddy API

## Getting Started with our API

To get started using our API, follow these steps:

1. Signup for a [**developer account](https://taddy.org/signup/developers).** 
2. Login to the [**dashboard**](https://taddy.org/dashboard) and get your API Key. 
3. Follow the steps in the next section to make your first API request.

[https://www.youtube.com/watch?v=kzjSjVjCMlk](https://www.youtube.com/watch?v=kzjSjVjCMlk)

## Hello World (Making your first request)

Go to [**api.taddy.org](https://api.taddy.org)** on your browser and copy & paste the below query:

```graphql
{
  getPodcastSeries(name:"The Daily"){
    uuid
    name
    itunesId
    description
    imageUrl
    totalEpisodesCount
    itunesInfo{
      uuid
      baseArtworkUrlOf(size:640)
    }
    episodes(limitPerPage:3){
	    uuid
	    name
	    datePublished
	    audioUrl
    }
  }
}
```

**Note:** All requests to Taddy API need to be authenticated to get a successful response. Don’t worry, it's easy to setup, but that means you will need to pass in your User ID and API Key in the headers. See Authentication section below for more details. 

If you are using the [api.taddy.org](http://api.taddy.org) playground there is a ‘Headers’ section at the bottom of the screen, click to open it up and add your values for the headers `X-USER-ID` and `X-API-KEY` there. (you can see it being done @ 2:28 of the [Intro to Taddy API video](https://www.youtube.com/watch?v=kzjSjVjCMlk&t=149s)).

![Taddy API GraphQL Playground](https://ax0.taddy.org/docs/taddy-api-playground.png)

## Authentication

All requests to our API need to be authenticated. To get your API Key, log in to the [**Taddy Dashboard**](https://taddy.org/dashboard), you will see a “Get my API Key” button, clicking on it will reveal your API Key

![Taddy API User ID and API Key location ](https://ax0.taddy.org/docs/taddy-userid-apikey.png)

You now have both your User ID and API Key and you will need to add both of them to the headers whenever you make an API request. Use the `X-USER-ID` and `X-API-KEY` keys and pass in your information as the values.

```graphql
{
	"X-USER-ID": 7,
	"X-API-KEY": "96c5007c18858e86d..."
}
```

## **Useful Docs for AI**

If you're using Claude Code, ChatGPT, Cursor etc, here are 2 resources that you can provide to your AI coding tool to give it useful context about our API:

1. [**GraphQL Schema**](https://ax0.taddy.org/docs/schema.graphql) - The complete GraphQL schema with all available types, queries, and mutations available.
2. [**Taddy API Documentation**](https://ax0.taddy.org/docs/taddy-api-docs.md) - The full documentation for Taddy API in one big markdown file.

## GraphQL vs REST APIs

Most developers will be familiar with REST APIs, but Taddy uses a GraphQL API. While both REST & GraphQL architectures are used to build APIs, we want to go over some of the unique benefits of GraphQL.

### Ability to write custom queries

The main difference is that with **REST** you go to multiple endpoints to get back different information on different topics. With **GraphQL** there is only 1 endpoint and you can write custom queries depending on what information you want to get back.

![REST vs GraphQL](https://ax0.taddy.org/docs/taddy-api-graphql-1.png)

### Ability to get back custom responses

The big benefit of writing custom queries is that you get to specify the information you want back in the response. For the example below the first query gets back a podcast’s name and description, but the second one gets back the last 10 episodes. Practically, what this means is that depending on your business requirements, you can request the exact fields you need for your business use-case.

![GraphQL query example](https://ax0.taddy.org/docs/taddy-api-graphql-2.png)

## Working with a GraphQL API

When working with a GraphQL API, you can either: 

### 1. Use a GraphQL specific library (Recommended)

Dedicated GraphQL libraries make it easier than a standard HTTP library to do GraphQL specific things (ex: generating types from your queries). Here are some popular options for a few common languages:

- Javascript: [graphql-request](https://github.com/graffle-js/graffle/tree/graphql-request) (also check out our [**example project**](https://github.com/taddyorg/example-project)).
- Python: [glq](https://github.com/graphql-python/gql)
- Ruby: [GraphQL client](https://github.com/github-community-projects/graphql-client)
- iOS: [Apollo iOS](https://github.com/apollographql/apollo-ios)
- Android: [Apollo Kotlin](https://github.com/apollographql/apollo-kotlin)

**Note:**  For a full list of libraries supported for even more languages, please see: [https://graphql.org/code/](https://graphql.org/code/)

### 2. Interact with our API using any http client

The below shows an example of a simple request to our API using curl. There are 3 important parts to the request:

- Sending a POST request to our GraphQL API Endpoint `https://api.taddy.org`
- Adding `Content-Type: application/json` , `X-USER-ID` & `X-API-KEY` in the headers.
- Sending the query you care about in the data field. You can read our [Podcast API](./podcast-api.md) docs to find all the different types of queries you can use.
    
    ```graphql
    curl -X POST \
    https://api.taddy.org \
    -H "Content-Type: application/json" \
    -H "X-USER-ID: 7" \
    -H "X-API-KEY: 96c5007c18858e86d..." \
    -d '{ "query": "{ getPodcastSeries(name:\"This American Life\") { uuid name } }" }'
    ```
    

**Note:** Currently, there are no official Taddy SDKs at the moment. However, one of the benefits of GraphQL is that types are built into it. If the language you using supports types, use a [GraphQL Specific Library](https://taddy.org/developers/intro-to-taddy-graphql-api). 

## Useful Tips

### UUIDs

Every piece of content on Taddy has its own unique UUID and therefore you will be using UUIDs when interacting with our API. You can learn more about uuids on [**Wikipedia](https://en.wikipedia.org/wiki/Universally_unique_identifier).**

### Caching

We cache results from our API, which is great for API performance. Moreover, if your API request gets a cached response, it does not count against your monthly API limit 🥳.

### Pagination

Queries such as [**getPodcastSeries**](./get-podcast-series.md) can return multiple pages of results. For example the query below returns information on a podcast and its latest 10 episodes. By default, it returns the latest 10 episodes released but you can modify that by passing different parameters.

```graphql
// by default "episodes" returns the last 10 episodes
{
  getPodcastSeries(name:"This American Life"){
    uuid
    episodes{
      uuid
      name
      description
      audioUrl
    }
  }
}
```

```graphql
// you can also pass in parameters for "episodes". 
// This will return the exact same results as above 
// as these are the default parameters
{
  getPodcastSeries(name:"This American Life"){
    uuid
    episodes(sortOrder:LATEST, page:1, limitPerPage:10){
      uuid
      name
      description
      audioUrl
    }
  }
}
```

```graphql
// to get the 2nd page of results (the next 10 episodes)
{
  getPodcastSeries(name:"This American Life"){
    uuid
    episodes(page:2){
      uuid
      name
      description
      audioUrl
    }
  }
}
```

### Check how many API requests you have left for the month

You can use this query to check how many API requests you have left for the month. 

```graphql
{
  getApiRequestsRemaining
}
```

### GraphQL Errors

A successful response will return the information you requested in the `data` key.

```graphql
{
  "data": {
    "answer": 42
  }
}
```

However, when you get back an error, you get back an `errors` array, which returns a list of all the errors. Note the two values associated with each error: the `code` (a category code for the type of error) and the `message` (a helpful message to help you troubleshoot the error).

```graphql
{
  "errors": [
    {
      "code": // An Error Code (We categorize errors using different codes)
      "message": // Helpful message to help you problem solve the error
    }
  ],
  "data": {
    "answer": null
  }
}
```

Here is an example: (123 is not a valid uuid because a valid uuid has to be 36 characters long)

![GraphQL errors](https://ax0.taddy.org/docs/taddy-api-errors.png)

**Possible Error Codes**

| Code | HTTP status | What it means |
| --- | --- | --- |
| `API_KEY_INVALID` | `401` | Your `X-API-KEY` or `X-USER-ID` headers are missing or invalid. |
| `API_RATE_LIMIT_EXCEEDED` | `429` | You've hit your per-minute or monthly request limit. |
| `INVALID_QUERY_OR_SYNTAX` | `400` | There is a spelling or syntax mistake in your query, or a required argument is missing. Use the message value as a hint as to what can be fixed. |
| `QUERY_TOO_COMPLEX` | `400` | Your query is too complex. Every field you request adds to the query's cost, and fields inside a list are multiplied by the number of items requested. The error's `extensions.queryCost` and `extensions.maxQueryCostAllowed` tell you how much you need to cut. Remove fields, or request fewer items, and try again. |
| `BAD_USER_INPUT` | `200` | One of the arguments you passed in is invalid. Use the message value to get more details on what is invalid. |
| `REQUIRES_USER_AUTHENTICATION` | `200` | You need to be logged in to make that request. |
| `ACCESS_NOT_ALLOWED` | `200` | You are not allowed to access this feature, query or mutation. (e.g. access to webhooks) |
| `TADDY_SERVER_ERROR` | `200` | Something is wrong on our end. We monitor for this, but feel free to reach out to danny@taddy.org if you keep getting this error. |

`400`, `401` and `429` status codes mean your request was rejected before it ran, so there will be no `data` field returned.

A `200` with errors means your request ran, but some (or all) fields failed. Always check the `errors` array. Any fields that succeeded are still returned in `data`.

### Example Project

Here is an [**example project**](https://github.com/taddyorg/taddy-api-example-project) in Node.js that uses Taddy’s API.

<aside>
👋 You just completed our Intro to Taddy’s API Guide. Yay!

</aside>

More Links: 

[Sign Up →](https://taddy.org/signup/developers)

[Taddy Dashboard →](https://taddy.org/dashboard) 

[Terms of Service](https://taddy.org/terms-of-service)

[Developer Policy](https://taddy.org/terms-of-service/developer-policy)