---
id: environment-variables
title: Environment Variables
sidebar_label: Environment Variables
slug: /environment-variables
description: Learn how to configure and manage Envio environment variables for your blockchain indexer.
---

# Environment Variables

Environment variables are a crucial part of configuring your Envio blockchain indexer. They allow you to manage sensitive information and configuration settings without hardcoding them in your codebase.

## Naming Convention

All environment variables used by Envio must be prefixed with `ENVIO_`. This naming convention:

- Prevents conflicts with other environment variables
- Makes it clear which variables are used by the Envio indexer
- Ensures consistency across different environments

## Envio API Token (required for HyperSync)

To ensure continued access to HyperSync, set an Envio API token in your environment.

- Use `ENVIO_API_TOKEN` to provide your token at runtime
- See the API Tokens guide for how to generate a token: [API Tokens](/docs/HyperSync/api-tokens)

## Envio-specific environment variables

The following variables are used by HyperIndex:

- `ENVIO_API_TOKEN`: API token for HyperSync access (required when indexing via HyperSync — get one at [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens))
- `ENVIO_HASURA`: Set to `false` to disable Hasura integration for self-hosted blockchain indexers
- `ENVIO_TUI`: Set to `false` to disable the terminal UI (replaces the V2 `TUI_OFF=true` flag; the TUI is also auto-disabled in CI and under AI agents)

- `ENVIO_PG_PORT`: Port for the Postgres service used by HyperIndex during local development
- `ENVIO_PG_PASSWORD`: Postgres password (self-hosted)
- `ENVIO_PG_USER`: Postgres username (self-hosted)
- `ENVIO_PG_DATABASE`: Postgres database name (self-hosted)
- `ENVIO_PG_SCHEMA`: Postgres schema name override for the generated/public schema (replaces `ENVIO_PG_PUBLIC_SCHEMA`; the old name is still accepted until v4)

:::note
The V2 variables `MAX_BATCH_SIZE`, `ENVIO_INDEXING_BLOCK_LAG`, `UNORDERED_MULTICHAIN_MODE`, and `UNSTABLE__TEMP_UNORDERED_HEAD_MODE` have been removed in V3. Use the `full_batch_size` config option in `config.yaml` instead of `MAX_BATCH_SIZE`, and use the per-chain `block_lag` option instead of `ENVIO_INDEXING_BLOCK_LAG`. Unordered multichain processing is now the default.
:::

## Example Environment Variables

Here are some commonly used environment variables:

```bash
# Envio API Token (required for HyperSync access)
ENVIO_API_TOKEN=your-secret-token

# Blockchain RPC URL
ENVIO_RPC_URL=https://arbitrum.direct.dev/your-api-key

# Coingecko API key
ENVIO_COINGECKO_API_KEY=api-key

# Disable the terminal UI
ENVIO_TUI=false
```

## Setting Environment Variables

### Local Development

For local development, you can set environment variables in several ways:

1. Using a `.env` file in your project root:

```bash
# .env
ENVIO_API_TOKEN=your-secret-token
ENVIO_RPC_URL=https://arbitrum.direct.dev/your-api-key
```

2. Directly in your terminal:

```bash
export ENVIO_API_TOKEN=your-secret-token
export ENVIO_RPC_URL=https://arbitrum.direct.dev/your-api-key
```

### Envio Cloud

When using Envio Cloud, you can configure environment variables through the Envio platform's dashboard. Remember that all variables must still be prefixed with `ENVIO_`.

For more information about environment variables in Envio Cloud, see the [Envio Cloud documentation](../HyperIndex/hosted-service).

## Configuration File

For use of environment variables in your configuration file, read the docs here: [Configuration File](../HyperIndex/configuration-file).

## Best Practices

1. **Never commit sensitive values**: Always use environment variables for sensitive information like API keys and database credentials
1. **Never commit or use private keys**: Never commit or use private keys in your codebase
1. **Use descriptive names**: Make your environment variable names clear and descriptive
1. **Document your variables**: Keep a list of required environment variables in your project's README
1. **Use different values**: Use different environment variables for development, staging, and production environments
1. **Validate required variables**: Check that all required environment variables are set before starting your blockchain indexer

## Troubleshooting

If you encounter issues with environment variables:

1. Verify that all required variables are set
2. Check that variables are prefixed with `ENVIO_`
3. Ensure there are no typos in variable names
4. Confirm that the values are correctly formatted

For more help, see our [Troubleshooting Guide](../HyperIndex/logging).
