---
id: hosted-service-monitoring
title: Monitoring Your Indexer
sidebar_label: Monitoring
slug: /hosted-service-monitoring
---

# Monitoring Your Blockchain Indexer

Once your blockchain indexer is deployed, the Envio Hosted Service provides several tools to help you monitor its health, performance, and progress.

## Dashboard Overview

The main dashboard provides real-time visibility into your indexer's status:

**Key Metrics Displayed:**
- **Active Deployments**: Track how many deployments are currently running (e.g., 1/3 active)
- **Deployment Status**: See whether your indexer is actively syncing, stopped, or has encountered errors
- **Recent Commits**: View your deployment history with commit information and active status
- **Usage Statistics**: Monitor your indexing hours, storage usage, and query rate limits
- **Network Progress**: Real-time progress bars showing sync status for each blockchain network
- **Events Processed**: Track the total number of events your indexer has processed
- **Historical Sync Time**: See how long it took to complete the initial sync

## Deployment Status Indicators

Each deployment shows clear status information:
- **Syncing**: Indexer is actively processing blocks and events
- **Syncing Stopped**: Indexer has stopped processing (may indicate an error or a breach of [plan limits](./hosted-service-deployment.md#development-plan-fair-usage-policy))
- **Historical Sync Complete**: Initial sync finished, indexer is processing new blocks in real-time

## Error Detection and Troubleshooting

When issues occur, the dashboard displays failure information to help you quickly diagnose problems.

**Failure Information Includes:**
- **Error Type**: Clear indication of the failure (e.g., "Indexing Has Stopped")
- **Error Description**: Details about what went wrong (e.g., "Error during event handling")
- **Next Steps**: Guidance on where to find more information (error logs)
- **Support Access**: Direct link to Discord for assistance

## Logging

_Full logging supported is integrated and configured by Envio via the Hosted Service_

Access detailed logs to troubleshoot issues and monitor indexer behavior:

- **Real-time Logs**: View live logs as your indexer processes events
- **Error Logs**: Quickly identify and diagnose errors in your event handlers
- **Deployment Logs**: Track the deployment process and startup sequence
- **Filter Log Levels**: Find specific log entries to debug issues

Access logs through the "Logs" button on your deployment page.

## Built-in Alerts

Configure proactive monitoring through the Alerts tab to receive notifications before issues impact your users:

- **Critical Alerts**: Get notified when your production endpoint goes down
- **Warning Alerts**: Receive alerts when your indexer stops processing blocks
- **Info Alerts**: Stay informed about indexer restarts and error logs
- **Deployment Notifications**: Know when historical sync completes

For detailed alert configuration, see the [Deployment Guide](./hosted-service-deployment.md#alerts-tab) and our [Features page](./hosted-service-features.md#built-in-alerts).

:::tip Proactive Monitoring
Set up multiple notification channels (**Paid Plans Only**) to ensure you never miss critical alerts about your indexer's health.
:::

## Visual Reference

### Dashboard Overview
![Dashboard Overview](/img/hosted-service/dashboard-overview.webp)

### Network Progress Bars
![Progress](/img/hosted-service/progress-bars.webp)

### Example Failure Notifications
![Dashboard Failures](/img/hosted-service/dashboard-failure.webp)
![Deployment Failure](/img/hosted-service/failure-image.webp)

## Related Documentation

- **[Deploying Your Indexer](./hosted-service-deployment.md)** - Complete deployment guide
- **[Features](./hosted-service-features.md)** - Learn about all available hosted service features
- **[Pricing & Billing](./hosted-service-billing.mdx)** - Compare plans and see feature availability

