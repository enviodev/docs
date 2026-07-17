---
title: Using ClickHouse Storage in HyperIndex V3
sidebar_label: Using ClickHouse Storage in HyperIndex V3
slug: /clickhouse-storage-hyperindex-v3
tags: ["tutorials"]
description: "HyperIndex V3 Alpha adds experimental ClickHouse Storage. Postgres stays primary, entity data mirrors to ClickHouse for analytics workloads on billions of onchain events."
image: /blog-assets/clickhouse-storage.png
authors: ["nikbhintade", "j_o_r_d_y_s"]
last_update:
  date: 2026-04-24
  author: Nikhil Bhintade
---

![Cover image for the ClickHouse Storage blog](/blog-assets/clickhouse-storage.png)


:::info TL;DR
- HyperIndex V3 Alpha adds experimental **ClickHouse Storage**, Postgres stays as the primary database, and your entity data is replicated to ClickHouse for analytics workloads.  
- ClickHouse is a columnar database built for heavy analytical queries on datasets in the 100s of GBs or TBs, a natural fit for onchain data, which can easily reach billions of events for a single token.  
- You can enable it on Envio Cloud by setting four environment variables: `ENVIO_CLICKHOUSE_HOST`, `ENVIO_CLICKHOUSE_DATABASE`, `ENVIO_CLICKHOUSE_USERNAME`, and `ENVIO_CLICKHOUSE_PASSWORD`.  
- Currently supported on the **Dedicated Plan** only, and you need to bring your own ClickHouse instance. Managed ClickHouse is coming to Envio Cloud, [**fill out this form**](https://forms.gle/P19S7KXYfdHQM8J69) if you want to be one of the first users. 
:::


## Why We Built ClickHouse Storage

Since day one, HyperIndex has used Postgres as its primary database. Postgres is battle-tested, runs well for small and large indexers alike, and gives you GraphQL out of the box through Hasura. It is a solid default for almost every indexer.

But over the last few months, enough teams have asked the same question that we knew we had to do something about it: **can we replicate the data to ClickHouse?**

Most teams asking were building on DEXes, or DeFi protocols where data volumes are large enough that even a well-tuned Postgres query to do analytics starts to slow down. That is exactly the workload ClickHouse is built for. So in HyperIndex V3, we shipped experimental ClickHouse Storage support.

V3 is in alpha at the time of writing, and ClickHouse Storage is flagged as experimental. Both will be marked stable once V3 reaches its stable launch, at which point you can use ClickHouse Storage in production without the experimental label. If you want to try ClickHouse on Envio Cloud today, [**fill out this form**](https://forms.gle/P19S7KXYfdHQM8J69), it is currently supported only on the Dedicated Plan.


## What is ClickHouse?

ClickHouse is a **columnar database** designed for analytical workloads. Most transactional databases, including Postgres, store data row by row, which is fast when you are reading or writing a single record by its primary key but slow when you are scanning millions of rows to compute an aggregate. A columnar database flips that around, values for each column are stored together on disk, so aggregations across billions of rows finish in seconds instead of minutes.

This matters a lot for blockchain data. For example, just USDC on Ethereum has hundreds of millions of **`Transfer`** events. Add in every other chain USDC is deployed on, and you cross into the billions. Now imagine you want to group those transfers by sender, bucket them by hour, and compute the sum per chain. A row store will struggle no matter how many indexes you throw at it. A columnar engine was built for exactly that kind of query.

Onchain data has three properties that make it a near-perfect match for ClickHouse:

- **Append-heavy** - once an event is emitted, it rarely changes.  
- **Highly structured** - every event of the same type has the same shape.  
- **Queried in aggregate** - most analytics questions are counts, sums, averages, or time-bucketed views, not single-row lookups.

If your indexer is powering a dashboard, a leaderboard, historical charts, or any kind of reporting layer on top of a large dataset, ClickHouse is the right tool for that read path. Postgres is still great for your day-to-day indexer writes and GraphQL reads, ClickHouse Storage just gives you a second surface that is optimised for the analytical side.

## How ClickHouse Storage Works in HyperIndex

HyperIndex runs two storage layers in parallel. Postgres remains the primary indexed state that your app queries through GraphQL. ClickHouse is a purpose-built analytics mirror, not a fallback. On every batch, events parsed by your handlers are flushed to both: Postgres gets the current state, ClickHouse gets the history.

ClickHouse Storage writes two things:

- **Entity history tables** - every change to every entity as an **`INSERT`**, tagged with a **`SET`** or **`DELETE`** action and a checkpoint ID linking it to a specific block. ClickHouse never receives an **`UPDATE`**, it is optimised for inserts, not mutation.  
- **Checkpoints table** - one row per processed block with block number, block hash, chain ID, and event count.

"Current state" is served by **views** that sit on top of the history table and select the latest **SET** row per entity ID. You get a full audit trail for free, and you can query state at any past block just by filtering on checkpoint ID.

Reorgs are handled by a single **`DELETE`** per table that removes all rows above the reorg checkpoint, the append only model makes rollbacks trivial, with no partial state to unwind. Schemas are auto-created on startup from your **`schema.graphql`**, with type mappings handled for you (`BigInt` → `Decimal`, `Date` → `DateTime64`, `enums` → `Enum8`/`Enum16`, and so on). No DDL to write.

Both backends are **restart- and reorg-resistant**, the checkpoints table lets the indexer resume cleanly after a crash, and Prometheus metrics carry a **`storage-name`** label so you can monitor Postgres and ClickHouse write paths separately.


:::info[Note]
During historical backfill, ClickHouse Storage does not store every intermediate entity change. If an entity is modified multiple times within a single batch, only the final state of that batch is written to ClickHouse. Once the indexer reaches the head and is processing live, every change is captured.
:::

:::warning[Warning]
Do not run multiple indexers writing to the same ClickHouse database at the same time.
:::

## **How to Enable ClickHouse on Envio Cloud**

To scaffold a new V3 alpha indexer, run:

```bash
pnpx envio init
```

This will set up a fresh project on the latest alpha release. Enable both storage backends in `config.yaml`:

```yaml
storage:
  postgres: true
  clickhouse: true
```

ClickHouse connection is configured via four environment variables, set them in your `.env` file for local development (`envio dev` will spin up a ClickHouse Docker container alongside), or from the Envio Cloud dashboard for hosted deployments:

| Variable | Description |
| ----- | ----- |
| `ENVIO_CLICKHOUSE_HOST` | The host of your ClickHouse instance. |
| `ENVIO_CLICKHOUSE_DATABASE` | The ClickHouse database to write into. |
| `ENVIO_CLICKHOUSE_USERNAME` | Username for the ClickHouse connection. |
| `ENVIO_CLICKHOUSE_PASSWORD` | Password for the ClickHouse connection. |

Once those are set, HyperIndex will replicate the same entity data it writes to Postgres into your ClickHouse database. Every entity in your `schema.graphql` becomes a ClickHouse table with a matching schema, so you can point your analytics queries, BI tools, or dashboards directly at ClickHouse, no extra ETL pipeline needed.

Postgres and GraphQL keep working exactly as they do today. ClickHouse Storage is additive: you get a second read-optimised surface without giving up the one you already have.

## Who Can Use ClickHouse Storage?

Right now, ClickHouse Storage is available on the **Dedicated Plan**, and you need to bring your own ClickHouse instance. If you are already running ClickHouse (or you are comfortable standing one up), you can plug it into your indexer today using the environment variables above.

We are also working on a managed ClickHouse offering on Envio Cloud so teams won't have to run their own instance. If you want to be one of the first users when that rolls out, [**fill out this form**](https://forms.gle/P19S7KXYfdHQM8J69). Tell us a bit about your indexer and the kind of analytics you are trying to run and we will get you onboarded. 

## **Get Started**

ClickHouse Storage is available today on the Dedicated Plan for teams running their own ClickHouse instance. For teams that want managed ClickHouse on Envio Cloud, fill out the waitlist form to be one of the first users when it rolls out.

- Envio docs: [https://docs.envio.dev/](https://docs.envio.dev/)  
- HyperIndex V3 migration guide: [https://docs.envio.dev/docs/HyperIndex/migrate-to-v3](https://docs.envio.dev/docs/HyperIndex/migrate-to-v3)  
- Managed ClickHouse waitlist: https://forms.gle/P19S7KXYfdHQM8J69  
- Discord: [https://discord.gg/envio](https://discord.gg/envio)  
- Telegram: [https://t.me/+BeS5ihVUFONjNGFk](https://t.me/+BeS5ihVUFONjNGFk)  
- Follow us on X: [https://x.com/envio\_indexer](https://x.com/envio_indexer)

## **Frequently Asked Questions**

### ClickHouse vs Postgres: When Should I Use Which?

Use Postgres for transactional reads, your GraphQL API, single-entity lookups, and anything latency-sensitive that your application serves directly to users. Use ClickHouse for analytical queries: large aggregations, time-bucketed views, leaderboards, historical charts, and BI dashboards. The rule of thumb is that if a query scans millions of rows to compute a result, it belongs on ClickHouse. If a query fetches a specific record by ID, it belongs on Postgres.

### Can I Use BI Tools Like Metabase, Superset, or Grafana With ClickHouse Storage?

Yes. Once ClickHouse Storage is running, your ClickHouse database is a standard ClickHouse instance as far as any external tool is concerned. Any tool with a ClickHouse connector (Metabase, Superset, Grafana, Tableau, Hex, Redash, and most others) can connect directly. Point it at the same host, database, and credentials you configured on Envio Cloud.

### Does ClickHouse Storage Slow Down My Indexer?

ClickHouse Storage writes in the same batches HyperIndex uses for Postgres, so there is some additional write work per batch. In practice, ClickHouse inserts are designed to be fast and writes are batched, so the overhead is small for most workloads. If you are seeing lag, the usual culprit is your ClickHouse instance's write capacity or network latency between the indexer and ClickHouse, not HyperIndex itself.

### How Do I Query Past State in ClickHouse?

Because the history tables store every change with a checkpoint ID tied to a specific block, you can reconstruct state at any historical point by filtering on checkpoint ID. This gives you time-travel queries for free, without needing snapshots or a separate archive. The latest-state views handle the "current state" case automatically, so you only reach for checkpoint filtering when you specifically want a past view.

### Can I Add Custom Tables or Indexes to My ClickHouse Database?

ClickHouse Storage manages its own tables based on your `schema.graphql` and will create them on startup. You can add your own tables, materialised views, or downstream aggregations in the same database alongside the managed tables, as long as you don't modify or collide with them. A common pattern is to build materialised views on top of the history tables to pre-aggregate heavy queries.

### What Happens If My ClickHouse Instance Goes Down?

Postgres and your GraphQL API keep serving as normal. ClickHouse Storage is additive, so a ClickHouse outage does not stop your indexer from processing events or serving queries from Postgres. Once ClickHouse is back, replication resumes from where it left off using the checkpoints table.

### Is There a Cost Difference Between Running With and Without ClickHouse Storage?

On Envio Cloud, ClickHouse Storage itself is available on the Dedicated Plan. The main cost consideration is your ClickHouse instance, you are bringing your own, so storage, compute, and egress costs depend on your provider (ClickHouse Cloud, self-hosted, Altinity, etc.) and the size of your dataset. Entity history tables grow faster than Postgres state tables because every change is stored rather than just the current value.

### Why Did Envio Build This Instead of Just Recommending an ETL Pipeline?

Running a separate ETL pipeline (CDC from Postgres to ClickHouse, a Kafka connector, a custom script) adds another system to maintain, another place for data to drift, and another source of lag. Building ClickHouse Storage into HyperIndex means entity data lands in ClickHouse as part of the same batch that writes to Postgres, with reorg handling and schema management already solved. One indexer, two read surfaces, no extra pipeline.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, plus analytics that keep up with your indexer, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+BeS5ihVUFONjNGFk) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA)
