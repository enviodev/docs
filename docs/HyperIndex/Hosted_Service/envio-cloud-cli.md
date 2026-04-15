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

## Shell Completion

The `envio-cloud` CLI ships with shell completion scripts for `bash`, `zsh`, `fish`, and `powershell`. Completion includes dynamic suggestions for **indexer names** and **commit hashes**, so you can tab-complete them directly from the terminal.

Run the one-liner for your shell to install completions:

| Shell | One-liner |
|-------|-----------|
| `zsh` | `echo 'source <(envio-cloud completion zsh)' >> ~/.zshrc` |
| `bash` | `envio-cloud completion bash > ~/.local/share/bash-completion/completions/envio-cloud` |
| `fish` | `envio-cloud completion fish > ~/.config/fish/completions/envio-cloud.fish` |
| `powershell` | `envio-cloud completion powershell >> $PROFILE` |

Restart your shell (or `source` your profile) for the completions to take effect. Run `envio-cloud completion --help` for further options.

## Authentication

### Browser Login

```bash
envio-cloud login
```

Opens browser-based authentication via envio.dev with a 30-day session duration. Tokens are automatically refreshed when expired.

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

## Context Management

Like `kubectl` namespaces, `envio-cloud` lets you store default values for organisation and indexer so you don't have to pass them on every command. Flags (`--org`, `--indexer`) always override stored context.

```bash
# Set defaults
envio-cloud config set-org myorg
envio-cloud config set-indexer myindexer

# View current context
envio-cloud config get-context

# Commands now use defaults automatically
envio-cloud deployment status abc1234          # org and indexer from context
envio-cloud indexer settings get               # both from context

# Flags override context
envio-cloud deployment status abc1234 --org other-org

# Clear stored context
envio-cloud config clear
```

Context is stored at `~/.envio-cloud/context.json`. Resolution priority:

1. Explicit positional arguments
2. `--org` / `--indexer` flags
3. Stored context
4. GitHub login (organisation only)

| Command | Description |
|---------|-------------|
| `config set-org <org>` | Set default organisation |
| `config set-indexer <indexer>` | Set default indexer |
| `config get-context` | Show current defaults and where they come from |
| `config clear` | Remove all stored defaults |

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
envio-cloud indexer get <name> [organisation]
envio-cloud indexer get hyperindex mjyoung114 -o json
envio-cloud indexer get hyperindex --org mjyoung114
```

Organisation can be omitted if set via context.

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

#### Delete an Indexer

Permanently delete an indexer and **all** of its deployments. Requires typing the indexer name to confirm.

```bash
envio-cloud indexer delete myindexer myorg
envio-cloud indexer delete myindexer --org myorg
envio-cloud indexer delete myindexer myorg --yes   # skip confirmation for CI/CD
```

:::danger
This action cannot be undone. All deployments, data, and configuration for the indexer will be permanently removed.
:::

#### View and Modify Settings

```bash
# View current settings
envio-cloud indexer settings get myindexer myorg

# Modify settings (only specified flags are changed)
envio-cloud indexer settings set myindexer myorg --branch main
envio-cloud indexer settings set myindexer myorg --auto-deploy=false
envio-cloud indexer settings set myindexer myorg --config-file config.yaml --branch develop
```

| Flag (set) | Description |
|------------|-------------|
| `--branch` | Git branch for deployments |
| `--config-file` | Path to config file |
| `--root-dir` | Root directory within the repository |
| `--auto-deploy` | Enable or disable auto-deploy on push |
| `--description` | Indexer description |
| `--access-type` | `public` or `private` |

#### Manage Environment Variables

Environment variables can be managed from the CLI. All keys must be prefixed with `ENVIO_`. Changes take effect on the next deployment.

```bash
# List variables (values masked by default)
envio-cloud indexer env list myindexer myorg
envio-cloud indexer env list myindexer myorg --show-values

# Set one or more variables
envio-cloud indexer env set myindexer myorg ENVIO_API_KEY=abc123 ENVIO_DEBUG=true

# Remove a variable
envio-cloud indexer env delete myindexer myorg ENVIO_DEBUG

# Bulk import from a .env file
envio-cloud indexer env import myindexer myorg --file .env
```

The `.env` file format is one `KEY=VALUE` per line. Lines starting with `#` are ignored.

#### Configure IP Whitelisting

Restrict access to your indexer's GraphQL endpoint by IP address. Supports IPv4 addresses and CIDR notation.

```bash
# View current IP whitelist configuration
envio-cloud indexer security get myindexer myorg

# Add IPs to the whitelist
envio-cloud indexer security add-ip myindexer myorg 203.0.113.50
envio-cloud indexer security add-ip myindexer myorg 10.0.0.0/8

# Enable IP whitelisting (make sure to add IPs first)
envio-cloud indexer security enable myindexer myorg

# Disable IP whitelisting
envio-cloud indexer security disable myindexer myorg

# Restrict whitelisting to production deployments only
envio-cloud indexer security set-prod-only myindexer myorg true

# Remove an IP
envio-cloud indexer security remove-ip myindexer myorg 203.0.113.50
```

:::tip
Add your IP addresses **before** enabling whitelisting — otherwise you may lock yourself out. The CLI will warn you if you try to enable whitelisting with no IPs configured.
:::

### Deployment Commands

All deployment commands accept arguments as `<indexer> <commit> [organisation]`. Organisation and indexer can be omitted if set via `envio-cloud config`.

#### Deployment Metrics

```bash
envio-cloud deployment metrics <indexer> <commit> [organisation]
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
envio-cloud deployment status <indexer> <commit> [organisation]
envio-cloud deployment status hyperindex b3ead3a mjyoung114 --watch-till-synced
```

| Flag | Description |
|------|-------------|
| `--watch-till-synced` | Wait until deployment is fully synced |

#### Deployment Info

```bash
envio-cloud deployment info <indexer> <commit> [organisation]
```

#### Promote a Deployment

Promote a deployment to the production endpoint. Requires confirmation (`y/N`).

```bash
envio-cloud deployment promote <indexer> <commit> [organisation]
envio-cloud deployment promote myindexer abc1234 myorg --yes
```

#### Delete a Deployment

Permanently delete a deployment. Requires typing the indexer name to confirm.

```bash
envio-cloud deployment delete <indexer> <commit> [organisation]
envio-cloud deployment delete myindexer abc1234 myorg --yes
```

:::danger
This action cannot be undone. The deployment and its data will be permanently removed.
:::

#### Restart a Deployment

Restart a running deployment. There is a 10-minute cooldown between restarts.

```bash
envio-cloud deployment restart <indexer> <commit> [organisation]
envio-cloud deployment restart myindexer abc1234 myorg --yes
```

#### Deployment Logs

Show build or runtime logs for a deployment.

```bash
envio-cloud deployment logs <indexer> <commit> [organisation]
envio-cloud deployment logs myindexer abc1234 myorg --build
envio-cloud deployment logs myindexer abc1234 myorg --level error,warn
envio-cloud deployment logs myindexer abc1234 myorg --follow
```

| Flag | Description |
|------|-------------|
| `--build` | Show build logs instead of runtime logs |
| `--level` | Filter by log level (e.g., `error,warn`) |
| `--limit` | Max number of log lines (default: 100) |
| `--follow` | Poll for new logs every 10 seconds |

### Repository Commands

#### List Repositories

```bash
envio-cloud repos
envio-cloud repos -o json
```

Requires authentication.

## Confirmation Prompts

Dangerous commands require confirmation before executing:

| Command | Confirmation type |
|---------|-------------------|
| `indexer delete` | Type the indexer name |
| `deployment delete` | Type the indexer name |
| `deployment promote` | y/N prompt |
| `deployment restart` | y/N prompt |

All prompts can be skipped with the `--yes` / `-y` flag for CI/CD usage.

## Global Flags

| Flag | Description |
|------|-------------|
| `--org` | Override default organisation |
| `--indexer` | Override default indexer |
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
- **[Production Features](./hosted-service-features.md)** - Tags, IP whitelisting, caching, and alerts
- **[Monitoring](./hosted-service-monitoring.md)** - Dashboard monitoring and alerts
- **[Envio CLI](../Guides/cli-commands.md)** - Local development CLI reference
- **[npm package](https://www.npmjs.com/package/envio-cloud)** - Latest version and changelog
