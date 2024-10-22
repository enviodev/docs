---
id: ipfs
title: IPFS
sidebar_label: IPFS
slug: /ipfs
---

# IPFS Guide

TLDR; The repo for the code base can be found [here](https://github.com/enviodev/bored-ape-yacht-club-indexer)

In this guide we aim to demonstrate how to fetch IPFS data into your indexer. Specifically, we fetch token metadata for the [Bored Ape Yacht Club](https://www.boredapeyachtclub.com/) NFT collection.

This guide assumes you are familiar with IPFS, however [jump](#what-is-ipfs) to the bottom for some additional context on IPFS or general helpers.

## How to index IPFS data

### Part 1: A basic Bored Ape Yacht Club owner indexer - [82577d2](https://github.com/enviodev/bored-ape-yacht-club-indexer/commit/82577d28ec977256480d0a5bac25ffd35e0842c0)

First, we create an indexer using the Envio contract import feature.

`npx envio init`
Contract address: `0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`

We then make some light modifications. The resulting config, schema, and event handlers look as follows.

> config.yaml

:::info
We set an end_block for this so that the indexer runs for a predefined set of blocks to simplify the initial development
:::

```yaml
name: bored-ape-yacht-club-nft-indexer
networks:
  - id: 1
    start_block: 0
    end_block: 12299114 # dev end_block
    contracts:
      - name: BoredApeYachtClub
        address:
          - 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D
        handler: src/EventHandlers.ts
        events:
          - event: Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
```

> shema.graphql

```graphql
type Nft {
  id: ID! # tokenId
  owner: String!
}
```

> src/EventHandler.ts

```typescript
import { BoredApeYachtClub, Nft } from "generated";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

BoredApeYachtClub.Transfer.handler(async ({ event, context }) => {
  if (event.params.from === ZERO_ADDRESS) {
    // mint
    const nft: Nft = {
      id: event.params.tokenId.toString(),
      owner: event.params.to,
    };
    context.Nft.set(nft);
  } else {
    // transfer
    let nft = await context.Nft.get(event.params.tokenId.toString());
    if (!nft) {
      throw new Error("Can't transfer non-existing NFT");
    }
    nft = { ...nft, owner: event.params.to };
    context.Nft.set(nft);
  }
});
```

We then run `pnpm envio dev` and if we open http://localhost:8080 we should see the owner data for each token inside the Nft table.

<img src="/docs-assets/ipfs-screenshot.jpg" alt="hasura ipfs nft indexing screenshot" width="100%"/>

### Part 2: Fetching IPFS metadata to populate attributes & image location - [305580c](https://github.com/enviodev/bored-ape-yacht-club-indexer/commit/305580c2afd4844ff41b86d891df755041934208)

We then asynchronously fetch the token metadata from IPFS and insert it into our database.

The following annotated diff shows the appropriate changes.

> schema.graphql

```diff
type Nft {
   id: ID! # tokenId
   owner: String!
+  image: String!
+  attributes: String!
 }
```

> src/EventHandlers.ts

```diff
import { BoredApeYachtClub, Nft } from "generated";
+import { tryFetchIpfsFile } from "./utils/ipfs";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

BoredApeYachtClub.Transfer.handler(async ({ event, context }) => {
  if (event.params.from === ZERO_ADDRESS) {
     // mint
+    let metadata = await tryFetchIpfsFile(
+      event.params.tokenId.toString(),
+      context
+    );
+
    const nft: Nft = {
      id: event.params.tokenId.toString(),
      owner: event.params.to,
+      image: metadata.image,
+      attributes: JSON.stringify(metadata.attributes),
    };
    context.Nft.set(nft);
  } else {
    ...
```

> src/utils/ipfs.ts

```typescript
import { handlerContext } from "generated";

type NftMetadata = {
  image: string;
  attributes: Array<any>;
};

// unique identifier for the BoredApeYachtClub IPFS tokenURI
const BASE_URI_UID = "QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq";

async function fetchFromEndpoint(
  endpoint: string,
  tokenId: string,
  context: handlerContext
): Promise<NftMetadata | null> {
  try {
    const response = await fetch(`${endpoint}/${BASE_URI_UID}/${tokenId}`);
    if (response.ok) {
      const metadata: any = await response.json();
      context.log.info(metadata);
      return { attributes: metadata.attributes, image: metadata.image };
    } else {
      throw new Error("Unable to fetch from endpoint");
    }
  } catch (e) {
    context.log.warn(`Unable to fetch from ${endpoint}`);
  }
  return null;
}

export async function tryFetchIpfsFile(
  tokenId: string,
  context: handlerContext
): Promise<NftMetadata> {
  const endpoints = [
    // we cycle through these endpoints to try ensure data availability
    // PINATA_IPFS_GATEWAY is an envio env var that can be set in your .env file, this is a paid gateway although doesn't always guarantee availability
    process.env.PINATA_IPFS_GATEWAY || "",
    "https://cloudflare-ipfs.com/ipfs",
    "https://ipfs.io/ipfs",
  ];

  for (const endpoint of endpoints) {
    const metadata = await fetchFromEndpoint(endpoint, tokenId, context);
    if (metadata) {
      return metadata;
    }
  }

  context.log.error("Unable to fetch from all endpoints"); // could do something more here depending on use case
  return { attributes: ["unknown"], image: "unknown" };
}
```

Now when we run `pnpm envio dev` and open http://localhost:8080 we should also see the metadata for each token inside the Nft table.

<img src="/docs-assets/ipfs-screenshot-2.jpg" alt="hasura ipfs nft indexing screenshot" width="100%"/>

### Part 3: Cache IPFS responses - [2681296](https://github.com/enviodev/bored-ape-yacht-club-indexer/commit/26812969a022eb6e6e1a034f2d5ea8126fa13e58)

This step may not be needed if you’re not frequently fetching data from IPFS however since you may be making several IPFS requests which always return the same responses it may make sense to cache this data locally. This can significantly speed up historical sync times as the data doesn’t need to be fetched from IPFS in future iterations.

For the cached data, we use a SQLite DB. Quite simply we create a table in our database for the token metadata, then during indexing, we first check to see if the token metadata is in our table otherwise we fetch it from IPFS and then save it to our database for future runs.

The following annotated diff shows the appropriate changes to add caching.

> config.yaml

:::info
We extend the end_block to 12342921 to extend the dev block range and cached data amount
:::

```diff
name: bored-ape-yacht-club-nft-indexer
 networks:
   - id: 1
     start_block: 0
+    end_block: 12342921 # first 50,000 blocks
     contracts:
       - name: BoredApeYachtClub
         address:
...
```

> package.json

:::info
We added the sqlite3 dependency to cache the IPFS responses into a local database
:::

```diff
...
   "dependencies": {
     "chai": "4.3.10",
     "envio": "2.1.2",
-    "ethers": "6.8.0"
+    "ethers": "6.8.0",
+    "sqlite3": "^5.1.7"
   },
   "optionalDependencies": {
     "generated": "./generated"
...
```

> src/utils/cache.ts

:::info
The following code allows us to create an SQLite database and read and write token metadata to it
:::

*Make sure to create a `.cache` directory in the root*

```typescript
import sqlite3 from "sqlite3";
import { NftMetadata } from "./types";

// SQLite database initialization
const db = new sqlite3.Database(".cache/cache.db");

export class NftCache {
  static async init() {
    const cache = new NftCache("cache");
    await cache.createTableIfNotExists();
    return cache;
  }

  private readonly key: string;

  private constructor(key: string) {
    this.key = key;
  }

  private async createTableIfNotExists() {
    const query = `
      CREATE TABLE IF NOT EXISTS ${this.key} (
        tokenId TEXT PRIMARY KEY,
        data TEXT
      )
    `;
    await new Promise<void>((resolve, reject) => {
      db.run(query, (err) => {
        if (err) {
          console.error("Error creating table:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public read(tokenId: string): Promise<NftMetadata | null> {
    return new Promise((resolve, reject) => {
      const query = `SELECT data FROM ${this.key} WHERE tokenId = ?`;
      db.get(query, [tokenId], (err, row: any) => {
        if (err) {
          console.error("Error executing query:", err);
          reject(err);
        } else {
          resolve(row ? JSON.parse(row.data) : null);
        }
      });
    });
  }

  public async add(tokenId: string, metadata: NftMetadata) {
    const query = `INSERT INTO ${this.key} (tokenId, data) VALUES (?, ?)`;
    const data = JSON.stringify(metadata);

    return new Promise<void>((resolve, reject) => {
      db.run(query, [tokenId, data], (err) => {
        if (err) {
          console.error("Error executing query:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
```

> src/utils/ipfs.ts

:::info
In our IPFS fetch logic, we now read it from the cache if it exists, otherwise, we fetch it from IPFS and then save it to our database for future runs.
:::

```diff
 import { handlerContext } from "generated";
-
-type NftMetadata = {
-  image: string;
-  attributes: Array<any>;
-};
+import { NftMetadata } from "./types";
+import { NftCache } from "./cache";

 const BASE_URI_UID = "QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq";

export async function tryFetchIpfsFile(
   tokenId: string,
   context: handlerContext
 ): Promise<NftMetadata> {
+  const cache = await NftCache.init();
+  const _metadata = await cache.read(tokenId);
+
+  if (_metadata) {
+    return _metadata;
+  }
+
    const endpoints = [
      process.env.PINATA_IPFS_GATEWAY || "",
      "https://cloudflare-ipfs.com/ipfs",
      "https://ipfs.io/ipfs",
    ];

   for (const endpoint of endpoints) {
     const metadata = await fetchFromEndpoint(endpoint, tokenId, context);
     if (metadata) {
+      await cache.add(tokenId, metadata);
       return metadata;
     }
   }
...

```

> src/utils/types.ts

:::info
We moved the NftMetadata type to a separate file to keep the codebase clean
:::

```typescript
export type NftMetadata = {
  image: string;
  attributes: Array<any>;
};
```

## What is IPFS

IPFS(InterPlanetary File System) is a system designed to store and share data across a decentralized network. It assigns each piece of data a unique identifier, allowing it to be found and accessed without relying on a central server. Data is distributed across many nodes, making it resilient and hard to censor. It’s a practical tool for storing information and files in a decentralized manner that would otherwise be too expensive to store on-chain.

## Common use cases of IPFS with smart contracts

IPFS is used for images and files hence it is commonly used with decentralized applications that need a decentralized way of storing these images and files, 3 common use cases are presented below.

- NFTs (Non-Fungible Tokens): NFTs are unique digital assets, often representing art, music, or collectibles. The smart contract manages ownership and transfers, while the actual content, like an image or video, is stored on IPFS. This keeps the data decentralized, ensuring that the content linked to the NFT remains accessible and unaltered.
- Decentralized Identity Systems (DIS): In decentralized identity systems, smart contracts handle verification and credentials. The bulk of the identity data—like documents and personal details—is stored on IPFS. This keeps the data safe from tampering and allows for easy access across the network without needing a central authority.
- DAOs (Decentralized Autonomous Organizations): DAOs use smart contracts to enforce rules and manage resources. IPFS is used to store important documents, such as governance proposals, voting records, and financial reports. By using IPFS, these documents are distributed, making them accessible to all members, while remaining secure and tamper-proof.

## Common challenges of IPFS

IPFS can be challenging to work with. We suggest using a paid gateway but even these don’t necessarily guarantee availability.

1. **Slow Retrieval Times**: IPFS data retrieval can be slow, especially if the data isn’t widely replicated across the network. If only a few nodes are hosting the data, or if those nodes are far from the requesting node, it can take time to fetch the data.
1. **Unreliable Gateways**: Free IPFS gateways, often used to access data, can be unreliable. These gateways might not always return the data, either due to network congestion, limited resources, or simply because the gateway is down. This can lead to inconsistent access to IPFS-hosted content, forcing users to switch between gateways or run their own to ensure reliability.
1. **Data Availability**: Data on IPFS might become unavailable if the nodes that originally hosted it go offline. Unlike traditional web servers, there’s no guarantee that someone will always be hosting the data, making persistence a challenge unless a pinning service or multiple nodes maintain copies.
