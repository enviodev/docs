---
id: solana
title: Solana
sidebar_label: Solana
slug: /solana
description: Experimental Solana support in HyperIndex. Supports Block Handler, Effect API, and Hosted Service.
---

> Experimental. Available since 3.0.0-alpha.3.  
> RPC-only source. HyperSync for Solana is not available yet; we’ll consider it if there’s demand.

## What’s supported

- [Block Handler](/docs/HyperIndex/block-handlers)
- [Effect API](/docs/HyperIndex/effect-api)
- [Hosted Service](/docs/HyperIndex/hosted-service)

## Quickstart

```bash
pnpx envio@3.0.0-alpha.13 init svm
```

## Notes

- RPC-only data source (no HyperSync for Solana yet).
- Only `onBlock` handler is supported; log/instruction-level handlers are not available yet.
- Block data is not fetched automatically; fetch by slot as needed using RPC or any other source.
- Tracks finalized blocks only (no reorg support yet), resulting in **~20s latency**.
