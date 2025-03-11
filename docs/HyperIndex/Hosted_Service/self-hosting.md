---
id: self-hosting
title: Self-Hosting Guide
sidebar_label: Self-Hosting
slug: /self-hosting
---

# Self-Hosting Your Envio Indexer

:::info
This documentation page is actively being improved. Check back regularly for updates and additional information.
:::

While Envio offers a fully managed [Hosted Service](./hosted-service.md), you may prefer to run your indexer on your own infrastructure. This guide covers everything you need to know about self-hosting Envio indexers.

:::note
We deeply appreciate users who choose our hosted service, as it directly supports our team and helps us continue developing and improving Envio's technology. If your use case allows for it, please consider the hosted option.
:::

## Why Self-Host?

Self-hosting gives you:

- **Complete Control**: Manage your own infrastructure and configurations
- **Data Sovereignty**: Keep all indexed data within your own systems

## Prerequisites

Before self-hosting, ensure you have:

- Docker installed on your host machine
- Sufficient storage for blockchain data and the indexer database
- Adequate CPU and memory resources (requirements vary based on chains and indexing complexity)
- Required HyperSync and/or RPC endpoints

## Getting Started

In general, if you want to self-host, you will likely use a Docker setup.

The following is a `docker-compose.yaml` example showing how the Envio service, PostgreSQL database, and Hasura GraphQL engine can be configured together:

```yaml
services:
  envio-postgres:
    image: postgres:16
    restart: always
    ports:
      - "${ENVIO_PG_PORT:-5433}:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${ENVIO_POSTGRES_PASSWORD:-testing}
      POSTGRES_USER: ${ENVIO_PG_USER:-postgres}
      POSTGRES_DB: ${ENVIO_PG_DATABASE:-envio-dev}
    networks:
      - my-proxy-net

  graphql-engine:
    image: hasura/graphql-engine:v2.23.0
    ports:
      - "${HASURA_EXTERNAL_PORT:-8080}:8080"
    user: 1001:1001
    depends_on:
      - "envio-postgres"
    restart: always
    environment:
      HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:${ENVIO_POSTGRES_PASSWORD:-testing}@envio-postgres:5432/envio-dev
      HASURA_GRAPHQL_ENABLE_CONSOLE: ${HASURA_GRAPHQL_ENABLE_CONSOLE:-true}
      HASURA_GRAPHQL_ENABLED_LOG_TYPES:
        startup, http-log, webhook-log, websocket-log,
        query-log
      HASURA_GRAPHQL_NO_OF_RETRIES: 10
      HASURA_GRAPHQL_ADMIN_SECRET: ${HASURA_GRAPHQL_ADMIN_SECRET:-testing}
      HASURA_GRAPHQL_STRINGIFY_NUMERIC_TYPES: "true"
      PORT: 8080
      HASURA_GRAPHQL_UNAUTHORIZED_ROLE: public
    healthcheck:
      test: timeout 1s bash -c ':> /dev/tcp/127.0.0.1/8080' || exit 1
      interval: 5s
      timeout: 2s
      retries: 50
      start_period: 5s
    networks:
      - my-proxy-net

  envio-indexer:
    container_name: envio-indexer
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8081:8081"
    depends_on:
      graphql-engine:
        condition: service_healthy
    deploy:
      resources:
        limits:
          cpus: "0.8" # Limit to 80% of 1 CPU (800m)
          memory: 800M # Conservative limit, can be increased if needed
    restart: always
    environment:
      ENVIO_POSTGRES_PASSWORD: ${ENVIO_POSTGRES_PASSWORD:-testing}
      ENVIO_PG_HOST: envio-postgres
      ENVIO_PG_PORT: 5432
      ENVIO_PG_USER: ${ENVIO_PG_USER:-postgres}
      ENVIO_PG_DATABASE: ${ENVIO_PG_DATABASE:-envio-dev}
      PG_PASSWORD: ${ENVIO_POSTGRES_PASSWORD:-testing}
      PG_HOST: envio-postgres
      PG_PORT: 5432
      PG_USER: ${ENVIO_PG_USER:-postgres}
      PG_DATABASE: ${ENVIO_PG_DATABASE:-envio-dev}
      CONFIG_FILE: ${CONFIG_FILE:-config.yaml}
      LOG_LEVEL: ${LOG_LEVEL:-trace}
      LOG_STRATEGY: ${LOG_STRATEGY:-console-pretty}
      MAX_QUEUE_SIZE: 50000
      MAX_BATCH_SIZE: 10000
      # These variables can be skipped if Hasura is not necessary
      HASURA_GRAPHQL_ENDPOINT: http://graphql-engine:8080/v1/metadata
      HASURA_GRAPHQL_ADMIN_SECRET: ${HASURA_GRAPHQL_ADMIN_SECRET:-testing}
      HASURA_SERVICE_HOST: graphql-engine
      HASURA_SERVICE_PORT: 8080
      TUI_OFF: ${TUI_OFF:-true}
    healthcheck:
      test: timeout 1s bash -c ':> /dev/tcp/127.0.0.1/8080' || exit 1
      interval: 5s
      timeout: 2s
      retries: 50
      start_period: 5s
    networks:
      - my-proxy-net

volumes:
  db_data:

networks:
  my-proxy-net:
    name: local_test_network
```

## Configuration Explained

This Docker Compose setup includes three main services:

1. **PostgreSQL Database** (`envio-postgres`): Stores your indexed data
2. **Hasura GraphQL Engine** (`graphql-engine`): Provides the GraphQL API for querying your data
3. **Envio Indexer** (`envio-indexer`): The core indexing service that processes blockchain data

### Environment Variables

The configuration uses environment variables with sensible defaults. For production, you should customize:

- Database credentials (`ENVIO_POSTGRES_PASSWORD`, `ENVIO_PG_USER`, etc.)
- Hasura admin secret (`HASURA_GRAPHQL_ADMIN_SECRET`)
- Resource limits based on your workload requirements

## Getting Help

If you encounter issues with self-hosting:

- Check the [Envio GitHub repository](https://github.com/enviodev/hyperindex) for known issues
- Join the [Envio Discord community](https://discord.gg/envio) for community support

:::tip
For most production use cases, we recommend using the [Envio Hosted Service](./hosted-service.md) to benefit from automatic scaling, monitoring, and maintenance.
:::
