---
id: hosted-service-deployment
title: Deploying
sidebar_label: Deploying
slug: /hosted-service-deployment
---

## Deploying an indexer to the hosted service

1. [Login with GitHub](https://envio.dev/app/login)
1. Select an organisation or your personal GitHub user profile
   ![Select organisation](/img/hosted-service/select-org.webp)
1. Install the Envio Deployments GitHub app
   ![Install GitHub App](/img/hosted-service/install-github-app.webp)
1. Add & configure your indexer
   ![Add indexer](/img/hosted-service/add-indexer.webp)
   ![Connect indexer](/img/hosted-service/connect-indexer.webp)
1. TIP: You may have multiple indexers per repository, differentiated by the config file, root directory and/or the git release branch.
   ![Configure indexer](/img/hosted-service/configure-indexer.webp)
   ![add org](/img/hosted-service/deploy-indexer.webp)
1. Create a deployment branch
   ![add org](/img/hosted-service/checkout.webp)
1. Deploy your indexer via git
   ![add org](/img/hosted-service/push.webp)

> For subsequent releases, we strongly recommend setting branch protection rules that prevent direct pushes to your release branch. Instead, making pull requests from a feature branch into the release branch is recommended📓

## Deployment limits

Developers can deploy 3 indexers per organisation and 3 deployments per indexer. Deployments can be deleted in the hosted service to make space for more deployments.

---
