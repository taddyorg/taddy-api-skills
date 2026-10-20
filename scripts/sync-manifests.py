#!/usr/bin/env python3
"""Render every plugin manifest in this repo from data.json.

data.json is the single source of truth for name, version, description, author,
logo, per-platform categories, Codex listing fields, and marketplace details.
Each target below maps those fields into one tool's manifest schema. Run with
no arguments to write the files; run with --check to exit non-zero if any file
on disk differs from what data.json would produce.

Dev-only. Not part of the installed skill.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data.json"


def claude_plugin(d):
    return {
        "name": d["name"],
        "version": d["version"],
        "description": d["description"],
        "author": d["author"],
        "homepage": d["homepage"],
        "repository": d["repository"],
        "license": d["license"],
        "privacyPolicyUrl": d["privacyPolicyURL"],
        "supportUrl": d["supportURL"],
        "keywords": d["keywords"],
        "icon": "./" + d["logo"],
    }


def claude_marketplace(d):
    m = d["marketplace"]
    return {
        "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
        "name": m["name"],
        "description": m["description"],
        "owner": d["author"],
        "plugins": [
            {
                "name": d["name"],
                "description": d["description"],
                "version": d["version"],
                "author": {"name": d["author"]["name"]},
                "category": d["categories"]["claude"],
                "source": "./",
                "homepage": d["homepage"],
            }
        ],
    }


def agent_plugin(d):
    """Root plugin.json, the Agent Plugins open standard (agent-plugins.org).
    Read by Cursor and Codex. The schema is closed (no `skills` field; skills
    are discovered from ./skills/). Codex-specific display settings live under
    extensions.com.openai and follow the OpenAI directory submission limits
    (shortDescription <= 30 chars, square logo, https URLs)."""
    c = d["codex"]
    return {
        "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
        "name": d["name"],
        "version": d["version"],
        "description": d["description"],
        "author": d["author"],
        "homepage": d["homepage"],
        "repository": d["repository"],
        "license": d["license"],
        "keywords": d["keywords"],
        "extensions": {
            "com.openai": {
                "interface": {
                    "displayName": d["displayName"],
                    "shortDescription": c["shortDescription"],
                    "longDescription": d["description"],
                    "developerName": d["author"]["name"],
                    "category": d["categories"]["codex"],
                    "capabilities": c["capabilities"],
                    "websiteURL": d["homepage"],
                    "privacyPolicyURL": d["privacyPolicyURL"],
                    "termsOfServiceURL": c["termsOfServiceURL"],
                    "supportURL": d["supportURL"],
                    "logo": "./" + d["logo"],
                    "composerIcon": "./" + d["logo"],
                }
            }
        },
    }


def cursor_plugin(d):
    return {
        "name": d["name"],
        "displayName": d["displayName"],
        "version": d["version"],
        "description": d["description"],
        "author": d["author"],
        "homepage": d["homepage"],
        "repository": d["repository"],
        "license": d["license"],
        "keywords": d["keywords"],
        "category": d["categories"]["cursor"],
        "logo": d["logo"],
    }


def codex_marketplace(d):
    m = d["marketplace"]
    return {
        "name": m["name"],
        "interface": {"displayName": m["displayName"]},
        "plugins": [
            {
                "name": d["name"],
                "source": {"source": "local", "path": "./"},
                "policy": {"installation": "AVAILABLE", "authentication": "ON_INSTALL"},
                "category": d["categories"]["codex"],
            }
        ],
    }


TARGETS = {
    ".claude-plugin/plugin.json": claude_plugin,
    ".claude-plugin/marketplace.json": claude_marketplace,
    "plugin.json": agent_plugin,
    ".cursor-plugin/plugin.json": cursor_plugin,
    ".agents/plugins/marketplace.json": codex_marketplace,
}


def render(obj):
    return json.dumps(obj, indent=2, ensure_ascii=False) + "\n"


def main(argv):
    check = "--check" in argv
    data = json.loads(DATA.read_text())
    stale = []
    for rel, build in TARGETS.items():
        path = ROOT / rel
        want = render(build(data))
        have = path.read_text() if path.exists() else None
        if check:
            if have != want:
                stale.append(rel)
            continue
        path.parent.mkdir(parents=True, exist_ok=True)
        if have != want:
            path.write_text(want)
            print(f"wrote  {rel}")
        else:
            print(f"same   {rel}")
    if check:
        if stale:
            for rel in stale:
                print(f"STALE  {rel}", file=sys.stderr)
            print("run: python3 scripts/sync-manifests.py", file=sys.stderr)
            return 1
        print(f"ok   {len(TARGETS)} manifests match data.json")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
