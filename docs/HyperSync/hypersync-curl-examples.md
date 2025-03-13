---
id: hypersync-curl-examples
title: Using curl with HyperSync
sidebar_label: curl Examples ⭐ Recommended
slug: /hypersync-curl-examples
---

# Using curl with HyperSync

This guide demonstrates how to interact with HyperSync using direct HTTP requests via curl. These examples provide a quick way to explore HyperSync functionality without installing client libraries.

:::info Recommended Approach
We highly recommend trying these curl examples as they're super quick and easy to run directly in your terminal. It's one of the fastest ways to experience HyperSync's performance firsthand and see just how quickly you can retrieve blockchain data without any setup overhead. Simply copy, paste, and be amazed by the response speed!

While curl requests are technically slower than our client libraries (since they use HTTP rather than binary data transfer protocols), they're still impressively fast and provide an excellent demonstration of HyperSync's capabilities without any installation requirements.
:::

## Table of Contents

1. [Curl vs. Client Libraries](#curl-vs-client-libraries)
2. [Common Use Cases](#common-use-cases)
   - [ERC-20 Transfers for an Address](#get-all-erc-20-transfers-for-an-address)
   - [Contract Event Logs](#get-all-logs-for-a-smart-contract)
   - [Blob Transactions](#get-blob-data-for-the-optimism-chain)
   - [Token Mint Events](#get-mint-usdc-events)
   - [Address Transactions](#get-all-transactions-for-an-address)
   - [Transaction Status Filtering](#get-successful-or-failed-transactions)

## Curl vs. Client Libraries

When deciding whether to use curl commands or client libraries, consider the following comparison:

### When to Use curl (JSON API)

- **Quick Prototyping**: Test endpoints and explore data structure without setup
- **Simple Scripts**: Perfect for shell scripts and automation
- **Language Independence**: When working with languages without HyperSync client libraries
- **API Exploration**: When learning the HyperSync API capabilities

### When to Use Client Libraries

- **Production Applications**: For stable, maintained codebases
- **Complex Data Processing**: When working with large datasets or complex workflows
- **Performance**: Client libraries offer automatic compression and pagination
- **Error Handling**: Built-in retry mechanisms and better error reporting
- **Data Formats**: Support for efficient formats like Apache Arrow

## Common Use Cases

### Get All ERC-20 Transfers for an Address

This example filters for all ERC-20 transfer events involving a specific address, either as sender or recipient. Feel free to swap your address into the example.

**What this query does:**

- Filters logs for the Transfer event signature (topic0)
- Matches when the address appears in either topic1 (sender) or topic2 (recipient)
- Also includes direct transactions to/from the address

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

### Get All Logs for a Smart Contract

This example retrieves all event logs emitted by a specific contract (USDC in this case).

**Key points:**

- Sets `from_block: 0` to scan from the beginning of the chain
- Uses `next_block` in the response for pagination to fetch subsequent data
- Includes relevant block, log, and transaction fields

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

### Get Blob Data for the Optimism Chain

This example finds blob transactions used by the Optimism chain for data availability.

**Key points:**

- Starts at a relatively recent block (20,000,000)
- Filters for transactions from the Optimism sequencer address
- Specifically looks for type 3 (blob) transactions
- Results can be used to retrieve the actual blob data from Ethereum

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

### Get Mint USDC Events

This example identifies USDC token minting events.

**How it works:**

- Filters for the USDC contract address
- Looks for Transfer events (topic0)
- Specifically matches when topic1 (from address) is the zero address, indicating a mint
- Returns detailed information about each mint event

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

### Get All Transactions for an Address

This example retrieves all transactions where a specific address is either the sender or receiver.

**Implementation notes:**

- Starts from a specific block (15,362,000) for efficiency
- Uses two transaction filters in an OR relationship
- Only includes essential fields in the response
- Multiple queries may be needed for complete history

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

### Get Successful or Failed Transactions

This example shows how to filter transactions based on their status (successful or failed) for recent blocks.

**How it works:**

1. First, query the current chain height
2. Calculate a starting point (current height minus 10)
3. Query transactions with status=1 (successful) or status=0 (failed)

```bash
# Get current height and calculate starting block
height=$((`curl https://eth.hypersync.xyz/height | jq .height` - 10))

# Query successful transactions (change status to 0 for failed transactions)
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
