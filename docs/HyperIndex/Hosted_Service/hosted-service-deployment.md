---
id: hosted-service-deployment
title: Deploying
sidebar_label: Deploying
slug: /hosted-service-deployment
---

## Deploying an indexer to the hosted service

1. [Login with GitHub](https://envio.dev/app/login)
1. Add an organisation or your personal GitHub user profile
   ![add org](/img/hosted-service/add-org.jpg)
1. Connect the Envio Deployments GitHub app to an organisation
   ![add org](/img/hosted-service/connect-org.jpg)
1. Add & configure your indexer
   ![add org](/img/hosted-service/add-indexer.jpg)
   ![add org](/img/hosted-service/connect-indexer.jpg)
1. Create a unique name for your indexer based on your specifications. This name must be unique for the repository. You may have multiple indexers per repository, differentiated by the config file, root directory and/or the git release branch.
   ![add org](/img/hosted-service/configure-indexer.jpg)
   ![add org](/img/hosted-service/deploy-indexer.jpg)
1. Create a deployment branch
   ![add org](/img/hosted-service/checkout.jpg)
1. Deploy your indexer via git
   ![add org](/img/hosted-service/push.jpg)

> For subsequent releases, we strongly recommend setting branch protection rules that prevent direct pushes to your release branch. Instead, making pull requests from a feature branch into the release branch is recommended📓

## Deployment limits

Developers can deploy 3 indexers per organisation and 3 deployments per indexer. Deployments can be deleted in the hosted service to make space for more deployments.

---
