---
id: hyperfuel-query
title: HyperFuel Query
sidebar_label: Query Structure
slug: /hyperfuel-query
---

This section is dedicated to giving an exhaustive list of all the fields and query parameters of a hyperfuel query.  HyperFuel is extremely powerful but learning how to craft queries can take some practice.  It is recommended to look at the examples and reference this page.  HyperFuel query structure is the same across clients.

# Top level query structure
Illustrated as json
```go
{
    // The block to start the query from
    "from_block": Number,

    // The block to end the query at. If not specified, the query will go until the
    //  end of data. Exclusive, the returned range will be [from_block..to_block).
    //
    // The query will return before it reaches this target block if it hits the time limit
    //  configured on the server. The user should continue their query by putting the
    //  next_block field in the response into from_block field of their next query. This implements
    //  pagination.
    "to_block": Number, // Optional, defaults to latest block

    /// List of receipt selections, the query will return receipts that match any of these selections.
    "receipts": [{ReceiptSelection}], // Optional

    /// List of input selections, the query will return inputs that match any of these selections.
    "inputs": [{InputSelection}], // Optional

    /// List of output selections, the query will return outputs that match any of these selections.
    "outputs": [{OutputSelection}], // Optional

    // Whether to include all blocks regardless of if they match a receipt, input, or output selection.  Normally
    //  the server will return only the blocks that are related to the receipts, inputs, or outputs in the response. But if this
    //  is set to true, the server will return data for all blocks in the requested range [from_block, to_block).
    "include_all_blocks": bool, // Optional, defaults to false

    // The user selects which fields they want returned. Requesting less fields will improve
    //  query execution time and reduce the payload size so the user should always use a minimal number of fields.
    "field_selection": {FieldSelection},

    // Maximum number of blocks that should be returned, the server might return more blocks than this number but
    //  it won't overshoot by too much.
    "max_num_blocks": Number, // Optional, defaults to no maximum
}
```

# ReceiptSelection
Query takes an array of ReceiptSelection objects and returns receipts that match any of the selections.  All fields are optional.
Below is an exhaustive list of all fields in a ReceiptSelection json object.  Reference the [Fuel docs on receipts](https://docs.fuel.network/docs/specs/abi/receipts/#receipts) for field explanations.

```go
{
    // address that emitted the receipt
    "root_contract_id": [String],

    // The recipient address
    "to_address": [String],

    // The asset id of the coins transferred.
    "asset_id": [String],

    // the type of receipt
    // 0 = Call
    // 1 = Return,
    // 2 = ReturnData,
    // 3 = Panic,
    // 4 = Revert,
    // 5 = Log,
    // 6 = LogData,
    // 7 = Transfer,
    // 8 = TransferOut,
    // 9 = ScriptResult,
    // 10 = MessageOut,
    // 11 = Mint,
    // 12 = Burn,
    "receipt_type": [Number],

    // The address of the message sender.
    "sender": [String],

    // The address of the message recipient.
    "recipient": [String],

    // The contract id of the current context if in an internal context. null otherwise
    "contract_id": [String],

    // receipt register values.
    "ra": [Number],
    "rb": [Number],
    "rc": [Number],
    "rd": [Number],

    // the status of the transaction that the receipt originated from
    // 1 = Success
    // 3 = Failure
    "tx_status": [Number],

    // the type of the transaction that the receipt originated from
    // 0 = script
    // 1 = create
    // 2 = mint
    // 3 = upgrade
    // 4 = upload
    "tx_type": [Number]
}
```

# Input Selection
Query takes an array of InputSelection objects and returns inputs that match any of the selections.  All fields are optional.
Below is an exhaustive list of all fields in a InputSelection json object.  Reference the [Fuel docs on inputs](https://docs.fuel.network/docs/specs/tx-format/input/#input) for field explanations.
```go
{
    // The owning address or predicate root.
    "owner": [String],

    // The asset ID of the coins.
    "asset_id": [String],

    // The input contract.
    "contract": [String],

    // The sender address of the message.
    "sender": [String],

    // The recipient address of the message.
    "recipient": [String],

    // The type of input
    // 0 = InputCoin,
    // 1 = InputContract,
    // 2 = InputMessage,
    "input_type": [Number],

    // the status of the transaction that the input originated from
    // 1 = Success
    // 3 = Failure
    "tx_status": [Number],

    // the type of the transaction that the input originated from
    // 0 = script
    // 1 = create
    // 2 = mint
    // 3 = upgrade
    // 4 = upload
    "tx_type": [Number]
}
```

# OutputSelection
Query takes an array of OutputSelection objects and returns outputs that match any of the selections.  All fields are optional.
Below is an exhaustive list of all fields in a OutputSelection json object.  Reference the [Fuel docs on outputs](https://docs.fuel.network/docs/specs/tx-format/output/#output) for field explanations.
```go
{
    // The address the coins were sent to.
    "to": [String],

    // The asset id for the coins sent.
    "asset_id": [String],

    // The contract that was created.
    "contract": [String],

    // the type of output
    // 0 = CoinOutput,
    // 1 = ContractOutput,
    // 2 = ChangeOutput,
    // 3 = VariableOutput,
    // 4 = ContractCreated,
    "output_type": [Number],

    // the status of the transaction that the input originated from
    // 1 = Success
    // 3 = Failure
    "tx_status": [Number],

    // the type of the transaction that the input originated from
    // 0 = script
    // 1 = create
    // 2 = mint
    // 3 = upgrade
    // 4 = upload
    "tx_type": [Number]
}
```

# FieldSelection
Query takes a FieldSelection json object where the user specifies what they want returned from data matched by their `ReceiptSelection`, `OutputSelection`, and `InputSelection`.  There is no `BlockSelection` or `TransactionSelection` because the query returns all blocks and transactions that include the data you specified in your `ReceiptSelection`, `OutputSelection`, or `InputSelection`.

For best performance, select a minimal amount of fields.

*Important note:* all fields draw inspiration from Fuel's [graphql schema](https://docs.fuel.network/docs/graphql/reference/).  Mainly Blocks, Transactions, Receipts, Inputs, and Outputs.  Enums of each type (ex: Receipt has 12 different types, two of which are Log and LogData, Input has 3: InputCoin, InputContract, InputMessage, and Output has 5: CoinOutput, ContractOutput, ChangeOutput, VariableOutput, ContractCreated) are flattened into the parent type.  This is why  multiple fields on any returned Receipt, Input, or Output might be null; it's not a field on all possible enums of that type, so null is inserted.

All fields are optional.  Below is an exhaustive list of all fields in a FieldSelection json object.
```go
{
    "block": [
        "id",
        "da_height",
        "consensus_parameters_version",
        "state_transition_bytecode_version",
        "transactions_count",
        "message_receipt_count",
        "transactions_root",
        "message_outbox_root",
        "event_inbox_root",
        "height",
        "prev_root",
        "time",
        "application_hash"
    ],
    "transaction": [
        "block_height",
        "id",
        "input_asset_ids",
        "input_contracts",
        "input_contract_utxo_id",
        "input_contract_balance_root",
        "input_contract_state_root",
        "input_contract_tx_pointer_tx_index",
        "input_contract",
        "policies_tip",
        "policies_witness_limit",
        "policies_maturity",
        "policies_max_fee",
        "script_gas_limit",
        "maturity",
        "mint_amount",
        "mint_asset_id",
        "mint_gas_price",
        "tx_pointer_block_height",
        "tx_pointer_tx_index",
        "tx_type",
        "output_contract_input_index",
        "output_contract_balance_root",
        "output_contract_state_root",
        "witnesses",
        "receipts_root",
        "status",
        "time",
        "reason",
        "script",
        "script_data",
        "bytecode_witness_index",
        "bytecode_root",
        "subsection_index",
        "subsections_number",
        "proof_set",
        "consensus_parameters_upgrade_purpose_witness_index",
        "consensus_parameters_upgrade_purpose_checksum",
        "state_transition_upgrade_purpose_root",
        "salt"
    ],
    "receipt": [
        "receipt_index",
        "root_contract_id",
        "tx_id",
        "tx_status",
        "tx_type",
        "block_height",
        "pc",
        "is",
        "to",
        "to_address",
        "amount",
        "asset_id",
        "gas",
        "param1",
        "param2",
        "val",
        "ptr",
        "digest",
        "reason",
        "ra",
        "rb",
        "rc",
        "rd",
        "len",
        "receipt_type",
        "result",
        "gas_used",
        "data",
        "sender",
        "recipient",
        "nonce",
        "contract_id",
        "sub_id"
    ],
    "input": [
        "tx_id",
        "tx_status",
        "tx_type",
        "block_height",
        "input_type",
        "utxo_id",
        "owner",
        "amount",
        "asset_id",
        "tx_pointer_block_height",
        "tx_pointer_tx_index",
        "witness_index",
        "predicate_gas_used",
        "predicate",
        "predicate_data",
        "balance_root",
        "state_root",
        "contract",
        "sender",
        "recipient",
        "nonce",
        "data"
    ],
    "output": [
        "tx_id",
        "tx_status",
        "tx_type",
        "block_height",
        "output_type",
        "to",
        "amount",
        "asset_id",
        "input_index",
        "balance_root",
        "state_root",
        "contract",
    ]
}
```
