---
id: running-locally
title: Running The Indexer Locally
sidebar_label: Running The Indexer Locally
slug: /running-locally
---

## Starting the Indexer

Remember to `cd` into your project directory if you have defined one during `pnpx envio@latest init`.

Before running the Envio CLI command to start the indexer locally, please make sure you have [Docker](https://www.docker.com/products/docker-desktop/) running.

Run the indexer

```bash
pnpm envio dev
```

This will automatically open up the Hasura dashboard where you can view the data that has been indexed.

Admin-secret / password for local Hasura is `testing`.

## Stopping the Indexer

To delete the docker images used for the local development environment, run

```bash
pnpm envio stop
```

## What next?

Once you have successfully run the indexer locally, you can deploy the indexer onto Envio's [hosted service](./hosted-service).
---
