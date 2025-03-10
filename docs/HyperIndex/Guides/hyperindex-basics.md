---
id: hyperindex-basics
title: HyperIndex Basics
sidebar_label: HyperIndex Basics
slug: /hyperindex-basics
---

HyperIndex indexers require three main files to run. These files are automatically generated when you initialize your indexer using:

```bash
pnpx envio init
```

---

## 📁 Required Files

The essential files needed to run HyperIndex are:

- **Configuration file:** (`config.yaml`) – Defines indexing settings, such as blockchain details and events to index.
- **GraphQL Schema:** (`schema.graphql`) – Describes the data structure for querying indexed data.
- **Event Handlers:** (`src/EventHandlers.*`) – Contains logic for processing blockchain events, automatically generated based on your chosen programming language.

> **Note:** The exact file extension for Event Handlers (`*.ts`, `*.js`, `*.res`) depends on the language you selected (TypeScript, JavaScript, or ReScript).

---

## 🚀 Next Steps

For step-by-step instructions on setting up your indexer quickly, refer to the [Quickstart guide](../contract-import.md).

---
