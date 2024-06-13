#### Get all logs for smart contract

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


#### Get blob data for optimism chain 

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
        ]
    }
  }'
  ```

#### Mint USDC events

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

### All tx from to address

```bash 
curl --request POST \
  --url https://eth.hypersync.xyz/query \
  --header 'Content-Type: application/json' \
  --data '{
    "from_block": 20000000,
    "transactions": [
        {
            "from": ["0xdb255746609baadd67ef44fc15b5e1d04befbca7"],
            "to": ["0xdb255746609baadd67ef44fc15b5e1d04befbca7"],
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

### All successful/failed tx for the last 10 blocks

To get current height we want to run

```bash
curl https://eth.hypersync.xyz/height | jq .height
```

This query will returan successful transactions. To get failed ones - change status to 0
```bash 
curl --request POST \
  --url https://eth.hypersync.xyz/query \
  --header 'Content-Type: application/json' \
  --data '{
    "from_block": 20082108,
    "transactions": [
        {
            "status": 1
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


Get NFT transfers for colelction for account

All exchanges of USDT(USDC) of EOA on 1inch 
