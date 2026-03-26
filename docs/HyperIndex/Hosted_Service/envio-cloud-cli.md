---
id: envio-cloud-cli
title: Envio Cloud CLI
sidebar_label: Envio Cloud CLI
slug: /envio-cloud-cli
description: Command-line interface for managing and monitoring your indexers on Envio Cloud.
---

# Envio Cloud CLI

:::warning Alpha Release
The `envio-cloud` CLI is currently in **alpha**. The tool is under active development and will be iterated on before a stable version 1 release once the final form of the tool's interaction is finalized.

For feature requests, please reach out to us on [Telegram](https://t.me/envaborations) or [Discord](https://discord.gg/Q9qt8gZ2fX).
:::

The `envio-cloud` CLI is a command-line tool for interacting with Envio Cloud. It enables you to deploy, manage, and monitor your blockchain indexers directly from the terminal — making it particularly useful for CI/CD pipelines, scripting, and agentic workflows.

## Installation

```bash
npm install -g envio-cloud
```

Or run directly without installation:

```bash
npx envio-cloud <command>
```

## Authentication

### Browser Login

```bash
envio-cloud login
```

Opens browser-based authentication via envio.dev with a 30-day session duration.

### Token-Based Login (CI/CD)

```bash
envio-cloud login --token ghp_YOUR_TOKEN
```

Or using an environment variable:

```bash
export ENVIO_GITHUB_TOKEN=ghp_YOUR_TOKEN
envio-cloud login
```

Required GitHub token scopes: `read:org`, `read:user`, `user:email`.

### Session Management

```bash
envio-cloud token    # Check current session
envio-cloud logout   # Remove credentials
```

## Commands

### Indexer Commands

#### List Indexers

```bash
envio-cloud indexer list
envio-cloud indexer list --org myorg
envio-cloud indexer list --limit 10
envio-cloud indexer list -o json
```

| Flag | Description |
|------|-------------|
| `--org` | Filter by organization |
| `--limit` | Limit number of results |
| `-o, --output` | Output format (`json`) |

#### Get Indexer Details

```bash
envio-cloud indexer get <name> <organisation>
envio-cloud indexer get hyperindex mjyoung114 -o json
```

#### Add an Indexer

```bash
envio-cloud indexer add --name my-indexer --repo my-repo
envio-cloud indexer add --name my-indexer --repo my-repo --branch main --tier development
envio-cloud indexer add --name my-indexer --repo my-repo --dry-run
```

| Flag | Description | Default |
|------|-------------|---------|
| `-n, --name` | Indexer name (required) | — |
| `-r, --repo` | Repository name (required) | — |
| `-b, --branch` | Deployment branch | `envio` |
| `-d, --root-dir` | Root directory | `./` |
| `-c, --config-file` | Config file path | `config.yaml` |
| `-t, --tier` | Pricing tier | `development` |
| `-a, --access-type` | Access type | `public` |
| `-e, --env-file` | Environment file | — |
| `--auto-deploy` | Enable auto-deploy | `true` |
| `--dry-run` | Preview without creating | — |
| `-y, --yes` | Skip confirmation prompts | — |

### Deployment Commands

#### Deployment Metrics

```bash
envio-cloud deployment metrics <indexer> <commit> <organisation>
envio-cloud deployment metrics hyperindex b3ead3a mjyoung114 --watch
envio-cloud deployment metrics hyperindex b3ead3a mjyoung114 -o json
```

No authentication required.

| Flag | Description |
|------|-------------|
| `--watch` | Continuously poll for updates |
| `-o, --output` | Output format (`json`) |

#### Deployment Status

```bash
envio-cloud deployment status <indexer> <commit> <organisation>
envio-cloud deployment status hyperindex b3ead3a mjyoung114 --watch-till-synced
```

| Flag | Description |
|------|-------------|
| `--watch-till-synced` | Wait until deployment is fully synced |

#### Deployment Info

```bash
envio-cloud deployment info <indexer> <commit> <organisation>
```

No authentication required.

#### Promote a Deployment

```bash
envio-cloud deployment promote <indexer> <commit> <organisation>
```

Requires authentication. Promotes a deployment to the production endpoint.

### Repository Commands

#### List Repositories

```bash
envio-cloud repos
envio-cloud repos -o json
```

Requires authentication.

## Global Flags

| Flag | Description |
|------|-------------|
| `-q, --quiet` | Suppress informational messages |
| `-o, --output` | Output format (`json`) |
| `--config` | Specify config file path |
| `-h, --help` | Display command help |
| `-v, --version` | Show CLI version |

## JSON Output

All commands support JSON output via the `-o json` flag, making the CLI easy to integrate into scripts and automation pipelines.

**Success response:**

```json
{"ok": true, "data": [ ... ]}
```

**Error response:**

```json
{"ok": false, "error": "error message"}
```

**Example with jq:**

```bash
# Get event count for a deployment
envio-cloud deployment metrics hyperindex b3ead3a mjyoung114 -o json | jq '.data[].num_events_processed'

# List all indexer IDs in an org
envio-cloud indexer list --org enviodev -o json | jq -r '.data[].indexer_id'
```

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | User error (invalid arguments, authentication required) |
| `2` | API or server error |

## Related Documentation

- **[Envio Cloud Overview](./hosted-service.md)** - Introduction to Envio Cloud
- **[Deploying Your Indexer](./hosted-service-deployment.md)** - Step-by-step deployment guide via the dashboard
- **[Monitoring](./hosted-service-monitoring.md)** - Dashboard monitoring and alerts
- **[Envio CLI](../Guides/cli-commands.md)** - Local development CLI reference
- **[npm package](https://www.npmjs.com/package/envio-cloud)** - Latest version and changelog
