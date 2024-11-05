---
id: overview
title: Overview
sidebar_label: Overview
slug: /overview
---

<!-- TODO-update: num of chains needs to be updated regularly -->

HyperSync is a highly specialized data node built in Rust aimed at massively improving data retrieval speeds while also providing flexibility. It serves as a real-time, accelerated data query layer with a low-level API that can be used via Python, Rust, NodeJs or Go clients. 
HyperSync supports more than [70+ EVM](/docs/HyperIndex/hypersync) chains and Fuel, and we are rapidly adding new networks. 

HyperSync is an ideal solution for indexers, block explorers, data analysts, bridges, and other applications or use cases focused on performance.

Easily analyze things like:
- Every ERC20 `Transfer` event for _any address_ on Base.
- Every tx `to` or `from` a specific address.
- Which address has spent the most on `gas` in the last 10k blocks?
- Plus many more, it's built to be extremely flexible and performant.

HyperSync can be thought of as a more performant and efficient data source alternative than JSON-RPC. Retrieve millions of blocks, logs, transactions, and traces on multiple chains in seconds.

E.g. In 10 seconds HyperSync can:

- Scan 200 m blocks on the Arbitrum;
- Retrieve and decode every `PoolCreated` log emitted by the Uniswap v3 Factory.
- That's 20 million  blocks per second.

Think of it as a "1000x speed-up" alternative to RPC. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/iu_469ELotw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

```python
import hypersync
from hypersync import (
    LogSelection,
    LogField,
    DataType,
    FieldSelection,
    ColumnMapping,
    TransactionField,
)
import asyncio


async def collect_events():
    # choose network
    client = hypersync.HypersyncClient(
        hypersync.ClientConfig(
            url="https://arbitrum.hypersync.xyz",
            # use secret bearer token for access
            # See https://docs.envio.dev/docs/HyperSync/api-tokens
            bearer_token="ea52c5da-4114-42ec-82df-8e73baad52ef",
        )
    )

    query = hypersync.Query(
        from_block=0,
        logs=[
            LogSelection(
                address=[
                    "0x1F98431c8aD98523631AE4a59f267346ea31F984"
                ],  # uniswap factory
                topics=[
                    [
                        "0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7118"
                    ]
                ],  # PoolCreated log
            )
        ],
        field_selection=FieldSelection(
            log=[
                LogField.TOPIC0,
                LogField.TOPIC1,
                LogField.TOPIC2,
                LogField.TOPIC3,
                LogField.DATA,
                LogField.TRANSACTION_HASH,
            ],
            transaction=[
                TransactionField.BLOCK_NUMBER,
            ],
        ),
    )

    config = hypersync.StreamConfig(
        hex_output=hypersync.HexOutput.PREFIXED,
        event_signature="PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)",
    )

    await client.collect_parquet("data", query, config)


asyncio.run(collect_events())
```

:::note
Docs under construction! We appreciate your patience until we get there. Until then, we are happy to answer all questions in our [Discord](https://discord.gg/Q9qt8gZ2fX).
:::

---
