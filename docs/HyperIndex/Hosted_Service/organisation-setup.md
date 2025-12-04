---
id: organisation-setup
title: Organization Setup
sidebar_label: Organisation Setup
slug: /organisation-setup
description: Learn how to create an organization in the Envio hosted service and manage team members
---

# Organisation Setup

Use this guide to set up an organization in the Envio hosted service and grant access to your team.

---

## Creating an Organization

To create a new organization, open the Envio hosted service at **https://envio.dev** and log in with GitHub. In the top-left menu, select **+ Add new organisation**. This action redirects you to GitHub, where you can install the **Envio Deployments** app for the relevant GitHub organization.

<div style={{textAlign: 'center'}}>

![Add New Organization Popup](/img/org-setup/add-new-organization-popup.png)

</div>

On GitHub, choose the organization you want to enable and complete the installation. Once approved, GitHub returns you to the new organization's page in the hosted service UI.

<div style={{display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
  <div style={{flex: '1', minWidth: '300px', maxWidth: '500px'}}>
    <img src="/img/org-setup/install-envio-deployments-page.png" alt="Install Envio Deployments Page" style={{width: '100%', height: 'auto'}} />
  </div>
  <div style={{flex: '1', minWidth: '300px', maxWidth: '500px'}}>
    <img src="/img/org-setup/select-org-install-page.png" alt="Select Org and Install" style={{width: '100%', height: 'auto'}} />
  </div>
</div>

---

## Access Control

Being a member of the GitHub organization **does not** automatically grant access to the organization in the Envio hosted service UI. Each member must be explicitly added by the organization admin. If someone attempts to visit the organization URL (e.g., `https://envio.dev/app/<org-name>`) without being added, they'll see a "You are not a member of the project" message.

<div style={{textAlign: 'center'}}>

![Not a Member Error](/img/org-setup/not-a-member-error.png)

</div>

---

## Adding Members

The organization admin must add members from the organization page in Envio. Open the **Add Members** view to see all users associated with your GitHub organization, then grant access by selecting **Add member** next to each person.

<div style={{textAlign: 'center'}}>

![Add Members Button](/img/org-setup/add-members-button.png)

</div>

<div style={{textAlign: 'center'}}>

![Members List Page](/img/org-setup/members-list-page.png)

</div>

Once added, members should be able to access the organization's page in the hosted service UI and start creating projects!

---