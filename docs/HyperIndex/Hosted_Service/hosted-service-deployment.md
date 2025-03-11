---
id: hosted-service-deployment
title: Deploying Your Indexer
sidebar_label: Deploying
slug: /hosted-service-deployment
---

# Deploying Your Indexer

The Envio Hosted Service provides a seamless git-based deployment workflow, similar to modern platforms like Vercel. This enables you to easily deploy, update, and manage your indexers through your normal development workflow.

## Initial Setup

1. **Log in with GitHub**: Visit the [Envio App](https://envio.dev/app/login) and authenticate with your GitHub account
2. **Select an Organization**: Choose your personal account or any organization you have access to
   ![Select organisation](/img/hosted-service/select-org.webp)
3. **Install the Envio Deployments GitHub App**: Grant access to the repositories you want to deploy
   ![Install GitHub App](/img/hosted-service/install-github-app.webp)

## Configuring Your Indexer

1. **Add a New Indexer**: Click "Add Indexer" in the dashboard
   ![Add indexer](/img/hosted-service/add-indexer.webp)
2. **Connect to Repository**: Select the repository containing your indexer code
   ![Connect indexer](/img/hosted-service/connect-indexer.webp)
3. **Configure Deployment Settings**:
   - Specify the config file location
   - Set the root directory (important for monorepos)
   - Choose the deployment branch
     ![Configure indexer](/img/hosted-service/configure-indexer.webp)
     ![Add org](/img/hosted-service/deploy-indexer.webp)

:::tip
**Multiple Indexers Per Repository**

You can deploy multiple indexers from a single repository by configuring them with different:

- Config file paths
- Root directories
- Deployment branches
  :::

:::warning
**Monorepo Configuration**

If you're working in a monorepo, ensure all your imports are contained within your indexer directory to avoid deployment issues.
:::

## Deployment Workflow

1. **Create a Deployment Branch**: Set up the branch you specified during configuration
   ![Create branch](/img/hosted-service/checkout.webp)

2. **Deploy via Git**: Push your code to the deployment branch
   ![Push code](/img/hosted-service/push.webp)

3. **Monitor Deployment**: Track the progress of your deployment in the Envio dashboard

4. **Version Management**: Once deployed, you can:
   - View detailed logs
   - Switch between different deployed versions
   - Rollback to previous versions if needed

## Continuous Deployment Best Practices

For a robust deployment workflow, we recommend:

1. **Protected Branches**: Set up branch protection rules for your deployment branch
2. **Pull Request Workflow**: Instead of pushing directly to the deployment branch, use pull requests from feature branches
3. **CI Integration**: Add tests to your CI pipeline to validate indexer functionality before merging to the deployment branch

## Version Management

Each deployment creates a new version of your indexer that you can access through the dashboard. You can:

- Compare different versions
- Switch the active version with one click
- Maintain multiple versions for testing or staging purposes

## Deployment Limits

These can vary depending on the plan you select. In general, development plans are allowed:

- 3 indexers per organization
- 3 deployments per indexer

Need to free up space? You can delete old deployments through the Envio dashboard.

---
