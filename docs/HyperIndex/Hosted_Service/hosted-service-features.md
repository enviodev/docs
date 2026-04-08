---
id: hosted-service-features
title: Features
sidebar_label: Features
slug: /hosted-service-features
---

# Envio Cloud Features

Envio Cloud includes several production-ready features to help you manage and secure your blockchain indexer deployments.

:::info Plan Availability
Most features listed on this page are available for **paid production plans only**. The free development plan has limited features and is designed for testing and development purposes. [View our pricing plans](./hosted-service-billing.mdx) to see what's included in each plan.
:::


## Deployment Tags

Organize and identify your deployments with custom key/value tags. Tags help you categorize deployments by environment, project, team, or any custom attribute that fits your workflow.

**How it works:**
- Add up to **5 custom tags** per deployment via the deployment overview page
- Each tag consists of a **key** (max 20 characters) and a **value** (max 20 characters, automatically lowercased)
- Click "+ Add Tag" to create new tags, or click existing tags to edit or delete them

**Special `name` Tag:**

The `name` tag has special behavior—when set, its value is displayed directly on the deployment list, making it easy to identify deployments at a glance without navigating into each one.

**Example Use Cases:**
- `name: staging` or `name: production` — quickly identify deployment purpose
- `env: staging` / `env: production` — categorize by environment
- `team: frontend` — organize by team ownership
- `version: v2` — track deployment versions

**Benefits:**
- Quickly identify deployments in the list view
- Organize deployments across multiple projects or environments
- Add context and metadata to your deployments
- Filter and locate deployments more efficiently


## IP Whitelisting

*Availability: Paid plans only*

Control access to your indexer by restricting requests to specific IP addresses. This security feature helps protect your data and ensures only authorized clients can query your indexer.

**Benefits:**
- Enhanced security for sensitive data
- Prevent unauthorized access
- Control API usage from specific sources
- Ideal for production environments with strict access requirements


## Effect API Cache

*Availability: Medium plans and up*

Speed up your indexer deployments by caching [Effect API](/docs/HyperIndex/effect-api) results. When enabled, new deployments will start with preloaded effect data, eliminating the need to re-fetch external data and significantly reducing sync time.

**How it works:**
1. **Save a Cache**: From any deployment, click "Save Cache" to capture the current effect data
2. **Configure Settings**: Navigate to Settings > Cache to manage your caches
3. **Enable Caching**: Toggle caching on and select which cache to use for new deployments
4. **Deploy**: New deployments will automatically restore from the selected cache

**Key Features:**
- **Quick Save**: Save cache directly from the deployment page with one click
- **Cache Management**: View, select, and delete caches from the Cache settings page
- **Automatic Restore**: New deployments preload effect data from the active cache
- **Download Cache**: Download caches for local development, enabling faster iteration without re-fetching external data


**Benefits:**
- Dramatically faster deployment sync times
- Reduced external API calls during indexing
- Seamless deployment updates with preserved effect state

:::tip
Learn more about the Effect API and how caching works in our [Effect API documentation](/docs/HyperIndex/effect-api).
:::

:::info Version Requirement
This feature is only available for blockchain indexers deployed with version 2.26.0 or higher.
:::

## Built-in Alerts

*Availability: Paid plans only*

Stay informed about your indexer's health and performance with our integrated alerting system. Configure multiple notification channels and choose which alerts you want to receive.

:::info Version Requirement
This feature is only available for indexers deployed with version 2.24.0 or higher.
:::

### Notification Channels

Configure one or multiple notification channels to receive alerts:

- **Discord** 
- **Slack**
- **Telegram** 
- **Email** 

## Monitoring

:::info Version Requirement
This feature is only available for indexers deployed with version 3.0.0 or higher.
:::

Monitor your indexer's performance and health using standard Prometheus metrics. Metrics are exposed at your deployment's endpoint under `/hyperindex/metrics`, making it easy to integrate with your existing monitoring stack (Prometheus, Grafana, Datadog, etc.).

**Endpoint:**
```
<your-endpoint-url>/hyperindex/metrics
```

### Available Metrics

#### Progress & Sync Status

| Metric | Type | Description |
|--------|------|-------------|
| `envio_progress_block` | gauge | Latest block number processed and stored in the database. Labeled by `chainId`. |
| `envio_progress_events` | gauge | Number of events processed and reflected in the database. Labeled by `chainId`. |
| `envio_progress_ready` | gauge | Whether the chain is fully synced to the head (`1` = synced). Labeled by `chainId`. |

#### Event Processing

| Metric | Type | Description |
|--------|------|-------------|
| `envio_processing_seconds` | counter | Cumulative time spent executing event handlers during batch processing. |
| `envio_processing_handler_seconds` | counter | Cumulative time spent inside individual event handler executions. Labeled by `contract` and `event`. |
| `envio_processing_handler_total` | counter | Total number of individual event handler executions. Labeled by `contract` and `event`. |
| `envio_processing_max_batch_size` | gauge | Maximum number of items to process in a single batch. |

#### Entity Preloading

| Metric | Type | Description |
|--------|------|-------------|
| `envio_preload_seconds` | counter | Cumulative time spent preloading entities during batch processing. |
| `envio_preload_handler_seconds` | counter | Wall-clock time spent inside individual preload handler executions. Labeled by `contract` and `event`. |
| `envio_preload_handler_seconds_total` | counter | Cumulative time spent in preload handlers (can exceed wall-clock time due to parallel execution). Labeled by `contract` and `event`. |
| `envio_preload_handler_total` | counter | Total number of individual preload handler executions. Labeled by `contract` and `event`. |

#### Storage

| Metric | Type | Description |
|--------|------|-------------|
| `envio_storage_write_seconds` | counter | Cumulative time spent writing batch data to storage. |
| `envio_storage_write_total` | counter | Total number of batch writes to storage. |
| `envio_storage_load_seconds` | counter | Time spent loading data from storage. Labeled by `operation`. |
| `envio_storage_load_total` | counter | Number of successful storage load operations. Labeled by `operation`. |
| `envio_storage_load_size` | counter | Cumulative number of records loaded from storage. Labeled by `operation`. |

#### Data Source & Fetching

| Metric | Type | Description |
|--------|------|-------------|
| `envio_fetching_block_range_seconds` | counter | Cumulative time spent fetching block ranges. Labeled by `chainId`. |
| `envio_fetching_block_range_total` | counter | Total number of block range fetch operations. Labeled by `chainId`. |
| `envio_fetching_block_range_events_total` | counter | Cumulative number of events fetched across all block range operations. Labeled by `chainId`. |
| `envio_fetching_block_range_size` | counter | Cumulative number of blocks covered across all fetch operations. Labeled by `chainId`. |
| `envio_source_request_total` | counter | Number of requests made to data sources. Labeled by `source`, `chainId`, and `method`. |
| `envio_source_known_height` | gauge | Latest known block number reported by the data source. Labeled by `source` and `chainId`. |

#### Indexing Pipeline

| Metric | Type | Description |
|--------|------|-------------|
| `envio_indexing_known_height` | gauge | Latest known block number reported by the active indexing source. Labeled by `chainId`. |
| `envio_indexing_concurrency` | gauge | Number of executing concurrent queries to the chain data source. Labeled by `chainId`. |
| `envio_indexing_max_concurrency` | gauge | Maximum number of concurrent queries allowed. Labeled by `chainId`. |
| `envio_indexing_buffer_size` | gauge | Current number of items in the indexing buffer. Labeled by `chainId`. |
| `envio_indexing_buffer_block` | gauge | Highest block number fully fetched by the indexer. Labeled by `chainId`. |
| `envio_indexing_idle_seconds` | counter | Time the indexer source syncing has been idle. A high value may indicate a bottleneck. Labeled by `chainId`. |
| `envio_indexing_partitions` | gauge | Number of partitions used to split fetching logic. Labeled by `chainId`. |
| `envio_indexing_addresses` | gauge | Number of addresses indexed on chain (static and dynamic). Labeled by `chainId`. |

#### Reorgs & Rollbacks

| Metric | Type | Description |
|--------|------|-------------|
| `envio_reorg_detected_total` | counter | Total number of reorgs detected. |
| `envio_reorg_detected_block` | gauge | Block number where a reorg was last detected. |
| `envio_reorg_threshold` | gauge | Whether indexing is currently within the reorg threshold. |
| `envio_rollback_enabled` | gauge | Whether rollback on reorg is enabled. |
| `envio_rollback_total` | counter | Number of successful rollbacks on reorg. |
| `envio_rollback_seconds` | counter | Total time spent on rollbacks. |
| `envio_rollback_events` | counter | Number of events rolled back on reorg. |

#### Effect API

| Metric | Type | Description |
|--------|------|-------------|
| `envio_effect_call_seconds` | counter | Processing time taken to call the Effect function. Labeled by `effect`. |
| `envio_effect_call_total` | counter | Cumulative number of resolved Effect function calls. Labeled by `effect`. |
| `envio_effect_active_calls` | gauge | Number of Effect function calls currently running. Labeled by `effect`. |
| `envio_effect_cache` | gauge | Number of items in the effect cache. Labeled by `effect`. |
| `envio_effect_queue` | gauge | Number of effect calls waiting in the rate limit queue. |

#### System Info

| Metric | Type | Description |
|--------|------|-------------|
| `envio_info` | gauge | Information about the indexer. Labeled by `version`. |
| `envio_process_start_time_seconds` | gauge | Start time of the process since Unix epoch in seconds. |

### Example: Scraping with Prometheus

Add the following to your `prometheus.yml` to scrape your indexer's metrics:

```yaml
scrape_configs:
  - job_name: "envio-indexer"
    metrics_path: "/hyperindex/metrics"
    static_configs:
      - targets: ["<your-endpoint-host>"]
```

### Example: Key Metrics to Watch

- **`envio_progress_ready`** and **`hyperindex_synced_to_head`** — confirm your indexer is caught up to the chain head
- **`envio_progress_block`** — track indexing progress over time
- **`envio_processing_handler_seconds`** — identify slow event handlers by contract and event
- **`envio_indexing_idle_seconds`** — a high value may indicate the data source sync is a bottleneck
- **`envio_reorg_detected_total`** — monitor for chain reorganizations

## Zero-Downtime Deployments

Update your blockchain indexer without any service interruption using our seamless deployment system with static production endpoints.

**How it works:**
- Deploy new versions alongside your current deployment
- Each indexer gets a **static production endpoint** that remains consistent
- Use 'Promote to Production' to instantly route the static endpoint to any deployment
- All requests to your static production endpoint are automatically routed to the promoted deployment
- Maintain API availability throughout upgrades with no endpoint changes required

**Key Features:**
- **Static Production Endpoint**: Consistent URL that never changes, regardless of which deployment is active
- **Instant Switching**: Promote any deployment to production with zero downtime
- **Rollback Capabilities**: Quickly switch back to previous deployments if needed
- **Seamless Updates**: Your applications continue working without any configuration changes


## Deployment Location Choice

:::info Coming Soon!
Full support for cross-region deployments is in active development. If you require a deployment to be based in the USA please contact us through our support channel on discord.
:::

*Availability: Dedicated plans only*

Choose your primary deployment region to optimize performance and meet compliance requirements.

**Available Regions:**
- **USA** 
- **EU** 

**Benefits:**
- Reduced latency for your target users
- Data residency compliance support
- Custom infrastructure configurations
- Dedicated infrastructure resources

## Direct Database Access

*Availability: Dedicated plans only*

Access your indexed data directly through SQL queries, providing flexibility beyond the standard GraphQL endpoint.

**Use Cases:**
- Complex analytical queries
- Custom data exports
- Advanced reporting and dashboards
- Integration with external analytics tools

## Powerful Analytics Solution

*Availability: Dedicated plans only (additional cost)*

A comprehensive analytics platform that automatically pipes your indexed data from PostgreSQL into ClickHouse (approximately 2 minutes behind real-time) and provides access through a hosted Metabase instance.

**Technical Architecture:**
- **Data Pipeline**: Automatic replication from PostgreSQL to ClickHouse
- **Near Real-time**: Data available in an analytics platform within ~2 minutes
- **Frontend**: Hosted Metabase instance for visualization and analysis
- **Performance**: ClickHouse optimized for analytical queries on large datasets

**Capabilities:**
- Interactive, customizable dashboards through Metabase
- Variety of visualization options (charts, graphs, tables, maps)
- Fast analytical queries on large datasets via ClickHouse
- Ad-hoc SQL queries for data exploration
- Automated alerts based on data thresholds
- Team collaboration and report sharing
- Export capabilities for further analysis

:::tip
For deployment instructions and limits, see our [Deployment Guide](./hosted-service-deployment.md). For pricing and feature availability by plan, see our [Billing & Pricing page](./hosted-service-billing.mdx).
:::