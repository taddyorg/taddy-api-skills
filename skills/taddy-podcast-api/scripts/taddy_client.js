// Minimal Taddy API client. Node 20+ (native fetch, AbortSignal.any), no dependencies. This is the side-feature path;
// for a podcast-first app use taddy_client_typed.ts (see references/graphql-client-libraries.md).
// Server-side only: the API key must never reach a browser or mobile bundle.
//
// Usage:
//   import { query, TaddyError } from "./taddy_client.js";
//   const data = await query(`query ($name: String) { getPodcastSeries(name: $name) { uuid name } }`, { name: "The Daily" });
//
// Options: { timeoutMs = 30000, signal }. A request that exceeds timeoutMs throws TaddyError with code TIMEOUT;
// timeoutMs: 0 disables the deadline. A caller-supplied signal is honoured alongside the timeout.
// Pass { timeoutMs: 300_000 } for getEpisodeTranscript only: on-demand transcription can take minutes.
//
// Env: TADDY_USER_ID, TADDY_API_KEY (required). The endpoint is always https://api.taddy.org.

const TADDY_API_URL = "https://api.taddy.org";

export class TaddyError extends Error {
  constructor(message, { code, errors, status } = {}) {
    super(message);
    this.name = "TaddyError";
    this.code = code;     // e.g. API_RATE_LIMIT_EXCEEDED, QUERY_TOO_COMPLEX, HTTP_ERROR, TIMEOUT
    this.errors = errors; // raw errors[] from the response, if any
    this.status = status; // HTTP status
  }
}

// Combine the caller's signal (if any) with a deadline. timeoutMs <= 0 or Infinity means no deadline.
function requestSignal(signal, timeoutMs) {
  const hasTimeout = Number.isFinite(timeoutMs) && timeoutMs > 0;
  if (!hasTimeout) return signal;
  const timeout = AbortSignal.timeout(timeoutMs);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

export async function query(gql, variables = {}, { signal, timeoutMs = 30_000 } = {}) {
  const userId = process.env.TADDY_USER_ID;
  const apiKey = process.env.TADDY_API_KEY;
  if (!userId || !apiKey) {
    throw new TaddyError("TADDY_USER_ID and TADDY_API_KEY must be set", { code: "MISSING_CREDENTIALS" });
  }

  let res;
  try {
    res = await fetch(TADDY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-USER-ID": String(userId),
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({ query: gql, variables }),
      signal: requestSignal(signal, timeoutMs),
    });
  } catch (err) {
    // AbortSignal.timeout() rejects with a TimeoutError; a caller's abort (AbortError) and network errors pass through.
    if (err?.name === "TimeoutError") {
      throw new TaddyError(`Taddy API timed out after ${timeoutMs}ms`, { code: "TIMEOUT" });
    }
    throw err;
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    // non-JSON body (proxy error page, empty 5xx); handled below
  }

  if (!res.ok) {
    // 400/401/429 still carry a Taddy code in errors[]; fall back to HTTP_ERROR only when there is none.
    const first = body?.errors?.[0];
    throw new TaddyError(first?.message || `Taddy API HTTP ${res.status}`, {
      code: first?.code || first?.extensions?.code || "HTTP_ERROR",
      status: res.status,
      errors: body?.errors,
    });
  }
  if (body?.errors?.length) {
    const first = body.errors[0];
    throw new TaddyError(first.message || "Taddy API error", {
      code: first.code || first.extensions?.code,
      errors: body.errors,
      status: res.status,
    });
  }
  return body.data;
}

// Smoke test: node scripts/taddy_client.js
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  query(`{ getPodcastSeries(name: "The Daily") { uuid name } }`)
    .then((data) => console.log(JSON.stringify(data, null, 2)))
    .catch((err) => {
      console.error(`${err.name}: ${err.message}`, err.code ? `(code ${err.code})` : "");
      process.exit(1);
    });
}
