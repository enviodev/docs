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


## Security

*Availability: Paid plans only*

Control who can query your hosted GraphQL endpoint. Envio Cloud offers two complementary methods to restrict access to your indexer: **IP Whitelisting** and **API Key Authentication**. Use either independently or combine both for layered protection.

Security is configured **per indexer (project)**, not per deployment. This means your access rules carry over automatically when you promote a new version to production—no reconfiguration needed.

### IP Whitelisting

Restrict requests to specific IP addresses. Only clients connecting from an approved IP can query your indexer.

**Benefits:**
- Enhanced security for sensitive data
- Prevent unauthorized access
- Control API usage from specific sources
- Ideal for production environments with strict access requirements, such as server-to-server backends with stable IP addresses

### API Key Authentication

Protect your endpoint with an API key—a secret token that clients include with each request to prove they're authorized. This is the recommended option for browser-based dApps and frontends, where users connect from unpredictable IP addresses that can't be allow-listed.

**How it works:**
- Each indexer (project) gets a **unique API key**, automatically generated and securely stored
- Retrieve your API key from the deployment dashboard
- Include it with every request using the `Authorization` header as a Bearer token:

```bash
curl https://<your-endpoint>/v1/graphql \
  -H "Authorization: Bearer <your-api-key>"
```

Requests without a valid key are rejected with a `401 Unauthorized` response.

**Benefits:**
- Works for browser-based apps and frontends with no fixed IP address
- The same key persists across deployment promotions
- Both your production endpoint and per-deployment URLs are gated by the same policy—no way to bypass authentication
- Negligible added latency, validated in-process on every request


## Effect API Cache

*Availability: Medium plans and up*

Speed up your indexer deployments by caching [Effect API](/docs/v2/HyperIndex/effect-api) results. When enabled, new deployments will start with preloaded effect data, eliminating the need to re-fetch external data and significantly reducing sync time.

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
Learn more about the Effect API and how caching works in our [Effect API documentation](/docs/v2/HyperIndex/effect-api).
:::

:::info Version Requirement
This feature is only available for blockchain indexers deployed with version 2.26.0 or higher.
:::

## Built-in Alerts

*Availability: Paid plans only*

Stay informed about your indexer's health and performance with our integrated alerting system. Configure multiple notification channels and choose which alerts you want to receive.

:::info Version Requirement
This feature is only available for blockchain indexers deployed with version 2.24.0 or higher.
:::

### Notification Channels

Configure one or multiple notification channels to receive alerts:

- **Discord** 
- **Slack**
- **Telegram** 
- **Email** 

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