---
id: contract-import
title: No-Code Quickstart
sidebar_label: No-Code Quickstart
slug: /contract-import
---

The Envio CLI allows you to quickly autogenerate a basic indexer. This is the quickest way to get going and the likely starting point for most developers.

For example, you could autogenerate an indexer for Eigenlayer AND index the entire Eigenlayer contract in under 5 minutes simply through running `envio init` and pasting the contract address: https://etherscan.io/address/0x858646372cc42e1a627fce94aa7a7033e7cf075a

You can also autogenerate an indexer with a local ABI.

To start, simply run:

```
envio init
```

<iframe width="560" height="315" src="https://www.youtube.com/embed/zkVlGgf5XAo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/JOiLUysZf-s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Instructions

After selecting the name, directory and preferred language for the indexer, choose `Contract Import` as the initialization option.

```bash
? Choose an initialization option
  Template
> Contract Import
[↑↓ to move, enter to select, type to filter]
```

### 1. `Block Explorer` option

```bash
? Would you like to import from a block explorer or a local abi?
> Block Explorer
  Local ABI
[↑↓ to move, enter to select, type to filter]
```

Block Explorer option only requires user to input the address and chain of the contract.
If the contract is verified and deployed on one of the supported chains, this is the quickest setup as it will retrieve all needed contract information from a block explorer.

#### Select the blockchain that the contract is deployed on

```bash
? Which blockchain would you like to import a contract from?
> ethereum-mainnet
  goerli
  optimism
  base
  bsc
  gnosis
v polygon
[↑↓ to move, enter to select, type to filter]
```

List of supported networks (this list is being rapidly added to and may be outdated):

Please note: This is a list of supported networks for the no-code quickstart. Envio HyperIndex as an indexing framework natively supports any EVM network.

- `ethereum-mainnet`
- `goerli`
- `optimism`
- `base`
- `base-sepolia`
- `bsc`
- `gnosis`
- `fantom`
- `polygon`
- `boba`
- `optimism-sepolia`
- `moonbeam`
- `arbitrum-one`
- `arbitrum-nova`
- `arbitrum-sepolia`
- `celo`
- `avalanche`
- `amoy`
- `aurora`
- `harmony`
- `zksync-era`
- `sepolia`
- `linea`
- `polygon-zkevm`
- `scroll`
- `metis`
- `manta`
- `taiko-jolnr`
- `kroma`
- `lukso`
- `x-layer-testnet`
- `x-layer`
- `holesky`
- `gnosis-chiado`
- `zora`
- `public-goods`
- `a1-milkomeda`
- `c1-milkomeda`
- `mantle`
- `zeta`
- `neon-evm`
- `rootstock`
- `shimmer-evm`
- `blast`
- `blast-sepolia`
- `fhenix-testnet`
- `crab`
- `darwinia`
- `cyber`

#### Enter in the address of the contract to import

```bash
? What is the address of the contract?
[Use the proxy address if your abi is a proxy implementation]
```

Note if you are using a proxy contract with an implementation, the address should be for the proxy contract.

#### Choose which events to include in the `config.yaml` file

```bash
? Which events would you like to index?
> [x] ClaimRewards(address indexed from, address indexed reward, uint256 amount)
  [x] Deposit(address indexed from, uint256 indexed tokenId, uint256 amount)
  [x] NotifyReward(address indexed from, address indexed reward, uint256 indexed epoch, uint256 amount)
  [x] Withdraw(address indexed from, uint256 indexed tokenId, uint256 amount)
[↑↓ to move, space to select one, → to all, ← to none, type to filter]
```

#### Select the continuation option

```bash
? Would you like to add another contract?
> I'm finished
  Add a new address for same contract on same network
  Add a new network for same contract
  Add a new contract (with a different ABI)
[Current contract: BribeVotingReward, on network: optimism]
```

The `Contract Import` process will prompt the user whether they would like to finish the import process or continue adding more addresses for same contract on same network, addresses for same contract on different network or a different contract.

### 2. `Local ABI` option

```bash
? Would you like to import from a block explorer or a local abi?
  Block Explorer
> Local ABI
[↑↓ to move, enter to select, type to filter]
```

Choosing `Local ABI` option will allow you to point to a JSON file containing the smart contract ABI.
The `Contract Import` process will then populate the required files from the ABI.

> Select this option if the proxy contract has not been verified, which will cause the fetch request from Etherscan client to fail.

#### Specify the directory of JSON file containing ABI

```bash
? What is the path to your json abi file?
```

#### Choose which events to include in the `config.yaml` file

```bash
? Which events would you like to index?
> [x] ClaimRewards(address indexed from, address indexed reward, uint256 amount)
  [x] Deposit(address indexed from, uint256 indexed tokenId, uint256 amount)
  [x] NotifyReward(address indexed from, address indexed reward, uint256 indexed epoch, uint256 amount)
  [x] Withdraw(address indexed from, uint256 indexed tokenId, uint256 amount)
[↑↓ to move, space to select one, → to all, ← to none, type to filter]
```

#### Specify which chain the contract is deployed on

```bash
? Choose network:
> <Enter Network Id>
  ethereum-mainnet
  goerli
  optimism
  base
  bsc
v gnosis
[↑↓ to move, enter to select, type to filter]
```

#### Enter in the name for the contract

```bash
? What is the name of this contract?
```

#### Enter in the address of the contract

```bash
? What is the address of the contract?
[Use the proxy address if your abi is a proxy implementation]
```

Note if you are using a proxy contract with an implementation, the address should be for the proxy.

#### Select the continuation option

```bash
? Would you like to add another contract?
> I'm finished
  Add a new address for same contract on same network
  Add a new network for same contract
  Add a new contract (with a different ABI)
[Current contract: BribeVotingReward, on network: optimism]
```

The `Contract Import` process will prompt the user whether they would like to finish the import process or continue adding more addresses for same contract on same network, addresses for same contract on different network or a different contract.

## Configuration file

The contract-specific details that will be automatically populated in the `config.yaml` file are:

- Network ID
- Start Block
- Contract Name
- Contract Address
- Event Signature (for all events) with `requiredEntities`

Users can remove the events from the configuration file which do not need to be indexed. By default the contract import process populates the configuration file for all events.

For more information on how to write the configuration file, go [here](configuration-file).

However, users are not required to do make any changes to the `config.yaml` file for the indexer to run.

## Schema

By default, the contract import process will create an entity for each event in the contract.
The fields in these entities will correspond to the parameters that are emitted inside the event.

Additionally, `EventsSummary` entity will be created that:

- Stores a count of how many entities of each type have been created
- Links to a vector of entities of each type that have been created

For more information on how to write the schema file, go [here](./Guides/schema-file.md).

## Event Handlers

Loaders and handlers for each event will be automatically generated.

For all events, the loader function will load `EventsSummary` entity using a fixed key to be updated in the handler.

For all events, the handler function will perform two operations:

- Create an instance of the event-specific entity with all the parameters that have been emitted
- Update the event-specific entity counter in the loaded `EventsSummary` entity

For more information on how to write the event handlers file, go [here](./Guides/event-handlers.mdx).
