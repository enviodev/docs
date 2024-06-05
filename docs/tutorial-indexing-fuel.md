---
id: tutorial-indexing-fuel
title: Indexing Sway Farm on the Fuel network
sidebar_label: Indexing Fuel Network
slug: /tutorial-indexing-fuel
---

# Indexing Sway Farm on the Fuel network

Until recently, HyperIndex was only available on EVM networks, and now we have extended support to the [Fuel](https://fuel.network/) Network.

Indexers are vital to the success of any dApp. In this tutorial, we will create an Envio indexer for the Fuel dApp [Sway Farm](https://swayfarm.xyz/) step by step.

Sway Farm is a simple farming game and for the sake of a real-world example let's create the indexer for leadearboard of all farmers 🧑‍🌾

![alt text](image.png)

## About Fuel

[Fuel](https://fuel.network/) is an operating system purpose-built for Ethereum rollups. Fuel's unique architecture allows rollups to solve for PSI (parallelization, state minimized execution, interoperability). Powered by the FuelVM, Fuel aims to expand Ethereum's capability set without compromising security or decentralization.

[Website](https://fuel.network/) | [X](https://twitter.com/fuel_network?lang=en) | [Discord](https://discord.com/invite/xfpK4Pe)

## Prerequisites

### Environment tooling

1. [<ins>Node.js</ins>](https://nodejs.org/en/download/current) we recommend using something like [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) to install Node
1. [<ins>pnpm</ins>](https://pnpm.io/installation)
1. [<ins>Docker Desktop</ins>](https://www.docker.com/products/docker-desktop/)

## Initialize the project

Saved

Hide assistant

Now that you have installed the prerequisite packages let's begin the practical steps of setting up the indexer.

Open your terminal in an empty directory and initialize a new indexer by running the command:

```bash
npx envio init
```

In the following prompt, let's name our indexer `sway-farm-indexer`:

```bash
? Name your indexer: sway-farm-indexer
```

Then, choose the directory where you want to set up your project. The default is the current directory, but in the tutorial, I'll use the indexer name:

```bash
? Specify a folder name (ENTER to skip): sway-farm-indexer
```

Then, choose a language of your choice for the event handlers. TypeScript is the most popular one, so we'll stick with it:

```bash
? Which language would you like to use?
  JavaScript
> TypeScript
  ReScript
[↑↓ to move, enter to select, type to filter]
```

The contract import feature has not yet been released for the Fuel network, so let's choose `Template` and `GreeterOnFuel`.

```bash
? Choose an initialization option
> Template
  Contract Import
[↑↓ to move, enter to select, type to filter]
```

```bash
? Which template would you like to use?
  Greeter
> GreeterOnFuel
  Erc20
[↑↓ to move, enter to select, type to filter]
```

After the project is finished initializing, you should see the following line:

```
Please run `cd sway-farm-indexer` to run the rest of the envio commands
```

We are already halfway through 🙌

Let's open the indexer in an IDE and start adjusting it for our farm 🍅

## Adjusting the Indexer for Sway Farm

Currently, using the `GreeterOnFuel` template is the simplest way to create a Fuel indexer. Still, we must admit that the `Greeter` indexer is not quite what we want.

> 🧠 A separate [Tutorial] (./greeter-tutorial) page provides more details about the `Greeter` template.

So, let's start by adjusting its parts to make it work for Sway Farm. It's done via modifying the 3 files below:

- [`config.yaml`](./configuration-file)
- [`schema.graphql`](./schema)
- [`src/EventHandlers.*`](./event-handlers)

> (\* depending on the language chosen for the indexer)

I suggest to go one by one and the first in line is `config.yaml`.

### Update `config.yaml`

In the file, we need to change a few configurations:

- Rename indexer to `Sway Farm Indexer`
- Change the contract name to `SwayFarm`
- Set an address for the deployed contract
- Update ABI and the path to the location. You can get ABI by building the contract using `forc build`. In my case, I found the latest version of the ABI in the [`sway-farm`](https://github.com/FuelLabs/sway-farm/blob/47e3ed5a91593ebcf8d2c67ae6fad41d9954c8a8/frontend/src/sway-api/contracts/factories/ContractAbi__factory.ts#L16) GitHub repo
- Lastly, we need to list the events we want to index. To get them, I opened the list of logged events of the [contract file](https://github.com/FuelLabs/sway-farm/blob/47e3ed5a91593ebcf8d2c67ae6fad41d9954c8a8/contract/src/abi_structs.sw#L365-L406) and realized that for leaderboard we need only events which update player information. Hence, I added `NewPlayer`, `LevelUp`, and `SellItem` events to the list. We'd want to index more events in real life, but this is enough for the tutorial.

```diff
- name: Fuel Greeter Indexer
+ name: Sway Farm Indexer
networks:
  - id: 0
    start_block: 0
    contracts:
-     - name: Greeter
-       address: 0xb9bc445e5696c966dcf7e5d1237bd03c04e3ba6929bdaedfeebc7aae784c3a0b
-       abi_file_path: abis/greeter-abi.json
+     - name: SwayFarm
+       address: 0xf5b08689ada97df7fd2fbd67bee7dea6d219f117c1dc9345245da16fe4e99111
+       abi_file_path: abis/sway-farm-abi.json

        handler: ./src/EventHandlers.ts
        events:
-         - name: NewGreeting
-         - name: ClearGreeting
+         - name: NewPlayer
+         - name: SellItem
+         - name: LevelUp
```

You can notice that we use [Sway](https://docs.fuel.network/docs/sway/) struct names for the `events` configuration. Envio will automatically find `LogData` [receipts](https://docs.fuel.network/docs/specs/abi/receipts) containing data of the desired struct type. In case you log non-struct data, you can set the log id from ABI explicitly:

```
- name: MyEvent
  logId: "1515152261580153489"
```

> The current version supports indexing only `LogData` and `Log` receipts. Join our [Discord](https://discord.com/invite/gt7yEUZKeB) channel to make sure you catch all new releases. We have `Transfer`, `TransferOut`, `Mint`, `Burn`, and `Call` receipts support on our roadmap.

### Update `schema.graphql`

The `schema.graphql` file serves as a representation of your application's data model. It defines entity types that directly correspond to database tables, and the event handlers you create are responsible for creating and updating records within those tables. Additionally, the GraphQL API is automatically generated based on the entity types specified in the `schema.graphql` file, to allow access for the indexed data.

> 🧠 A separate [Guide](./schema) page provides more details about the `schema.graphql` file.

For the leaderboard, we need only one entity representing the player. Let's create it:

```graphql
# schema.graphql

type Player {
  id: ID!
  farmingSkill: BigInt!
  totalValueSold: BigInt!
}
```

We will use the user address as an ID. The fields `farmingSkill` and `totalValueSold` are `u64` in Sway, so to safely map them to JavaScript value, we'll use `BigInt`.

<!-- WIP  -->

## Starting the Indexer

Before starting your indexer, run the command below to ensure that no conflicting indexers are running.

### Stopping the indexer:

`envio stop`

> Note: Ignore if you’re a first-time user.

### Start the indexer:

`envio dev`

Now, let's run our indexer locally by running the command below.

## Overview of Generated Code

Now let's take a glance at the key files generated by Envio:

1. config.yaml
   This file outlines networks, start blocks, addresses, and events we want to index, specifying Optimism and Ethereum Mainnet.

<img src="/docs-assets/tutorial-op-bridge-7.png" alt="tutorial-op-bridge-7" width="100%"/>

2. schema.graphql
   This file saves and defines the data structures for selected events, such as `eth deposit initiated` and `deposit finalized`.

<img src="/docs-assets/tutorial-op-bridge-8.png" alt="tutorial-op-bridge-8" width="100%"/>

3. event-handler.ts
   This file defines what happens when one of these events is emitted and saves what code is going to run, allowing customization in data handling.

<img src="/docs-assets/tutorial-op-bridge-9.png" alt="tutorial-op-bridge-9" width="100%"/>

## Exploring the Indexed Data

Time to reap the rewards of your indexing efforts:

1. Head over to Hasura, type in the admin-secret password `testing`, and click “API” in the above column to access the GraphQL endpoint to query real-time data.

<img src="/docs-assets/tutorial-op-bridge-10.png" alt="tutorial-op-bridge-10" width="100%"/>

2. Now click on “Data” in the above column to monitor the indexing progress on Ethereum Mainnet and Optimism through the events sync state table to see which block number you are on.

<img src="/docs-assets/tutorial-op-bridge-11.png" alt="tutorial-op-bridge-11" width="100%"/>

In general, if you wanted to index hundreds of millions of blocks and save hundreds and thousands of events this would usually take hours if not days using standard RPC but with Envio’s [HyperSync](https://docs.envio.dev/docs/hypersync) developers can reduce this process to a couple of minutes or even seconds.

3. Now let’s have a look at some of the events by heading back to “API” in the above column. From there you can run a query-specific event, in this case, "deposit finalized" to explore details such as amounts, senders, and recipients.

<img src="/docs-assets/tutorial-op-bridge-12.png" alt="tutorial-op-bridge-12" width="100%"/>

**For example:**
Let’s look at getting 10 "deposit finalized" events, and order them by the amount we would like to appear first (in this case: desc = greatest amount), the amounts being bridged, who it’s from, who it’s to, and the different L1 and L2 tokens.

Once you have selected your desired events run the query by clicking the play button ( ▶️) to gain access to the real-time indexed data

<img src="/docs-assets/tutorial-op-bridge-13.png" alt="tutorial-op-bridge-13" width="100%"/>

## Conclusion

And just like that, you've successfully indexed the Optimism Bridge contracts on both Optimism and Ethereum Mainnet using the Envio HyperIndex contract import feature.

Be sure to check out our [video walkthrough](https://www.youtube.com/watch?v=9U2MTFU9or0) on Youtube, including other tutorials that showcase Envio’s indexing features and capabilities.
