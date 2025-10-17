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

### Loaders and Historical Sync

- **Improved Speed**: Using loaders can improve the speed of historical sync. However, the effectiveness of loaders varies:
  - **Entity Reuse**: Loaders are more beneficial when the same entities are frequently reused and updated.
  - **Performance Impact**: For many indexes, the performance difference with loaders is not very large. Loaders are not highly important unless performance is of the utmost importance.

### Future Improvements (v2)

- **preHandlers**: In version 2, we are restructuring the way loaders work into pre-handlers. This change will make loading entities before the handler in batches more ergonomic using preHandler functions, further enhancing the performance and ease of use for historical sync.

By understanding these factors, you can better optimize the performance of your historical sync processes.
