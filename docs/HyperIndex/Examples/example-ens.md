---
id: example-ens
title: ENS Indexer
sidebar_label: ENS Indexer
slug: /example-ens
---

# ENS Indexer

This [repo](https://github.com/JasoonS/Envio-ENS-Indexer) contains an Envio indexer template built using TypeScript for indexing events from the ENS (Ethereum Name Service) contracts.

The indexer has been built using v0.0.37 of Envio.

## Steps to run the indexer

1. Clone the [repo](https://github.com/JasoonS/Envio-ENS-Indexer)
2. Install any other pre-requisite packages for Envio listed [here](https://docs.envio.dev/docs/installation#prerequisites)
3. Install with `pnpm i`
4. Generate indexing code via `pnpm envio codegen`
5. Run the indexer via `pnpm envio dev` (make sure you have Docker running)
6. Stop the indexer via `pnpm envio stop`
