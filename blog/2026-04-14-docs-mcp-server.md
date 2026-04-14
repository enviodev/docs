---
title: Introducing the Envio Docs MCP Server
sidebar_label: Introducing the Envio Docs MCP Server
slug: /envio-docs-mcp-server
tags: ["ai"]
description: "Envio's documentation is now available as an MCP server. Connect Claude Code, Cursor, Copilot, or any MCP-compatible assistant and get accurate, always up-to-date Envio context without copy-pasting."
image: /blog-assets/envio-docs-mcp-server.png
---

Co-authors: [Jordyn Laurier](https://x.com/j_o_r_d_y_s), Head of Marketing & Operations, and [Kenau Vith](https://x.com/KenauVith32), Growth Engineer

<img src="/blog-assets/envio-docs-mcp-server.png" alt="Introducing the Envio Docs MCP Server" width="100%"/>

<!--truncate-->

:::note TL;DR
- Envio's documentation is now directly accessible to your AI coding assistant via MCP.
- Connect Claude Code, Cursor, Copilot, or any MCP-compatible client in one step.
- Your assistant searches and fetches live Envio docs on demand, no copy-pasting required.
- Envio Docs MCP quicklink: [https://docs.envio.dev/docs/HyperIndex/mcp-server](https://docs.envio.dev/docs/HyperIndex/mcp-server)
:::

Envio now has a hosted MCP server for its documentation. Point your AI coding assistant at it and it can search and read Envio docs on demand. No more copy-pasting links into chat and no more watching your model confidently invent a config field that does not exist.

Whether you are building an indexer, querying onchain data with HyperSync, or just exploring what Envio can do, the MCP server gives your agent a direct line to the real documentation while it works.

## What is an MCP server?

Model Context Protocol (MCP) is an open standard for connecting AI assistants to external tools and data sources. An MCP server exposes a set of capabilities, like searching a knowledge base, fetching a document, or calling an API, that any MCP-compatible client can call on demand.

In practice, this means you can give your AI assistant a stable, structured way to reach into a real system, instead of relying on whatever happened to be in its training data or fumbling around the web trying to find something relevant.

## What is the Envio Docs MCP Server?

The Envio Docs MCP server is a hosted MCP server that gives AI coding assistants direct access to Envio's documentation. It exposes two tools:

| Tool | Description |
|------|-------------|
| `docs_search` | Full-text search across all Envio documentation. Returns matching pages with titles, URLs, and content snippets. |
| `docs_fetch` | Retrieves the full content of a documentation page as markdown. |

The server is hosted at:
[https://docs.envio.dev/mcp](https://docs.envio.dev/mcp)

## Why this matters for Envio users

Without an MCP server, an AI assistant trying to use Envio docs is mostly working blind. It either falls back on whatever it remembers from training, or hops between links and fetches raw HTML pages to parse out the parts it needs. That is slow, noisy, and easy to get wrong: the model ends up sifting through navigation, sidebars, and styling just to find a single config option.

The Envio Docs MCP server replaces that with a structured way for your assistant to ask the docs a question directly. Instead of scraping pages, it can search across all of Envio's documentation and pull back exactly the content it needs.

That means:

- **Always up to date.** The MCP server reads from the same docs site you read. When the docs change, your assistant sees the change immediately.
- **Grounded in source docs.** Your agent looks up the exact answer in the documentation instead of guessing.
- **Less copy-paste.** No more shuttling doc snippets back and forth between your browser and your editor.
- **Useful across the whole stack.** Whether you are building an indexer, pulling onchain data with HyperSync, or exploring Envio Cloud, your assistant has the right context for the job.

## How to connect it

### Claude Code

```bash
claude mcp add --transport http envio-docs https://docs.envio.dev/mcp
```

### Cursor / VS Code

Add the following to your MCP configuration (`.cursor/mcp.json` or your VS Code MCP settings):

```json
{
  "mcpServers": {
    "envio-docs": {
      "url": "https://docs.envio.dev/mcp"
    }
  }
}
```

### Other MCP clients

Point any MCP-compatible client to `https://docs.envio.dev/mcp` using the Streamable HTTP transport.

For full, always-current setup instructions, see the Envio Docs MCP Server guide.

Once connected, your assistant can search the docs and pull back full pages whenever it needs context, with no extra prompting from you.

## Frequently Asked Questions

### What Is an MCP Server?
An MCP server is a server that implements the Model Context Protocol, an open standard for connecting AI assistants to external tools and data sources. It lets AI coding assistants like Claude Code and Cursor access real, structured information on demand rather than relying on training data.

### What Is the Envio Docs MCP Server?
The Envio Docs MCP server is a hosted server at [https://docs.envio.dev/mcp](https://docs.envio.dev/mcp) that gives AI coding assistants direct access to Envio's documentation. It supports two operations: searching across all docs and fetching the full content of any documentation page.

### Which AI Assistants Does the Envio MCP Server Support?
The Envio Docs MCP server works with any MCP-compatible client. Setup instructions are available for Claude Code and Cursor / VS Code. Any other client that supports the Streamable HTTP transport can connect using the endpoint URL directly.

### Is the Envio MCP Server Always Up to Date?
Yes. The MCP server reads directly from the live Envio docs site. When documentation is updated, your assistant has access to the latest version immediately.

## Build With Envio

Envio HyperIndex is independently benchmarked as the fastest EVM blockchain indexer available. If you are building onchain and need indexing that keeps up with your chain, check out the docs, run the benchmarks yourself, or come talk to us about your data needs.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
