---
id: hyperfuel
title: HyperFuel
sidebar_label: Overview
slug: /hyperfuel
---

HyperSync is a high performance database and accelerated data query layer that powers Envio’s Indexing framework (HyperIndex) for 100x faster data retrieval than standard RPC methods. 

HyperFuel is Hypersync adapted for the [Fuel network](https://fuel.network/) and is exposed as a low-level API for developers and data analysts to create niche, flexible, high-speed queries for all on-chain data. 

Users can interact with the HyperFuel in Rust, Python client, Node Js, or Json api to extract data into parquet files, arrow format, or as typed data.  Client examples below.

Using HyperFuel, application developers can easily sync and search large datasets in a few minutes.

HyperFuel supports Fuel's testnet.

You can integrate with HyperFuel using any of our clients:
 - Rust: https://github.com/enviodev/hyperfuel-client-rust
 - Python: https://github.com/enviodev/hyperfuel-client-python
 - Nodejs: https://github.com/enviodev/hyperfuel-client-node
 - json api: https://github.com/enviodev/hyperfuel-json-api


## Example usage
Below is an example of a Hyperfuel query in each of our clients searching the first 1,300,000 blocks for all `input` objects of a specific `asset-id`.  This example returns 10,543 inputs in around 100ms - not including latency.


## Rust ([repo](https://github.com/enviodev/hyperfuel-client-rust/tree/main/examples/asset-id))
```rust 
use std::num::NonZeroU64;

use hyperfuel_client::{Client, Config};
use hyperfuel_net_types::Query;
use url::Url;

#[tokio::main]
async fn main() {
    let client_config = Config {
        url: Url::parse("https://fuel-testnet.hypersync.xyz").unwrap(),
        bearer_token: None,
        http_req_timeout_millis: NonZeroU64::new(30000).unwrap(),
    };
    let client = Client::new(client_config).unwrap();

    // Construct query in json.  Can also construct it as a typed struct (see predicate-root example)
    let query: Query = serde_json::from_value(serde_json::json!({
        // start query from block 0
        "from_block": 0,
        // if to_block is not set, query runs to the end of the chain
        "to_block":   1300000,
        // load inputs that have `asset_id` = 0x2a0d0ed9d2217ec7f32dcd9a1902ce2a66d68437aeff84e3a3cc8bebee0d2eea
        "inputs": [
            {
            "asset_id": ["0x2a0d0ed9d2217ec7f32dcd9a1902ce2a66d68437aeff84e3a3cc8bebee0d2eea"]
            }
        ],
        // fields we want returned from loaded inputs
        "field_selection": {
            "input": [
                "tx_id",
                "block_height",
                "input_type",
                "utxo_id",
                "owner",
                "amount",
                "asset_id"
            ]
        }
    }))
    .unwrap();

    let res = client.get_selected_data(&query).await.unwrap();

    println!("inputs: {:?}", res.data.inputs);
}

```

## Python ([repo](https://github.com/enviodev/hyperfuel-client-python/blob/main/examples/asset-id.py))
```python
import hyperfuel
from hyperfuel import InputField
import asyncio

async def main():
    client = hyperfuel.HyperfuelClient()

    query = hyperfuel.Query(
        # start query from block 0
        from_block=0,
        # if to_block is not set, query runs to the end of the chain
        to_block = 1300000, 
        # load inputs that have `asset_id` = 0x2a0d0ed9d2217ec7f32dcd9a1902ce2a66d68437aeff84e3a3cc8bebee0d2eea
        inputs=[
            hyperfuel.InputSelection(
                asset_id=["0x2a0d0ed9d2217ec7f32dcd9a1902ce2a66d68437aeff84e3a3cc8bebee0d2eea"]
            )
        ],
        # what data we want returned from the inputs we loaded
        field_selection=hyperfuel.FieldSelection(
            input=[
                InputField.TX_ID,
                InputField.BLOCK_HEIGHT,
                InputField.INPUT_TYPE,
                InputField.UTXO_ID,
                InputField.OWNER,
                InputField.AMOUNT,
                InputField.ASSET_ID,
            ]
        )
    )

    res = await client.get_selected_data(query)

    print("inputs: " + str(res.data.inputs))

asyncio.run(main())

```

## Node Js ([repo](https://github.com/enviodev/hyperfuel-client-node/tree/main/examples/asset-id))
```js
import { HyperfuelClient, Query } from "@envio-dev/hyperfuel-client";

async function main() {
  const client = HyperfuelClient.new({
    url: "https://fuel-testnet.hypersync.xyz"
  });

  const query: Query = {
    // start query from block 0
    "fromBlock": 0,
    // if to_block is not set, query runs to the end of the chain
    "toBlock": 1300000,
    // load inputs that have `asset_id` = 0x2a0d0ed9d2217ec7f32dcd9a1902ce2a66d68437aeff84e3a3cc8bebee0d2eea
    "inputs": [
      {
        "assetId": ["0x2a0d0ed9d2217ec7f32dcd9a1902ce2a66d68437aeff84e3a3cc8bebee0d2eea"]
      }
    ],
    // fields we want returned from loaded inputs
    "fieldSelection": {
      "input": [
        "tx_id",
        "block_height",
        "input_type",
        "utxo_id",
        "owner",
        "amount",
        "asset_id"
      ]
    }
  }

  const res = await client.getSelectedData(query);

  console.log(`inputs: ${JSON.stringify(res.data.inputs)}`);

}

main();

```


## Json Api ([repo](https://github.com/enviodev/hyperfuel-json-api/tree/main/asset-id-query-example))
```bash
curl --request POST \
  --url https://fuel-testnet.hypersync.xyz/query \
  --header 'Content-Type: application/json' \
  --data '{
        "from_block": 0,
        "to_block":   1300000,
        "inputs": [
            {
            "asset_id": ["0x2a0d0ed9d2217ec7f32dcd9a1902ce2a66d68437aeff84e3a3cc8bebee0d2eea"]
            }
        ],
        "field_selection": {
            "input": [
                "block_height",
                "tx_id",
                "owner",
                "amount",
                "asset_id"
            ]
        }
    }'
```