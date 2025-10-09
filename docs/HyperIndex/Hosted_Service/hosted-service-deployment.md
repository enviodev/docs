---
id: hosted-service-deployment
title: Deploying Your Indexer
sidebar_label: Deploying
slug: /hosted-service-deployment
---

# Deploying Your Indexer

The Envio Hosted Service provides a seamless git-based deployment workflow, similar to modern platforms like Vercel. This enables you to easily deploy, update, and manage your indexers through your normal development workflow.

## Prerequisites & Important Information

Before deploying your indexer, please be aware of the following limits and policies:

### Deployment Limits
- **3 development tier indexers** per organization
- **Deployments per indexer**:
  - **Development tier (free)**: 3 deployments per indexer
  - **Production tiers (paid)**: 5 deployments per indexer
- Deployments can be deleted in the hosted service to make space for more deployments

### Development Tier Fair Usage Policy
The free development tier includes automatic deletion policies to ensure fair resource allocation:

**Automatic Deletion Rules:**
- **Hard Limits**: 
  - Deployments that exceed 20GB of storage will be automatically deleted
  - Deployments older than 30 days will be automatically deleted
- **Soft Limits**: 
  - 100,000 events processed OR 5GB storage used OR no requests for 7 days (whichever comes first)
  - When soft limits are breached, the two-stage deletion process begins

**Two-Stage Deletion Process:**
When your indexer breaches the soft limits:

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

## Continuous Deployment Best Practices

For a robust deployment workflow, we recommend:

1. **Protected Branches**: Set up branch protection rules for your deployment branch
2. **Pull Request Workflow**: Instead of pushing directly to the deployment branch, use pull requests from feature branches
3. **CI Integration**: Add tests to your CI pipeline to validate indexer functionality before merging to the deployment branch

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


## Related Documentation

- **[Features](./hosted-service-features.mdx)** - Learn about all available hosted service features
- **[Pricing & Billing](./hosted-service-billing.mdx)** - Compare tiers and see feature availability
- **[Overview](./hosted-service.md)** - Introduction to the hosted service
- **[Self-Hosting](./self-hosting.md)** - Run your indexer on your own infrastructure

---
