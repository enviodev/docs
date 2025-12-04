---
id: org-setup
title: Organization Setup
sidebar_label: Org Setup
slug: /org-setup
description: Learn how to create an organization in the Envio hosted service and manage team members
---

# Organization Setup

This tutorial guides you through creating an organization in the Envio hosted service and adding team members to collaborate on your .projects

## Step 1: Access the Hosted Service

1.1. Navigate to [envio.dev](https://envio.dev)

1.2. Click the **Hosted Service** button in the top right corner

## Step 2: Log In with GitHub

2.1. Click the **"Login with Github"** button in the top right corner

2.2. After logging in, you'll be redirected to your hosted service page at `https://envio.dev/app/<your-github-username>`

## Step 3: Create a New Organization

3.1. Click the dropdown arrow next to your GitHub username in the top left corner

3.2. In the popup menu, click the **"Install App"** button next to **"+ Add new organisation"**

![Add New Organization Popup](/img/org-setup/add-new-organization-popup.png)

## Step 4: Install Envio Deployments App

4.1. You'll be redirected to the GitHub App installation page

4.2. Select your organization from the list

![Install Envio Deployments Page](/img/org-setup/install-envio-deployments-page.png)

4.3. On the next page, click **Install** to authorize the app

![Select Org and Install](/img/org-setup/select-org-install-page.png)

4.4. After installation, you'll be redirected to your organization's page in Envio

![Organization Page After Install](/img/org-setup/org-page-after-install.png)

## Step 5: Understanding Member Access

5.1. When other GitHub organization members try to access the organization page in Envio (by navigating to `https://envio.dev/app/<your-org-name>`), they'll see an error: **"You are not a member of the project"**

![Not a Member Error](/img/org-setup/not-a-member-error.png)

5.2. This occurs because the organization admin must explicitly add members through the Envio UI, even if they're already members of the GitHub organization

## Step 6: Adding Members to the Organization

6.1. Navigate to your organization page in the Envio hosted service

6.2. Click the **"Add Members"** button

![Add Members Button](/img/org-setup/add-members-button.png)

6.3. You'll see a list of all members in your GitHub organization

![Members List Page](/img/org-setup/members-list-page.png)

6.4. Click **"Add member"** next to each user you want to grant access to

6.5. Once added, these users can access the organization page and create indexers under the organization
