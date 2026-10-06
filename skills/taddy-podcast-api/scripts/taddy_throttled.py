"""Throttled Taddy API client: one request, then a 0.25 s pause. Python 3.9+, standard library only.

Use it for anything that calls the API in a loop (a cron job, a batch over uuids, polling hash / childrenHash):
a 0.25 s pause plus the response time works out to about 3 requests per second, well under the per-minute rate
limit, so the loop never sees API_RATE_LIMIT_EXCEEDED.
A single user-facing request does not need this; call query() from taddy_client.py directly.

Server-side only: the API key must never reach a browser or mobile bundle.

Usage:
    from taddy_throttled import throttled_query
    for uuid in uuids:
        data = throttled_query('query ($uuid: ID) { getPodcastSeries(uuid: $uuid) { uuid childrenHash } }', {"uuid": uuid})

Call it one at a time. The pause only spaces sequential calls; a thread pool over a list would still fire every
request at once.

`timeout` is passed straight through to query(). Errors are not caught here; a TaddyError propagates unchanged.

Env: TADDY_USER_ID, TADDY_API_KEY (required). The endpoint is always https://api.taddy.org.
"""
import time

from taddy_client import query

GAP_S = 0.25  # a 250 ms pause after each request


def throttled_query(gql, variables=None, timeout=30):
    data = query(gql, variables, timeout=timeout)
    time.sleep(GAP_S)
    return data


if __name__ == "__main__":
    # Smoke test: python scripts/taddy_throttled.py (three calls, about 1 s)
    import json
    from taddy_client import TaddyError

    started = time.monotonic()
    try:
        for _ in range(3):
            data = throttled_query('{ getPodcastSeries(name: "The Daily") { uuid name } }')
            print(json.dumps(data["getPodcastSeries"]))
        print(f"3 requests in {time.monotonic() - started:.1f} s")
    except TaddyError as err:
        raise SystemExit(f"TaddyError: {err} (code {err.code})")
