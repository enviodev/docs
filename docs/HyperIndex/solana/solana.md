---
id: solana
title: Solana
sidebar_label: Solana
slug: /solana
description: Experimental Solana support in HyperIndex (v3.alpha.3). RPC-only source. Supports Block Handler, Effect API, and Hosted Service.
---

> Experimental. Available since v3-alpha.3.  
> RPC-only source. HyperSync for Solana is not available yet; we’ll consider it if there’s demand.

## What’s supported

- [Block Handler](/docs/HyperIndex/Guides/block-handlers)
- [Effect API](/docs/HyperIndex/Guides/effect-api)
- [Hosted Service](/docs/HyperIndex/Guides/hosted-service)

## Quickstart

```bash
pnpx envio init solana
```

## Notes

- Uses RPC as the data source (no HyperSync for Solana yet).
- The Solana Block Handler doesn't automatically fetch the block data, so you have control over the way how you want to fetch the data by using the slot.
