---
id: hosted-service-deployment
title: Deploying Your Indexer
sidebar_label: Deploying
slug: /hosted-service-deployment
---

# Deploying Your Indexer

The Envio Hosted Service provides a seamless git-based deployment workflow, similar to modern platforms like Vercel. This enables you to easily deploy, update, and manage your indexers through your normal development workflow.

## Prerequisites & Important Information

### Requirements

- **Version Support**: Deployment on the Hosted Service requires at least version `2.6.0`. 
Additionally the following versions are not supported: 
  - `2.29.x`
- **PNPM Support**: deployment must be compatible with pnpm version `9.10.0`
- **Package.json**: the `package.json` file must be present and include the above two requirements.
- **Configuration file**: a HyperIndex configuration file must be present (the name can be set in the [indexer settings](#configure-your-indexer))
- **Github Repository**: The repository must be no larger than `100MB`

Before deploying your indexer, please be aware of the following limits and policies:

### Deployment Limits
- **3 development tier indexers** per organization
- **Deployments per indexer**:  3 deployments per indexer
- Deployments can be deleted in the hosted service to make space for more deployments

### Development Tier Fair Usage Policy
The free development tier includes automatic deletion policies to ensure fair resource allocation:

**Automatic Deletion Rules:**
- **Hard Limits**: 
  - Deployments that exceed 20GB of storage will be automatically deleted
  - Deployments older than 30 days will be automatically deleted
- **Soft Limits** (whichever comes first): 
  - 100,000 events processed
  - 5GB storage used 
  - no requests for 7 days 

**When soft limits are breached, the two-stage deletion process begins**

**Two-Stage Deletion Process:**

_Applies to development deployments that breach the soft limits_

1. **Grace Period (7 days)** - Your indexer continues to function normally, you receive notification about the upcoming deletion
2. **Read-Only Access (3 days)** - Indexer stops processing new data, existing data remains accessible for queries  
3. **Full Deletion** - Indexer and all data are permanently deleted

:::warning Timeline Subject to Change
The grace period durations (7 + 3 days) are subject to change. Always monitor your deployment status and upgrade when approaching limits.
:::

:::tip
For complete pricing details and feature comparison, see our [Pricing & Billing page](./hosted-service-billing.mdx).
:::

## Step-by-Step Deployment Instructions

### Initial Setup

1. **Log in with GitHub**: Visit the [Envio App](https://envio.dev/app/login) and authenticate with your GitHub account
2. **Select an Organization**: Choose your personal account or any organization you have access to
3. **Install the Envio Deployments GitHub App**: Grant access to the repositories you want to deploy

### Configure Your Indexer

4. **Add a New Indexer**: Click "Add Indexer" in the dashboard
5. **Connect to Repository**: Select the repository containing your indexer code
6. **Configure Deployment Settings**:
   - Specify the config file location
   - Set the root directory (important for monorepos)
   - Choose the deployment branch

:::tip Multiple Indexers Per Repository
You can deploy multiple indexers from a single repository by configuring them with different config file paths, root directories, and/or deployment branches.
:::

:::warning Monorepo Configuration
If you're working in a monorepo, ensure all your imports are contained within your indexer directory to avoid deployment issues.
:::

### Deploy Your Code

7. **Create a Deployment Branch**: Set up the branch you specified during configuration
8. **Deploy via Git**: Push your code to the deployment branch
9. **Monitor Deployment**: Track the progress of your deployment in the Envio dashboard

### Manage Your Deployment

10. **Version Management**: Once deployed, you can:
    - View detailed logs
    - Switch between different deployed versions
    - Rollback to previous versions if needed


## Monitoring

Once your indexer is deployed, you can monitor its health, performance, and progress using several built-in tools including the dashboard, logs, and alerts.

For detailed information about monitoring your deployments, see our **[Monitoring Guide](./hosted-service-monitoring.md)**.

## Continuous Deployment Best Practices and Configuration

For a robust deployment workflow, we recommend:

1. **Protected Branches**: Set up branch protection rules for your deployment branch
2. **Pull Request Workflow**: Instead of pushing directly to the deployment branch, use pull requests from feature branches
3. **CI Integration**: Add tests to your CI pipeline to validate indexer functionality before merging to the deployment branch


### Continous Configuration 

After deploying your indexer, you can manage its configuration through several tabs in the Envio dashboard:

#### General Tab

The General tab provides core configuration options:

- **Config File Path**: Update the location of your indexer's configuration file
- **Deployment Branch**: Change which Git branch triggers deployments
- **Root Directory**: Modify the root directory for your indexer (useful for monorepos)
- **Delete Indexer**: Permanently remove the indexer and all its deployments

:::warning Deleting an Indexer
Deleting an indexer is permanent and will remove all associated deployments and data. This action cannot be undone.
:::

#### Environment Variables Tab

Configure environment-specific variables for your indexer:

- Add custom environment variables with the `ENVIO_` prefix
- Environment variables are securely stored and injected into your indexer at runtime
- Useful for API keys, configuration values, and other deployment-specific settings

:::tip Environment Variable Best Practices
Use environment variables for sensitive data rather than hardcoding values in your repository. Remember to prefix all variables with `ENVIO_`.
:::

#### Plans & Billing Tab

Manage your indexer's pricing tier and billing:

- Select from available pricing plans
- Upgrade your plan to suit your needs
- View current plan features and limits

For detailed pricing information, see our [Pricing & Billing page](./hosted-service-billing.mdx).

#### Alerts Tab

Configure monitoring and notification preferences:

- Set up notification channels (Discord, Slack, Telegram, Email)
- Choose which alert types to receive (Production Endpoint Down, Indexer Stopped Processing, etc.)
- Configure deployment notifications (Historical Sync Complete)

For complete alert configuration details, see our [Features page](./hosted-service-features.md#built-in-alerts).

:::info Alert Availability
Alert configuration is available for indexers deployed with version 2.24.0 or higher on paid production plans.
:::

## Visual Reference Guide

The following screenshots show each step of the deployment process:

### Step 2: Select Organization
![Select organisation](/img/hosted-service/select-org.webp)

### Step 3: Install GitHub App
![Install GitHub App](/img/hosted-service/install-github-app.webp)

### Step 4: Add New Indexer
![Add indexer](/img/hosted-service/add-indexer.webp)

### Step 5: Connect to Repository
![Connect indexer](/img/hosted-service/connect-indexer.webp)

### Step 6: Configure Deployment Settings
![Configure indexer](/img/hosted-service/configure-indexer.webp)
![Deploy indexer](/img/hosted-service/deploy-indexer.webp)

### Step 7: Create Deployment Branch
![Create branch](/img/hosted-service/checkout.webp)

### Step 8: Deploy via Git
![Push code](/img/hosted-service/push.webp)

### Step 9: Monitoring
Full details available in our **[Monitoring Guide](./hosted-service-monitoring.md)**.

### Step 10: Continuous Configuration
![Configure indexer](/img/hosted-service/config-tabs.webp)


## Related Documentation

- **[Features](./hosted-service-features.mdx)** - Learn about all available hosted service features
- **[Pricing & Billing](./hosted-service-billing.mdx)** - Compare tiers and see feature availability
- **[Overview](./hosted-service.md)** - Introduction to the hosted service
- **[Self-Hosting](./self-hosting.md)** - Run your indexer on your own infrastructure

---
