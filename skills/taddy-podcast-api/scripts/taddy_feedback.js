// Skill feedback: validate and scrub a draft report, print it, and only with --send post it to Taddy.
// Node 20.19+ or 22+ (native fetch, module syntax detection), no dependencies.
// Run it in place from the installed skill folder; it is not copied into the user's project.
//
// What it reports (see references/skill-feedback.md): a mismatch between this skill and the live Taddy API,
// or a use case the user could not build. Nothing is ever sent without --send, and --send is only run after
// the user has seen the printed report and said yes.
//
// Usage:
//   node scripts/taddy_feedback.js draft.json          # validate + scrub, print the exact wire payload, exit 0
//   node scripts/taddy_feedback.js - < draft.json      # same, draft on stdin
//   node scripts/taddy_feedback.js draft.json --send   # re-validate, re-scrub, print again, then POST
//   node scripts/taddy_feedback.js                     # smoke test on a built-in fixture, no network
//
// Draft (three fields; source and sourceVersion are filled from ../SKILL.md, unknown keys are dropped):
//   { "kind": "INCONSISTENCY" | "USE_CASE", "summary": "...", "details": "...", "operations": ["getPodcastSeries"] }
//
// Exit codes: 0 ok, 1 draft invalid or credentials missing, 2 send failed (nothing stored).
//
// Scope: reads only the draft file and ../SKILL.md. It never searches the project or reads .env. If the key lives
// in the project's .env, run `node --env-file=.env <skill>/scripts/taddy_feedback.js draft.json --send`.
// Server-side only: the API key must never reach a browser or mobile bundle.
//
// Env: TADDY_USER_ID, TADDY_API_KEY (required for --send only). The endpoint is https://taddy.org/feeds/api-feedback.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FEEDBACK_URL = "https://taddy.org/feeds/api-feedback";
const KINDS = ["INCONSISTENCY", "USE_CASE"];
const CAPS = { summary: 140, details: 3000 };
const MAX_OPERATIONS = 10;
const MAX_BYTES = 8 * 1024;
const OPERATION_RE = /^[A-Za-z][A-Za-z0-9]{0,63}$/;

const CLOSING_LINE =
  "Sent with your Taddy account id (X-USER-ID) so Taddy can follow up; nothing else identifies you. " +
  "Review for app names, customer names or code you would not share with Taddy.";

// Redaction rules, applied in order to every string value. Header values and paths go before the generic
// token rules; URLs go last so a taddy.org URL survives untouched.
const RULES = [
  ["secret", /\b(X-USER-ID|X-API-KEY|X-TADDY-WEBHOOK-SECRET|TADDY_USER_ID|TADDY_API_KEY|TADDY_WEBHOOK_SECRET)\b\s*[:=]\s*["']?[^\s"',}]+/gi, (m, name) => `${name}: <redacted>`],
  ["secret", /\b([A-Z][A-Z0-9_]{2,})=("[^"]*"|'[^']*'|\S+)/g, (m, name) => `${name}=<redacted>`],
  ["secret", /\b(Bearer|Basic|Token)\s+[A-Za-z0-9._~+/=-]{8,}/gi, (m, scheme) => `${scheme} <redacted>`],
  ["path", /(?:\/Users|\/home|\/root|~)\/[^\s"'`]+/g, () => "<path>"],
  ["path", /[A-Za-z]:\\Users\\[^\s"'`]+/g, () => "<path>"],
  ["email", /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, () => "<email>"],
  ["ip", /\b\d{1,3}(?:\.\d{1,3}){3}\b/g, () => "<ip>"],
  ["secret", /\b[A-Fa-f0-9]{32,}\b/g, () => "<hex>"],
  // base64-ish or JWT segment: 40+ token chars with at least one digit and no hyphen, so kebab-case
  // reference paths and 36-char uuids are never caught
  ["secret", /\b(?=[A-Za-z0-9+/=_]*\d)[A-Za-z0-9+/=_]{40,}={0,2}/g, () => "<token>"],
  ["url", /https?:\/\/[^\s"'<>)\]]+/g, (m) => {
    const tail = m.match(/[.,;:!?]+$/)?.[0] || ""; // sentence punctuation after the URL is not part of it
    const url = m.slice(0, m.length - tail.length);
    return (isTaddyUrl(url) ? url : "<url>") + tail;
  }],
];

function isTaddyUrl(raw) {
  try {
    const host = new URL(raw).hostname;
    return host === "taddy.org" || host.endsWith(".taddy.org");
  } catch {
    return false;
  }
}

export function scrub(value, counts = {}) {
  if (Array.isArray(value)) return value.map((v) => scrub(v, counts));
  if (typeof value !== "string") return value;
  let out = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  for (const [label, re, repl] of RULES) {
    out = out.replace(re, (...args) => {
      counts[label] = (counts[label] || 0) + 1;
      return repl(...args);
    });
  }
  return out;
}

function readSkillMeta() {
  const path = join(dirname(fileURLToPath(import.meta.url)), "..", "SKILL.md");
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    fail(1, "SKILL.md not found next to scripts/: run this from the installed skill folder");
  }
  const name = text.match(/^name:\s*(\S+)\s*$/m)?.[1];
  const version = text.match(/^\s*version:\s*"([^"]+)"/m)?.[1];
  if (!name || !version) fail(1, "could not read name and version from SKILL.md frontmatter");
  return { name, version };
}

// Validate the draft, drop unknown keys, fill source/sourceVersion, scrub. Returns { payload, counts, ignored }.
export function prepare(draft, meta) {
  if (!draft || typeof draft !== "object" || Array.isArray(draft)) fail(1, "draft invalid: expected a JSON object");
  const known = ["kind", "summary", "details", "operations"];
  const ignored = Object.keys(draft).filter((k) => !known.includes(k));

  if (!KINDS.includes(draft.kind)) fail(1, `draft invalid: kind must be one of ${KINDS.join(", ")}`);
  for (const field of ["summary", "details"]) {
    const v = draft[field];
    if (typeof v !== "string" || !v.trim()) fail(1, `draft invalid: ${field} is required`);
    if (v.length > CAPS[field]) fail(1, `draft invalid: ${field} is ${v.length} chars, max ${CAPS[field]}; rewrite it shorter`);
  }
  let operations;
  if (draft.operations !== undefined) {
    const ops = draft.operations;
    if (!Array.isArray(ops) || ops.some((o) => typeof o !== "string")) fail(1, "draft invalid: operations must be an array of strings");
    if (ops.length > MAX_OPERATIONS) fail(1, `draft invalid: operations has ${ops.length} items, max ${MAX_OPERATIONS}`);
    const bad = ops.find((o) => !OPERATION_RE.test(o));
    if (bad !== undefined) fail(1, `draft invalid: operations item "${bad}" is not a query or field name`);
    operations = ops;
  }

  const counts = {};
  const payload = {
    kind: draft.kind,
    source: meta.name,
    sourceVersion: meta.version,
    summary: scrub(draft.summary.trim(), counts),
    details: scrub(draft.details.trim(), counts),
  };
  if (operations) payload.operations = operations;

  const bytes = Buffer.byteLength(JSON.stringify(payload), "utf8");
  if (bytes > MAX_BYTES) fail(1, `draft invalid: payload is ${bytes} bytes, max ${MAX_BYTES}; shorten details`);
  return { payload, counts, ignored };
}

function printPreview({ payload, counts, ignored }) {
  const parts = Object.entries(counts).map(([label, n]) => `${n} ${label}`);
  console.log(parts.length ? `redacted: ${parts.join(", ")}` : "redacted: nothing");
  if (ignored.length) console.log(`ignored: ${ignored.join(", ")}`);
  console.log(JSON.stringify(payload, null, 2));
  console.log(CLOSING_LINE);
}

async function send(payload) {
  const userId = process.env.TADDY_USER_ID;
  const apiKey = process.env.TADDY_API_KEY;
  if (!userId || !apiKey) fail(1, "MISSING_CREDENTIALS: TADDY_USER_ID and TADDY_API_KEY must be set (try node --env-file=.env ...)");

  let res;
  try {
    res = await fetch(FEEDBACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-USER-ID": String(userId), "X-API-KEY": apiKey },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    fail(2, err?.name === "TimeoutError" ? "send failed: Taddy timed out after 30s; nothing was confirmed sent" : `send failed: ${err?.message || err}`);
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    // HTML or empty body: the endpoint is not there
  }

  if (res.ok && body?.status === "success") {
    console.log(`sent: id ${body.id}. Keep this id as the reference; do not resend.`);
    return;
  }
  if (res.status === 404 || !body) {
    fail(2,
      "Taddy's feedback endpoint is not available yet, or this skill is out of date. Nothing was sent. " +
      "The redacted report above is safe to share: open an issue at https://github.com/taddyorg/taddy-api-skills/issues " +
      "or email the address on the API changelog page.");
  }
  fail(2, `send failed: ${body.code || res.status}${body.message ? `: ${body.message}` : ""}`);
}

function fail(code, message) {
  console.error(message);
  process.exit(code);
}

function smokeTest() {
  const planted = {
    key: "X-API-KEY: 96c5007c18858e86d1234567890abcdef",
    env: "TADDY_API_KEY=sk_live_abc123",
    bearer: "Authorization: Bearer abcDEF123456789",
    path: "/Users/jane/acme-pods/src/lib/taddy.ts",
    email: "jane@example.com",
    ip: "203.0.113.7",
    url: "https://example.com/webhooks/taddy",
  };
  const keep = ["d682a935-ad2d-46ee-a0ac-139198b83bcc", "getPodcastSeries", "https://api.taddy.org", "INVALID_QUERY_OR_SYNTAX", "references/latest-episodes-from-multiple-podcasts.md"];
  const text = `${Object.values(planted).join(" ")} ${keep.join(" ")}`;
  const counts = {};
  const out = scrub(text, counts);
  const leaked = Object.entries(planted).filter(([, v]) => out.includes(v.split(/[:=]\s*/).pop()));
  const lost = keep.filter((k) => !out.includes(k));
  console.log(out);
  console.log(`redacted: ${Object.entries(counts).map(([l, n]) => `${n} ${l}`).join(", ")}`);
  if (leaked.length || lost.length) {
    fail(1, `smoke test failed: leaked ${leaked.map(([k]) => k).join(", ") || "none"}; lost ${lost.join(", ") || "none"}`);
  }
  console.log("smoke test passed");
}

async function main() {
  const args = process.argv.slice(2);
  const sendFlag = args.includes("--send");
  const source = args.find((a) => a !== "--send");
  if (!source) return smokeTest();

  let draft;
  try {
    draft = JSON.parse(readFileSync(source === "-" ? 0 : source, "utf8"));
  } catch (err) {
    fail(1, `could not read draft: ${err?.message || err}`);
  }
  const prepared = prepare(draft, readSkillMeta());
  printPreview(prepared);
  if (sendFlag) await send(prepared.payload);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  await main();
}
