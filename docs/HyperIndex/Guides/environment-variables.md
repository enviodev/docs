---
id: environment-variables
title: Environment Variables
sidebar_label: Environment Variables
slug: /environment-variables
---

# Environment Variables

Environment variables are a crucial part of configuring your Envio indexer. They allow you to manage sensitive information and configuration settings without hardcoding them in your codebase.

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

- `ENVIO_API_TOKEN`: API token for HyperSync access (required for continued access in self-hosted deployments)
- `ENVIO_HASURA`: Set to `false` to disable Hasura integration for self-hosted indexers

- `MAX_BATCH_SIZE`: Size of the in-memory batch before writing to the database. Default: `5000`. Set to `1` to help isolate which event or data save is causing Postgres write errors.

- `ENVIO_PG_PORT`: Port for the Postgres service used by HyperIndex during local development
- `ENVIO_PG_PASSWORD`: Postgres password (self-hosted)
- `ENVIO_PG_USER`: Postgres username (self-hosted)
- `ENVIO_PG_DATABASE`: Postgres database name (self-hosted)
- `ENVIO_PG_PUBLIC_SCHEMA`: Postgres schema name override for the generated/public schema

## Example Environment Variables

Here are some commonly used environment variables:

```bash
# Envio API Token (required for continued HyperSync access)
ENVIO_API_TOKEN=your-secret-token

# Blockchain RPC URL
ENVIO_RPC_URL=https://arbitrum.direct.dev/your-api-key

# Starting block number for indexing
ENVIO_START_BLOCK=12345678

# Coingecko API key
ENVIO_COINGECKO_API_KEY=api-key

# In-memory batch size (default 5000)
MAX_BATCH_SIZE=1
```

## Setting Environment Variables

### Local Development

For local development, you can set environment variables in several ways:

1. Using a `.env` file in your project root:

```bash
# .env
ENVIO_API_TOKEN=your-secret-token
ENVIO_RPC_URL=https://arbitrum.direct.dev/your-api-key
ENVIO_START_BLOCK=12345678
```

2. Directly in your terminal:

```bash
export ENVIO_API_TOKEN=your-secret-token
export ENVIO_RPC_URL=https://arbitrum.direct.dev/your-api-key
```

### Hosted Service

When using the Envio Hosted Service, you can configure environment variables through the Envio platform's dashboard. Remember that all variables must still be prefixed with `ENVIO_`.

For more information about environment variables in the hosted service, see the [Hosted Service documentation](../HyperIndex/hosted-service).

## Configuration File

For use of environment variables in your configuration file, read the docs here: [Configuration File](../HyperIndex/configuration-file).

## Best Practices

1. **Never commit sensitive values**: Always use environment variables for sensitive information like API keys and database credentials
1. **Never commit or use private keys**: Never commit or use private keys in your codebase
1. **Use descriptive names**: Make your environment variable names clear and descriptive
1. **Document your variables**: Keep a list of required environment variables in your project's README
1. **Use different values**: Use different environment variables for development, staging, and production environments
1. **Validate required variables**: Check that all required environment variables are set before starting your indexer

## Troubleshooting

If you encounter issues with environment variables:

1. Verify that all required variables are set
2. Check that variables are prefixed with `ENVIO_`
3. Ensure there are no typos in variable names
4. Confirm that the values are correctly formatted

For more help, see our [Troubleshooting Guide](../HyperIndex/logging).
