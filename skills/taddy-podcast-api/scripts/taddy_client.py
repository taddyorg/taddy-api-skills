"""Minimal Taddy API client. Python 3.9+, standard library only.

Server-side only: the API key must never reach a browser or mobile bundle.

Usage:
    from taddy_client import query, TaddyError
    data = query('query ($name: String) { getPodcastSeries(name: $name) { uuid name } }', {"name": "The Daily"})

A request that exceeds `timeout` seconds (default 30) raises TaddyError with code TIMEOUT; timeout=None disables it.
Pass timeout=300 for getEpisodeTranscript only: on-demand transcription can take minutes.

Env: TADDY_USER_ID, TADDY_API_KEY (required). The endpoint is always https://api.taddy.org.
"""
import json
import os
import socket
import urllib.error
import urllib.request

TADDY_API_URL = "https://api.taddy.org"


class TaddyError(Exception):
    def __init__(self, message, code=None, errors=None, status=None):
        super().__init__(message)
        self.code = code        # e.g. API_RATE_LIMIT_EXCEEDED, QUERY_TOO_COMPLEX, HTTP_ERROR, TIMEOUT
        self.errors = errors    # raw errors[] from the response, if any
        self.status = status    # HTTP status


def query(gql, variables=None, timeout=30):
    user_id = os.environ.get("TADDY_USER_ID")
    api_key = os.environ.get("TADDY_API_KEY")
    if not user_id or not api_key:
        raise TaddyError("TADDY_USER_ID and TADDY_API_KEY must be set", code="MISSING_CREDENTIALS")

    payload = json.dumps({"query": gql, "variables": variables or {}}).encode("utf-8")
    req = urllib.request.Request(
        TADDY_API_URL,
        data=payload,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "X-USER-ID": str(user_id),
            "X-API-KEY": api_key,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as res:
            status = res.status
            raw = res.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        body = None
        try:
            body = json.loads(e.read().decode("utf-8"))
        except Exception:
            pass
        # 400/401/429 still carry a Taddy code in errors[]; fall back to HTTP_ERROR only when there is none.
        errors = (body or {}).get("errors") or []
        first = errors[0] if errors and isinstance(errors[0], dict) else {}
        code = first.get("code") or (first.get("extensions") or {}).get("code") or "HTTP_ERROR"
        raise TaddyError(first.get("message") or f"Taddy API HTTP {e.code}", code=code, status=e.code,
                         errors=errors or None) from None
    except urllib.error.URLError as e:
        # urlopen wraps a connect timeout as URLError(reason=socket.timeout); other network errors pass through.
        if isinstance(e.reason, socket.timeout):
            raise TaddyError(f"Taddy API timed out after {timeout}s", code="TIMEOUT") from None
        raise
    except (socket.timeout, TimeoutError):
        # A read timeout mid-response surfaces as a bare socket.timeout / TimeoutError.
        raise TaddyError(f"Taddy API timed out after {timeout}s", code="TIMEOUT") from None

    body = json.loads(raw) if raw else {}
    errors = body.get("errors")
    if errors:
        first = errors[0]
        code = first.get("code") or (first.get("extensions") or {}).get("code")
        raise TaddyError(first.get("message", "Taddy API error"), code=code, errors=errors, status=status)
    return body.get("data")


if __name__ == "__main__":
    # Smoke test: python scripts/taddy_client.py
    try:
        print(json.dumps(query('{ getPodcastSeries(name: "The Daily") { uuid name } }'), indent=2))
    except TaddyError as err:
        raise SystemExit(f"TaddyError: {err} (code {err.code})")
