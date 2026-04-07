---
id: mcp-server
title: MCP Server
sidebar_label: MCP Server
slug: /mcp-server
description: Connect AI coding assistants to Envio documentation using the Model Context Protocol (MCP) server
---

# MCP Server

Envio provides a [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server that lets AI coding assistants search and retrieve documentation directly. This means tools like Claude Code, Cursor, and other MCP-compatible clients can access Envio docs without you needing to copy-paste context manually.

## Endpoint

```
https://docs.envio.dev/mcp
```

## Available Tools

The MCP server exposes two tools:

| Tool | Description |
|------|-------------|
| `docs_search` | Full-text search across all documentation. Returns matching pages with titles, URLs, and content snippets. |
| `docs_fetch` | Retrieves the full content of a documentation page as markdown. |

## Setup

### Claude Code

```bash
claude mcp add --transport http envio-docs https://docs.envio.dev/mcp
```

### Cursor / VS Code

Add the following to your MCP configuration (`.cursor/mcp.json` or VS Code MCP settings):

```json
{
  "mcpServers": {
    "envio-docs": {
      "url": "https://docs.envio.dev/mcp"
    }
  }
}
```

### Other MCP Clients

Point any MCP-compatible client to the endpoint URL above using the **Streamable HTTP** transport.

