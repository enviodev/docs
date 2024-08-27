---
id: overview
title: Overview
sidebar_label: Overview
slug: /overview
---

<!-- TODO-update: num of chains needs to be updated regularily -->

HyperSync is highly specialized data node built in rust aimed at massively improving data retrieval speeds while also providing flexiblity. It can be used via Python, Rust or NodeJs clients and supports more than [45 EVM](/docs/HyperIndex/hypersync) chains and Fuel.

It is an ideal solution for indexers, block explorers, data analysts, bridges and other applications or usecases relying on on-chain information and focused on performance. Do things like:

- Get me every ERC20 Transfer event for _any address_ on Base.
- Get me every tx to or from a specific address.
- Which address has spent the most on gas in the last 10k blocks.
- Plus many more, its built to be extremely flexible and performant.

It can be thought of as ">100x-1000x speed up" alternative to using a JSON-RPC for retrival of logs, blocks, transactions and traces.

<iframe width="560" height="315" src="https://www.youtube.com/embed/iu_469ELotw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

E.g. In 10 seconds HyperSync can:

- Scan 200m blocks on the Arbitrum network and;
- Retrieve and decode every PoolCreated log emitted by the Uniswap v3 Factory.
- Thats 20m blocks per second.

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

> ### Disclaimer
>
> - Docs under construction!
> - We appreciate your patience until we get there. Until then, we are happy to answer all questions in our [Discord](https://discord.gg/Q9qt8gZ2fX).

---
