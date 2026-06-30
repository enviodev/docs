---
id: historical-sync
title: Historical Sync
sidebar_label: Historical Sync
slug: /historical-sync
description: Learn how to optimize historical sync with HyperIndex for fast and efficient data retrieval.
---

# Historical Sync

Historical sync is an important aspect of maintaining and populating your database. Here's an overview of how historical sync works with HyperIndex:

## Optimized HyperSync Backend Nodes

- **Fast Retrieval**: Historical sync is fast when retrieving data from our optimized HyperSync backend nodes. These nodes are specifically designed to handle large amounts of historical data efficiently.

## RPC Endpoint Limitations

- **Slow Performance**: Unfortunately, historical sync for chains using RPC endpoints is not fast. The process is slower due to the limitations of RPC endpoints.
- **No Local Caching**: We do not have any form of local caching at the moment. This feature was disabled in a previous release due to stability concerns.

## Preload Optimization

- **Always on in V3**: Preload Optimization is enabled automatically in HyperIndex V3, with no flag to turn it on or off. It speeds up historical sync by batching the entity reads in your handlers into a small number of database queries, and by running external calls in parallel through the Effect API.
- **Biggest gains**: The benefit is largest when your handlers read and update the same entities frequently, or when they make external calls. For details on how it works and how to write handlers that take advantage of it, see [Preload Optimization](/docs/HyperIndex/preload-optimization).

By understanding these factors, you can better optimize the performance of your historical sync processes.
