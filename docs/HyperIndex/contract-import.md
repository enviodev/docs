---
id: contract-import
title: Quickstart
sidebar_label: Quickstart
slug: /contract-import
---

The **Quickstart** enables you to instantly autogenerate a powerful indexer and start querying blockchain data in minutes. This is the fastest and easiest way to begin using HyperIndex.

**Example:** Autogenerate an indexer for the Eigenlayer contract and index its entire history in less than 5 minutes by simply running `pnpx envio init` and providing the contract address from [Etherscan](https://etherscan.io/address/0x858646372cc42e1a627fce94aa7a7033e7cf075a).

---

### Video Tutorials

<iframe width="560" height="315" src="https://www.youtube.com/embed/zkVlGgf5XAo" title="Quickstart Guide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/JOiLUysZf-s" title="Indexer Initialization Guide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

## Getting Started

Run the following command to initialize your indexer:

```bash
pnpx envio init
```

You'll then follow interactive prompts to customize your indexer.

---

## Indexer Initialization Options

During initialization, you'll be presented with two options:

- **Contract Import** _(recommended for existing smart contracts)_
- **Template**

Choose the **Contract Import** option to auto-generate indexers directly from smart contracts.

```bash
? Choose an initialization option
  Template
> Contract Import
[↑↓ to move, enter to select]
```

---

## Contract Import Methods

There are two convenient methods to import your contract:

- **Block Explorer** _(verified contracts on supported explorers like Etherscan and Blockscout)_
- **Local ABI** _(custom or unverified contracts)_

### 1. Block Explorer Import

This method uses a verified contract's address from a supported blockchain explorer (Etherscan, Routescan, etc.) to automatically fetch the ABI.

#### Steps:

**a. Select the blockchain**

```bash
? Which blockchain would you like to import a contract from?
> ethereum-mainnet
  goerli
  optimism
  base
  bsc
  gnosis
  polygon
[↑↓ to move, enter to select]
```

:::note
HyperIndex supports all EVM-compatible chains. If your desired chain is not listed, you can import via the local ABI method or manually adjust the `config.yaml` file after initialization.
:::

**b. Enter the contract address**

```bash
? What is the address of the contract?
[Use proxy address if ABI is for a proxy implementation]
```

:::tip
If using a proxy contract, always specify the **proxy address**, not the implementation address.
:::

**c. Select events to index**

```bash
? Which events would you like to index?
> [x] ClaimRewards(address indexed from, address indexed reward, uint256 amount)
  [x] Deposit(address indexed from, uint256 indexed tokenId, uint256 amount)
  [x] NotifyReward(address indexed from, address indexed reward, uint256 indexed epoch, uint256 amount)
  [x] Withdraw(address indexed from, uint256 indexed tokenId, uint256 amount)
[space to select, → to select all, ← to deselect all]
```

**d. Finish or add more contracts**

You'll be prompted to continue adding more contracts or to complete the setup:

```bash
? Would you like to add another contract?
> I'm finished
  Add a new address for same contract on same network
  Add a new network for same contract
  Add a new contract (with a different ABI)
```

---

### 2. Local ABI Import

Choose this method if the contract ABI is unavailable from a block explorer or you're using an unverified contract.

#### Steps:

**a. Select Local ABI**

```bash
? Would you like to import from a block explorer or a local abi?
  Block Explorer
> Local ABI
[↑↓ to move, enter to select]
```

**b. Specify ABI JSON file**

Provide the path to your local ABI file (JSON format):

```bash
? What is the path to your json abi file?
```

**c. Select events to index**

```bash
? Which events would you like to index?
> [x] ClaimRewards(address indexed from, address indexed reward, uint256 amount)
  [x] Deposit(address indexed from, uint256 indexed tokenId, uint256 amount)
[space to select, → to select all, ← to deselect all]
```

**d. Choose blockchain**

Specify the blockchain your contract is deployed on:

```bash
? Choose network:
> ethereum-mainnet
  goerli
  optimism
  base
  bsc
  gnosis
  [Custom Network ID]
[↑↓ to move, enter to select]
```

**e. Enter contract details**

- **Contract name**

```bash
? What is the name of this contract?
```

- **Contract address**

```bash
? What is the address of the contract?
[Use proxy address if ABI is for a proxy implementation]
```

**f. Finish or add more contracts**

Complete the import process or continue adding contracts:

```bash
? Would you like to add another contract?
> I'm finished
  Add a new address for same contract on same network
  Add a new network for same contract
  Add a new contract (with a different ABI)
```

---

## Generated Files & Configuration

The Quickstart automatically generates key files:

### 1. `config.yaml`

Automatically configured parameters include:

- **Network ID**
- **Start Block**
- **Contract Name**
- **Contract Address**
- **Event Signatures**

By default, all selected events are included, but you can manually adjust the file if needed. See the detailed guide on [`config.yaml`](configuration-file).

### 2. GraphQL Schema

- Entities are automatically generated for each selected event.
- Fields match the event parameters emitted.

See more details in the [schema file guide](./Guides/schema-file.md).

### 3. Event Handlers

- Handlers are autogenerated for each event.
- Handlers create event-specific entities.

Learn more in the [event handlers guide](./Guides/event-handlers.mdx).

---

**Congratulations!** Your HyperIndex indexer is now ready to run and query data!

Next step: [Running your Indexer locally](./running-locally) or [Deploying to Hosted Service](./hosted-service).
