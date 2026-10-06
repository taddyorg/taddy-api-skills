# Get Episode Transcripts

You can get the transcript for any episode from our directory of 200+ million episodes. 

## Example:

1. **(Recommended)** Use the `getEpisodeTranscript` query to get the transcript, including timecodes and speaker names (if provided). 

```graphql
{
  getEpisodeTranscript(uuid:"e03bf3ef-829e-4f47-9f02-29ac6a747b4f"){
    id
    text
    speaker
    startTimecode
    endTimecode
  }
}
```

2. If you want to get episode details along with the transcript, use `transcript` or `transcriptWithSpeakersAndTimecodes`. 

If you just need the text of the transcript, use `transcript`. If you also need the timecodes and speaker names (if provided), use `transcriptWithSpeakersAndTimecodes`.

```graphql
{
  getPodcastEpisode(uuid:"e03bf3ef-829e-4f47-9f02-29ac6a747b4f"){
    uuid
    name
    taddyTranscribeStatus
    transcript
    transcriptWithSpeakersAndTimecodes{
      id
      text
      speaker
      startTimecode
      endTimecode
    }
  }
}
```

Example 1 (Recommended) is recommended over example 2 because if Taddy API doesn’t already have the transcript, we generate one on-demand, which can take 10+ seconds to generate. This means for example 2, episode details won’t be returned until the transcript has been generated. 

Depending on your use-case, you may want to consider splitting your requests into two requests for a better user-experience: 

1) get general episode details (fast) and 

2) get the transcript for the episode (using `getEpisodeTranscript`). 

3. **(Advanced)** You can use `transcriptUrls` or `transcriptUrlsWithDetails` to get the URLs where you can download a transcript yourself. This includes both the transcripts provided by podcast (if available) and the transcripts that have been automatically generated via Taddy API. 

To download a transcript provided by Taddy API via its url, you must pass in your Taddy API `X-USER-ID` and `X-API-KEY` in the headers. Here is an example using curl:

```graphql
curl -H "X-USER-ID: 1" -H "X-API-KEY: xyz..." \                                                                                           
https://ax2.taddy.org/9d874d17-fe25-4cbb-a802-ce65f7c198a1/106d1dfb-50ed-4844-8e04-31960d8767c7/transcript.vtt
```

### How Taddy API generates transcripts

Behind the scenes, Taddy API gets the transcript for an episode in 3 ways:

1. **Podcast-provided transcripts** - Some podcasts provide their own text transcripts (however, less than 1% of podcasts currently do this)
2. **Automatic transcription for popular podcasts** - We automatically generate transcripts for the most popular 5000 podcasts using an open-source transcription model running on our GPUs
3. **On-demand transcription** - We can transcribe any episode on-demand (It takes ~10 seconds to transcribe every ~1hr of audio)

To summarize, between transcripts provided by the podcast and Taddy API generated transcripts, you can get the transcript for any episode on Taddy API.

### Pricing

All Taddy API users (including Free users) get access to any transcript provided by the podcast themselves **(podcast-provided transcripts)**. 

Paid users ([Pro and Business users](./pricing.md)) get access to transcripts from all other episodes (we generate them using an open-source transcription model running on our GPUs)

- 100 episode transcripts/month are included on the Pro Plan
- 2000 episode transcripts/month are included on the Business Plan
- If you need more transcript? Business users can buy additional packs. Each pack contains 3,000 episode transcripts/month for $75/month (2.5c per transcript). Turn on Auto-scaling episode transcripts on the Taddy Dashboard. It turns on the ability to automatically buy additional packs when you reach 95% of your current transcript limit.
- If an episode provides its own text transcript with timecodes i.e.) if a transcript is provided in WEBVTT (.vtt) or SubRip (.srt) format, we use that transcript and do not generate our own transcript. This transcript is available to all Taddy API users (Free and Paid) and does not count against your episode transcripts/month.
- A transcript credit is used only if the podcast has not provided a transcript and you want to use Taddy API to generate one for you. **Note:** A credit is used whether we have already transcribed the episode (if its an episode from one of the 5000 most popular podcasts that we transcribe as they are released) or any episode you request to transcribe on-demand.
- You can request the same transcript multiple times in the same month and it will only count once. We keep track of all the transcripts that a user has requested for that month and reset it when your billing cycle resets every month.

### How to check if a podcast is one of the top 5000 podcasts we are automatically transcribe every episode of:

Check the `taddyTranscribeStatus` of a podcast. You are looking for the value `TRANSCRIBING`.

```graphql
{
  getPodcastSeries(name:"This American Life"){
    uuid
    name
    taddyTranscribeStatus
  }
}
```

### How to check if a transcript already exists for an episode:

Check the `taddyTranscribeStatus` of an episode.

```graphql
{
  getPodcastEpisode(uuid:"e03bf3ef-829e-4f47-9f02-29ac6a747b4f"){
    uuid
    name
    taddyTranscribeStatus
  }
}
```

Here are the possible values:

`COMPLETED` - The transcript is available (This can be either be because the podcast has provided it or because we have already transcribed the episode)

`PROCESSING` -  Currently in a queue, waiting to be transcribed. Please note that there can be 10k+ episodes that are queued to be transcribed (so it does not necessarily mean it is going to be transcribed in the next couple minutes).

`NOT_TRANSCRIBING` - We do not have the episode in a queue to be transcribed.

**Please note:**  Being a paid Taddy API user allows you to get the transcript for any episode, even if it is in the `PROCESSING` or  `NOT_TRANSCRIBING` state. Keep in mind, they are generated on-demand (takes ~10 seconds to transcribe every ~1hr of audio) and not already available.

### Try our transcription feature for Free

Every Taddy API user (Free or Paid) gets access to any episode transcript where the podcast provides its own episode transcripts. 

**Build Your SaaS** is an example of a podcast that provides transcripts for its episodes. The query below gets its latest episode along with its transcript.

```graphql
{
  getPodcastSeries(uuid:"6bdfd429-f58b-427d-8072-353d478aa15f") {
    uuid
    name
    rssUrl
    episodes(limitPerPage:1){
      uuid
      name
      datePublished
      audioUrl
      duration
      taddyTranscribeStatus
      transcript(useOnlyPodcastProvidedTranscript:true)
    }
  }
}
```

To return only transcripts that the podcast provides itself, pass `useOnlyPodcastProvidedTranscript: true`. If the podcast doesn't provide a transcript, you get `null` instead of an error, and no transcript credits are used. Keep in mind that only about 1% of podcasts publish their own transcripts. Therefore, make sure to remove that argument (it is false by default) if you want to ensure you get back a transcript for any episode (you must be a Paid user to do this).

### Searching only for episodes that have a transcript

Our `search` query has the option to filter only for results that have transcripts available. Set `filterForHasTranscript` to true.

```graphql
{
  search(term:"Neil deGrasse Tyson", filterForTypes:PODCASTEPISODE, sortBy:POPULARITY, filterForHasTranscript:true){
    searchId
    podcastEpisodes{
      uuid
      name
      datePublished
      description
      audioUrl
      transcript
    }
  }
}
```

### See how many episode transcripts you have left for the month

You can use this query to check how many episode transcript you have left. 

```graphql
{
  getTranscriptCreditsRemaining
}
```

### Useful GraphQL properties

Here are the properties on [PodcastEpisode](./podcastepisode.md) related to transcripts. 

```graphql
" Status of transcript (complete, processing, not transcribed) "
taddyTranscribeStatus: PodcastEpisodeTranscriptionStatus

" Downloads the transcript, parses it and returns an array of text in paragraphs. "
transcript: [String]

" Download the transcript, parses it and return an array of transcript items (which includes text, speakers and timecodes) "
transcriptWithSpeakersAndTimecodes(
  " (Optional) Style option for transcript. Default is PARAGRAPH"
  style: TranscriptItemStyle
): [TranscriptItem]

" A list of urls where you can download the transcript for this episode "
transcriptUrls: [String]

" A list of urls where you can download the transcript for this episode, including more details "
transcriptUrlsWithDetails: [TranscriptLink]
```

### Technical Details

- The most popular 5000 podcasts were picked based on the [Most Popular Podcasts](./most-popular-podcasts.md) query.
- We do not attempt to identify individual speakers in the transcript or infer who is speaking. If your use case requires this, you can explore speaker diarization (segmenting audio by speaker) and speaker identification (identifying the name of each speaker) and can use our transcript as input.
- For on-demand transcript, which are created as Taddy API users request them, we use a faster open-source model that is within a 1% word error rate of our standard transcription model.
- Some podcasts use dynamic ad insertion. ie) The same audio link will give different listeners different ads depending on location and other factors. This will affect the timestamps provided in transcripts as there may be different ads in the audio file we transcribed.
- We use queues to prioritize which episodes we transcribe. Newly released episodes are high priority and transcribed as soon as possible. We're also working through the entire back catalogue of the most popular 5000 podcasts, which is a lower priority.
- Transcripts automatically generated by Taddy API are Brotli encoded. This only affects you if you're accessing a transcript provided by us directly via its URL. Most libraries will automatically decode Brotli, but if you're using a library that doesn't, be sure to decode it yourself.

### Referenced types in this document:

[PodcastEpisodeTranscriptionStatus](./podcastepisode-transcription-status.md)

[TranscriptItem](./episode-transcript-item.md)

[TranscriptLink](./episode-transcript-link.md)

[PodcastEpisode](./podcastepisode.md)

<aside>
👋 If you are new to using Taddy’s API, **Get Started** with our [**🤖 Intro to Taddy’s API](./intro-to-taddy-podcast-api.md).**

</aside>

More Links:  

[Sign Up →](https://taddy.org/signup/developers)

[Taddy Dashboard →](https://taddy.org/dashboard) 

[Pricing](./pricing.md)

[Terms of Service](https://taddy.org/terms-of-service)

[Developer Policy](https://taddy.org/terms-of-service/developer-policy)