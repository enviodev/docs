---
id: upgrading-envio
title: Upgrading Envio Version
sidebar_label: Upgrading Envio Version
slug: /upgrading-envio
---

# Upgrading Envio Version

This guide explains how to upgrade your Envio indexer to the latest version.

## Method 1: Using pnpm install (Recommended)

Install the latest stable version:

```bash
pnpm install envio@latest
```

## Method 2: Install a Specific Version

If the `latest` tag doesn't upgrade you to the most recent version, you can view all available versions and install a specific one.

First, view all available Envio versions:

```bash
pnpm view envio versions
```

This will show you all published versions. Look for the latest stable version (a version number without `alpha`, `beta`, or other pre-release tags, e.g., `2.30.2`).

Then install that specific version:

```bash
pnpm install envio@2.30.2
```

## Method 3: Update package.json Manually

You can also manually update the Envio version in your `package.json` file and then install:

1. Open your `package.json` file
2. Update the `envio` version in the `dependencies` section:

```json
"dependencies": {
  "envio": "2.30.2"
}
```

3. Run the install command:

```bash
pnpm install
```

## Verify Installation

After upgrading, you can check the installed Envio version:

```bash
pnpm envio --version
```

If the upgrade doesn't work or you encounter issues, try uninstalling and reinstalling Envio:

```bash
pnpm uninstall envio
```

Then reinstall using one of the methods above.

