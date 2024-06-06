---
id: hyperfuel
title: HyperFuel
sidebar_label: HyperFuel
slug: /hyperfuel
---

HyperFuel is a HyperSync adaptation specialized for supporting [Fuel](https://fuel.network/).

HyperFuel can be used to query historic fuel data with incredible speed.

You can integrate with HyperFuel using any of our clients:
 - Rust: https://github.com/enviodev/hyperfuel-client-rust
 - Python: https://github.com/enviodev/hyperfuel-client-python
 - Nodejs: https://github.com/enviodev/hyperfuel-client-node
 - json api: https://github.com/enviodev/hyperfuel-json-api


## Example usage
Below is an example of a Hyperfuel query in each of our clients searching the first 1,300,000 blocks for all `input` objects of a specific `asset-id` in ~40ms (not including latency).


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
                "block_height",
                "tx_id",
                "owner",
                "amount",
                "asset_id"
            ]
        }
    }))
    .unwrap();

    let res = client.get_selected_data(&query).await.unwrap();

    println!("inputs: {:?}", res.data.inputs);
    println!("query took {}ms", res.total_execution_time);
}

```

## Python ([repo](https://github.com/enviodev/hyperfuel-client-python/blob/main/examples/asset-id.py))
```python
```

## Node Js ([repo](https://github.com/enviodev/hyperfuel-client-node/tree/main/examples/asset-id))
```js
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