---
id: hypersync-curl-examples
title: Using curl requests with HyperSync
sidebar_label: HyperSync curl examples
slug: /hypersync-curl-examples
---

### When to Use JSON API Requests and When Not

Using JSON API requests to interact with envio.dev can be highly effective for various scenarios, but it's important to understand when it is appropriate to use them and when other methods might be more suitable.

##### Json API Advantages:

- Quick Testing and Debugging: curl is ideal for quickly testing and debugging API endpoints without the need for complex setup.
- Automated Scripts: Perfect for shell scripts that automate HTTP requests efficiently.
- Simple Data Retrieval: Efficient and easy to use for straightforward data retrieval tasks.
- Flexibility: The JSON API can be used with any programming language that doesn't support the HyperSync Client libraries.

##### Client libraries advantages:

- Complex Workflows: HyperSync client libraries provide greater flexibility and convenient code organization for workflows involving multiple steps and conditional logic.
- Data Compression: HyperSync libraries automatically send data in a compressed format, enhancing throughput for data-intensive queries.
- Query Fragmentation Handling: Client libraries handle subsequent queries automatically if the initial query doesn't reach the to_block or the end of the chain.
- Arrow Support: Data can be returned in Apache Arrow format, facilitating easier data manipulation and analysis.
- Auto Retry: Client libraries automatically retry failed requests, ensuring more reliable data retrieval.

### Curl query examples

#### Get all ERC-20 transfers for the EOA address

The following query shows how to filter all ERC-20 transfer events for a specific EOA address.

Topics Filter: The topic filter is used to filter logs based on event signatures. In this example, the topic hash 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef is the signature for the ERC-20 Transfer event. The filter specifies that we are interested in logs where either the second or third topic (representing the sender and recipient addresses) matches 0x0000000000000000000000001e037f97d730Cc881e77F01E409D828b0bb14de0.

From/To Addresses: The transactions.from and transactions.to fields filter transactions by the sender (from) and recipient (to) addresses. Here, we filter transactions where the sender or recipient address is 0x1e037f97d730Cc881e77F01E409D828b0bb14de0.

```bash
curl --request POST \
  --url https://eth.hypersync.xyz/query \
  --header 'Content-Type: application/json' \
  --data '{
    "from_block": 0,
    "logs": [
        {
            "topics": [
                [
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
                ],
                [],
                [
                    "0x0000000000000000000000001e037f97d730Cc881e77F01E409D828b0bb14de0"
                ]
            ]
        },
        {
            "topics": [
                [
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
                ],
                [
                    "0x0000000000000000000000001e037f97d730Cc881e77F01E409D828b0bb14de0"
                ],
                []
            ]
        }
    ],
    "transactions": [
        {
            "from": [
                "0x1e037f97d730Cc881e77F01E409D828b0bb14de0"
            ]
        },
        {
            "to": [
                "0x1e037f97d730Cc881e77F01E409D828b0bb14de0"
            ]
        }
    ],
    "field_selection": {
        "block": [
            "number",
            "timestamp",
            "hash"
        ],
        "log": [
            "block_number",
            "log_index",
            "transaction_index",
            "data",
            "address",
            "topic0",
            "topic1",
            "topic2",
            "topic3"
        ],
        "transaction": [
            "block_number",
            "transaction_index",
            "hash",
            "from",
            "to",
            "value",
            "input"
        ]
    }
  }'
```

#### Get All Logs for a Smart Contract Address

This query returns all logs for a specified smart contract, starting from the beginning of the blockchain.

Note that this query might not return all data at once. Instead, it will likely return a `next_block` parameter,
which should be used as the `from_block` for subsequent queries to fetch the next chunk of data.

```bash
curl --request POST \
  --url https://eth.hypersync.xyz/query \
  --header 'Content-Type: application/json' \
  --data '{
    "from_block": 0,
    "logs": [
        {
            "address": ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]
        }
    ],
    "field_selection": {
        "block": [
            "number",
            "timestamp",
            "hash"
        ],
        "log": [
            "block_number",
            "log_index",
            "transaction_index",
            "data",
            "address",
            "topic0",
            "topic1",
            "topic2",
            "topic3"
        ],
        "transaction": [
            "block_number",
            "transaction_index",
            "hash",
            "from",
            "to",
            "value",
            "input"
        ]
    }
  }'
```

#### Get Blob Data for the Optimism Chain

This query returns all blob transactions produced by the Optimism chain. After retrieving the transaction data, you can query the Ethereum network to get the relevant blobs of data.

Note that these blobs are only stored for 18 days.

```bash
curl --request POST \
  --url https://eth.hypersync.xyz/query \
  --header 'Content-Type: application/json' \
  --data '{
    "from_block": 20000000,
    "transactions": [
        {
            "from": ["0x6887246668a3b87F54DeB3b94Ba47a6f63F32985"],
            "to": ["0xFF00000000000000000000000000000000000010"],
            "type": "0x3"
        }
    ],
    "field_selection": {
        "block": [
            "number",
            "timestamp",
            "hash"
        ],
        "transaction": [
            "block_number",
            "transaction_index",
            "hash",
            "from",
            "to",
            "type"
        ]
    }
  }'
```

#### Mint USDC events

This query retrieves all mint events for the USDC token.

It uses the signature for the transfer event (0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef) and the `from` address 0x0000000000000000000000000000000000000000000000000000000000000000 to identify mint transactions.

```bash
curl --request POST \
  --url https://eth.hypersync.xyz/query \
  --header 'Content-Type: application/json' \
  --data '{
    "from_block": 0,
    "logs": [
        {
            "address": ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
            "topics": [
                [
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
                ],
                [
                    "0x0000000000000000000000000000000000000000000000000000000000000000"
                ],
                []
            ]
        }
    ],
    "field_selection": {
        "block": [
            "number",
            "timestamp",
            "hash"
        ],
        "log": [
            "block_number",
            "log_index",
            "transaction_index",
            "data",
            "address",
            "topic0",
            "topic1",
            "topic2",
            "topic3"
        ],
        "transaction": [
            "block_number",
            "transaction_index",
            "hash",
            "from",
            "to",
            "value",
            "input"
        ]
    }
  }'
```

#### Get All Transactions From/To an Address

This query returns all transactions involving a specific EOA address, either as the sender or the recipient.

Note that `from_block` is set to a specific block because the beginning of the chain does not contain data related to this address. Multiple queries may be needed to start retrieving data.

```bash
curl --request POST \
  --url https://eth.hypersync.xyz/query \
  --header 'Content-Type: application/json' \
  --data '{
    "from_block": 15362000,
    "transactions": [
        {
            "from": ["0xdb255746609baadd67ef44fc15b5e1d04befbca7"]
        },
        {
            "to": ["0xdb255746609baadd67ef44fc15b5e1d04befbca7"]
        }
    ],
    "field_selection": {
        "block": [
            "number",
            "timestamp",
            "hash"
        ],
        "transaction": [
            "block_number",
            "transaction_index",
            "hash",
            "from",
            "to"
        ]
    }
  }'
```

#### Get All Successful/Failed Transactions for the Last 10 Blocks

First, query the current block height using https://eth.hypersync.xyz/height, subtract 10 from it, and store the result in a variable.

Use this variable as the from_block to get transactions with a matching status.

This example returns successful transactions. To retrieve failed transactions, change the status to 0.

```bash
height=$((`curl https://eth.hypersync.xyz/height | jq .height` - 10))
curl --request POST \
  --url https://eth.hypersync.xyz/query \
  --header 'Content-Type: application/json' \
  --data "{
    \"from_block\": ${height},
    \"transactions\": [
        {
            \"status\": 1
        }
    ],
    \"field_selection\": {
        \"block\": [
            \"number\",
            \"timestamp\",
            \"hash\"
        ],
        \"transaction\": [
            \"block_number\",
            \"transaction_index\",
            \"hash\",
            \"from\",
            \"to\"
        ]
    }
  }"
```
