---
id: reorgs-support
title: Reorgs Support
sidebar_label: Reorgs Support
slug: /reorgs-support
---

:::note
This feature, while functional and stable, is not optimized. If you choose to have this feature enabled, please be aware that historical indexing may slow down. We want to ensure blazing-fast indexing and are currently working on improving this. 
:::

Chain reorganizations are handled automatically by HyperIndex, and are turned on by default. 

To turn this feature off, you can set the ```rollback_on_reorg``` flag in your config.yaml to ```false```:
```yaml
rollback_on_reorg: false
networks: ...
```

If you choose to have the feature enabled, the `rollback_on_reorg` flag in your `config.yaml` should be set to `true`:

Additionally, you can also manually configure the `confirmed_block_threshold` for a specific network:
```yaml
rollback_on_reorg: true
networks:
    - id: 137
      confirmed_block_threshold: 150
```

This threshold defines the number of blocks below the chain head where a block is considered "confirmed" and should not be subject to a reorg. Reorgs beyond this point won't trigger a rollback. Currently, all chains default to a threshold of 200 blocks, but this number will be tailored per chain in future releases.

Important notes regarding rollbacks and reorgs:
- Reorg detection is guaranteed when indexing from a [HyperSync](/docs/HyperIndex/Advanced/hypersync.md) as the data source. However, indexing from a [custom RPC](/docs/HyperIndex/Advanced/rpc-sync.md) as a data source may have edge cases where reorgs can occur undetected.
- All entities defined in your schema and set/read in your handlers will be managed and rolled back in the event of a reorg. However, any additional side effects or caching used in your handlers cannot be accounted for.


:::info
Before Envio version V2.1.2, handling chain reorgs were turned on by default. Conversely, it's ```true``` by default if the reorg feature is not explicitly turned off in the config.yaml. In V2.1.3 and onwards, chain reorgs for indexers generated using the [quickstart](/docs/HyperIndex/contract-import.md) will be turned off by default with the following flag `rollback_on_reorg: false`
:::

---
