---
id: tutorial-indexing-fuel
title: Indexing Sway Farm on the Fuel network
sidebar_label: Indexing Fuel Network
slug: /tutorial-indexing-fuel
---

# Indexing Sway Farm on the Fuel network

Until recently, HyperIndex was only available on EVM networks, and now we have extended support to the [Fuel](https://fuel.network/) Network.

Indexers are vital to the success of any dApp. In this tutorial, we will create an Envio indexer for the Fuel dApp [Sway Farm](https://swayfarm.xyz/) step by step.

Sway Farm is a simple farming game and for the sake of a real-world example, let's create the indexer for a leaderboard of all farmers 🧑‍🌾

<img src="/docs-assets/tutorial-indexing-fuel-farm.png" alt="Sway Farm" width="100%"/>

## About Fuel

[Fuel](https://fuel.network/) is an operating system purpose-built for Ethereum rollups. Fuel's unique architecture allows rollups to solve for PSI (parallelization, state minimized execution, interoperability). Powered by the FuelVM, Fuel aims to expand Ethereum's capability set without compromising security or decentralization.

[Website](https://fuel.network/) | [X](https://twitter.com/fuel_network?lang=en) | [Discord](https://discord.com/invite/xfpK4Pe)

## Prerequisites

### Environment tooling

1. [<ins>Node.js</ins>](https://nodejs.org/en/download/current) we recommend using something like [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) to install Node
1. [<ins>pnpm</ins>](https://pnpm.io/installation)
1. [<ins>Docker Desktop</ins>](https://www.docker.com/products/docker-desktop/)

## Initialize the project

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

> 🧠 A separate [Tutorial](./greeter-tutorial) page provides more details about the `Greeter` template.

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
- Lastly, we need to list the events we want to index. To get them, I opened the list of logged events of the [contract file](https://github.com/FuelLabs/sway-farm/blob/47e3ed5a91593ebcf8d2c67ae6fad41d9954c8a8/contract/src/abi_structs.sw#L365-L406) and realized that for a leaderboard we need only events which update player information. Hence, I added `NewPlayer`, `LevelUp`, and `SellItem` events to the list. We'd want to index more events in real life, but this is enough for the tutorial.

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
type Player {
  id: ID!
  farmingSkill: BigInt!
  totalValueSold: BigInt!
}
```

We will use the user address as an ID. The fields `farmingSkill` and `totalValueSold` are `u64` in Sway, so to safely map them to JavaScript value, we'll use `BigInt`.

### Update `EventHandlers.ts`

Before we start writing our first event handlers, let's run a codegen script. It'll use `config.yaml` and `schema.graphql` to generate code for the indexer and types we will use in the event handler.

```bash
pnpm codegen
```

Now, if you open `EventHandlers.ts`, you should see some TypeScript errors. That's fine, let's delete all the Greeter indexer code and write our first Sway Farm event handler.

```typescript
import { SwayFarmContract } from "generated";

/**
Registers a handler that processes NewPlayer event
on the SwayFarm contract and stores the players in the DB
*/
SwayFarmContract.NewPlayer.handler(({ event, context }) => {
  // Set the Player entity in the DB with the intial values
  context.Player.set({
    // The address in Sway is a union type of user Address and ContractID. Envio supports most of the Sway types, and the address value was decoded as a discriminated union 100% typesafe
    id: event.data.address.payload.bits,
    // Initial values taken from the contract logic
    farmingSkill: 1n,
    totalValueSold: 0n,
  });
});
```

Actually, this is already enough to start the indexer and get the list of all players, but let's spend a few more seconds and add the rest of the event handlers, so we have synced `farmingSkill` and `totalValueSold` data in our DB.

```typescript
// Code from above ...

SwayFarmContract.LevelUp.handler(({ event, context }) => {
  const playerInfo = event.data.player_info;
  context.Player.set({
    id: event.data.address.payload.bits,
    farmingSkill: playerInfo.farming_skill,
    totalValueSold: playerInfo.total_value_sold,
  });
});

SwayFarmContract.SellItem.handler(({ event, context }) => {
  const playerInfo = event.data.player_info;
  context.Player.set({
    id: event.data.address.payload.bits,
    farmingSkill: playerInfo.farming_skill,
    totalValueSold: playerInfo.total_value_sold,
  });
});
```

Without overengineering, simply set the player data into the database. What's nice is that whenever your ABI or entities in `graphql.schema` change, Envio regenerates types and shows the compilation error.

## Starting the Indexer

> 📢 Make sure you have docker open

The following commands will start the docker and create databases for indexed data. Make sure to re-run `pnpm dev` if you've made some changes.

```bash
envio dev
```

<img src="/docs-assets/tutorial-indexing-fuel-running-indexer.png" alt="Running indexer" width="100%"/>

Nice, we indexed `1,721,352` blocks in 10 seconds, and they continue coming in.

## View the indexed results

Let's check indexed players on the local Hasura server.

```bash
open http://localhost:8080
```

The Hasura admin-secret / password is `testing`, and the tables can be viewed in the data tab or queried from the playground.

<img src="/docs-assets/tutorial-indexing-fuel-graphiql.png" alt="GraphiQL example" width="100%"/>

Now, we can easily get the top 5 players, the number of inactive and active players, and the average sold value. What's left is a nice UI for the Sway Farm leaderboard, but that's not the tutorial's topic.

> 🧠 A separate [Guide](./navigating-hasura) page provides more details about navigating Hasura.

## Deploy the indexer onto the hosted service

Once you have verified that the indexer is working for your contracts, then you are ready to deploy the indexer onto our hosted service.

Deploying an indexer onto the hosted service allows you to extract information via graphQL queries into your front-end or some back-end application.

Navigate to the [hosted service](https://envio.dev/app/login) to start deploying your indexer and refer to this [documentation](./hosted-service.md) for more information on deploying your indexer.

## What next?

Once you have successfully finished the tutorial, you are ready to become a blockchain indexing wizard!

Join our [Discord](https://discord.com/invite/gt7yEUZKeB) channel to make sure you catch all new releases.
