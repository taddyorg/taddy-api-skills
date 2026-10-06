# PodcastSeriesType

Used to distinguish between Episodic and Serial podcasts

```graphql
enum PodcastSeriesType {
	EPISODIC
	SERIAL
}
```

`EPISODIC` (Default) - When episodes are intended to be consumed without any specific order. This tells podcast players to show the latest episode first.

`SERIAL` - When episodes are intended to be consumed in sequential order ex) A True Crime Investigation. This tells podcast players to show the 1st episode first.