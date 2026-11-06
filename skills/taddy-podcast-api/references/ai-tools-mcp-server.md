# Taddy API Skill, MCP Server, and Docs

We have a couple of AI tools to help you get the most out of Taddy Podcast API

1. **Taddy API Skill** - We recommend using our [open-source skill](https://github.com/taddyorg/taddy-api-skills)  when you add Taddy Podcast API to your application. It gives your AI coding tool (Claude Code, Codex, Cursor etc.) our full API docs in Markdown, our GraphQL schema, and best practices for things like pagination and error handling.
2. **MCP Server for Taddy API** – Use Taddy API’s MCP server if you want to get podcast data (including transcripts) inside ChatGPT, Claude, or any MCP-compatible app. ex) You can ask to "Find recent episodes that mention [my company] and summarize the positive and negative feedback"*.* 
3. **Taddy API Docs** - If you just want to provide to your AI coding tool our API docs & GraphQL schema. It's the building blocks we used to make the Taddy API Skill.

## 1. Adding Taddy API’s Skill to your project

```bash
# Claude Code
/plugin marketplace add taddyorg/taddy-api-skills
/plugin install taddy-podcast-api@taddy-api
# Plugins have the ability to auto-update

# Codex
# 1. Add github repo as an available plugin
codex plugin marketplace add taddyorg/taddy-api-skills 
# 2. Then open Codex, run /plugin and pick Taddy Podcast API. Plugins have the ability to auto-update

# Other AI Tools
Ask your AI agent to: Download the Taddy API skill from https://github.com/taddyorg/taddy-api-skills into your project's skills folder
# Not a plugin, so you may have to update manually in the future
```

## 2. Adding Taddy API’s MCP server to your project

Taddy API’s MCP Server is available at: [https://taddy.org/mcp/podcast-api](https://taddy.org/mcp/podcast-api)

You will need your Taddy API User ID and API Key, you can get them at: [https://taddy.org/dashboard](https://taddy.org/dashboard)

### Adding MCP Server to Claude Desktop or [claude.ai](http://Claude.AI)

Follow these steps:

1. Open Claude and click on Settings → Customize → Add → Add Custom Connector
2. Add link to the MCP Server: [https://taddy.org/mcp/podcast-api](https://taddy.org/mcp/podcast-api)
3. Add Headers `x-account-id` and `x-api-key`. You will find these value on the [Taddy Dashboard](https://taddy.org/dashboard). 
    
    **Note:** The Taddy API normally uses `x-user-id`, but Claude only supports a limited set of custom headers by default, and `x-user-id` isn’t one of them. Use `x-account-id` instead. We’ll map it to `x-user-id` automatically.
    

![](https://ax0.taddy.org/general/mcp-server-instructions-claude.png)

### Adding MCP Server to ChatGPT Desktop

Follow these steps:

1. Open ChatGPT, and click on Settings → Plugins → Add → Add MCP Server
2. Add link to the MCP Server: [https://taddy.org/mcp/podcast-api](https://taddy.org/mcp/podcast-api)
3. Add Headers `x-user-id` and `x-api-key`. You will find these value on the [Taddy Dashboard](https://taddy.org/dashboard). 

![](https://ax0.taddy.org/general/mcp-server-instructions-codex.png)

### Adding MCP Server to Claude Code or Codex

For Claude Code, add or append to `.mcp.json`

```toml
{
  "mcpServers": {
    "taddy-podcast-api": {
      "type": "http",
      "url": "https://taddy.org/mcp/podcast-api",
      "headers": {
        "X-USER-ID": "${TADDY_USER_ID}",
        "X-API-KEY": "${TADDY_API_KEY}"
      }
    }
  }
}
```

For Codex, add or append to `~/.codex/config.toml`

```toml
[mcp_servers.taddy-podcast-api]
url = "https://taddy.org/mcp/podcast-api"
env_http_headers = { "X-USER-ID" = "TADDY_USER_ID", "X-API-KEY" = "TADDY_API_KEY" }
```

And set these credentials in the environment:

```bash
export TADDY_USER_ID="<user id>"
export TADDY_API_KEY="<api key>"
```

## 3. Taddy API Docs

Here are two resources that you can provide your AI coding tool to give it useful context about our API, we used this as input for the [Taddy API Skill](./ai-tools-mcp-server.md):

1. [**GraphQL Schema**](https://ax0.taddy.org/docs/taddy-podcast-api-schema.graphql) - The complete Podcast API GraphQL schema with all available types, queries, and mutations available.
2. [**Taddy API Documentation**](https://ax0.taddy.org/docs/taddy-podcast-api-docs.md) - The full documentation for Taddy Podcast API in one big markdown file.

More Links:  

[Sign Up →](https://taddy.org/signup/developers)

[Taddy Dashboard →](https://taddy.org/dashboard) 

[Pricing](./pricing.md)

[Terms of Service](https://taddy.org/terms-of-service)

[Developer Policy](https://taddy.org/terms-of-service/developer-policy)