---
id: hosted-service-features
title: Features
sidebar_label: Features
slug: /hosted-service-features
---

# Hosted Service Features

Our hosted service includes several production-ready features to help you manage and secure your indexer deployments.

:::info Plan Availability
Most features listed on this page are available for **paid production plans only**. The free development tier has limited features and is designed for testing and development purposes. [View our pricing tiers](./hosted-service-billing.mdx) to see what's included in each plan.
:::


## IP/Domain Whitelisting
:::info Coming Soon!
Full support for whitelisting is in active development
:::
Control access to your indexer by restricting requests to specific IP addresses or domains. This security feature helps protect your data and ensures only authorized clients can query your indexer.

**Benefits:**
- Enhanced security for sensitive data
- Prevent unauthorized access
- Control API usage from specific sources
- Ideal for production environments with strict access requirements

**Technical Implementation:**
- **IP Whitelisting**: Full IP address validation and blocking
- **Domain Whitelisting**: Best-effort domain validation using SNI (Server Name Indication) checking
- Domain filtering does not involve mutual TLS (mTLS) or client certificate validation

:::info Domain Whitelisting Limitations
Domain whitelisting relies on SNI checking and may not provide the same level of security as IP whitelisting. For maximum security, consider using IP whitelisting when possible.
:::

## Built-in Alerts

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
### Alert Types

**Critical Alerts:**
- **Production Endpoint Down** - Triggered when your production endpoint stops responding to GraphQL requests

**Warning Alerts:**
- **Indexer Stopped Processing** - Triggered when the indexer is not processing blocks for more than 10 minutes

**Info Alerts:**
- **Indexer Error Logs** - Triggered when indexer generates error logs indicating potential issues

### Notification Types

**Deployment Notifications:**
- **Historical Sync Complete** - Get notified when any deployment has completed its historical sync

:::tip Future Updates
More alert types and notification types will be added in future updates. You can request specific alert types in the Envio Discord community.
:::

## Zero-Downtime Deployments

Update your indexer without any service interruption using our seamless deployment system with static production endpoints.

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
Full support for cross region deployments is in active development. If you require a deployment to be based in the USA please contact us through our support channel on discord.
:::

**Available on: Dedicated plans only**

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

**Available on: Dedicated plans only**

Access your indexed data directly through SQL queries, providing flexibility beyond the standard GraphQL endpoint.

**Use Cases:**
- Complex analytical queries
- Custom data exports
- Advanced reporting and dashboards
- Integration with external analytics tools

## Powerful Analytics Solution

**Available on: Dedicated plans only (additional cost)**

A comprehensive analytics platform that automatically pipes your indexed data from PostgreSQL into ClickHouse (approximately 2 minutes behind real-time) and provides access through a hosted Metabase instance.

**Technical Architecture:**
- **Data Pipeline**: Automatic replication from PostgreSQL to ClickHouse
- **Near Real-time**: Data available in analytics platform within ~2 minutes
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
For deployment instructions and limits, see our [Deployment Guide](./hosted-service-deployment.md). For pricing and feature availability by tier, see our [Billing & Pricing page](./hosted-service-billing.mdx).
:::

