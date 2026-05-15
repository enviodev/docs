---
id: solana
title: Solana
sidebar_label: Solana
slug: /solana
description: Experimental Solana support in HyperIndex. Supports Slot Handler, Effect API, and Envio Cloud.
---

> Experimental. Available since 3.0.0.  
> RPC-only source. HyperSync for Solana is not available yet; we’ll consider it if there’s demand.

## What’s supported

- [Slot Handler](/docs/HyperIndex/block-handlers)
- [Effect API](/docs/HyperIndex/effect-api)
- [Envio Cloud](/docs/HyperIndex/hosted-service)

## Quickstart

```bash
pnpx envio init svm
```

## Notes

- RPC-only data source (no HyperSync for Solana yet).
- Only `onSlot` handler is supported; log/instruction-level handlers are not available yet.
- Slot data is not fetched automatically; fetch by slot as needed using RPC or any other source.
- Tracks finalized slots only (no reorg support yet), resulting in **~20s latency**.
