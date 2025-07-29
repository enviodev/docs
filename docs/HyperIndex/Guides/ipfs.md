---
id: ipfs
title: Using IPFS with Envio Indexers
sidebar_label: IPFS Integration
slug: /ipfs
---

# Indexing IPFS Data with Envio

> **Example Repository:** The complete code for this guide can be found [here](https://github.com/enviodev/bored-ape-yacht-club-indexer)
>
> **Important Note:** The example repository contains a SQLite caching implementation which is **not supported** on the Envio hosted service. This guide has been updated to exclude the SQLite implementation, focusing only on approaches compatible with the hosted environment.

## Introduction

This guide demonstrates how to fetch and index data stored on IPFS within your Envio indexer. We'll use the [Bored Ape Yacht Club](https://www.boredapeyachtclub.com/) NFT collection as a practical example, showing you how to retrieve and store token metadata from IPFS.

IPFS (InterPlanetary File System) is commonly used in blockchain applications to store larger data like images and metadata that would be prohibitively expensive to store on-chain. By integrating IPFS fetching capabilities into your indexers, you can provide a more complete data model that combines on-chain events with off-chain metadata.

## Implementation Overview

Our implementation will follow these steps:

1. Create a basic indexer for Bored Ape Yacht Club NFT transfers
2. Extend the indexer to fetch and store metadata from IPFS
3. Handle IPFS connection issues with fallback gateways

## Step 1: Setting Up the Basic NFT Indexer

First, let's create a basic indexer that tracks NFT ownership:

### Initialize the Indexer

```bash
pnpx envio init
```

When prompted, enter the Bored Ape Yacht Club contract address: `0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`

### Configure the Indexer

Modify the configuration to focus on the Transfer events:

```yaml
# config.yaml
name: bored-ape-yacht-club-nft-indexer
networks:
  - id: 1
    start_block: 0
    end_block: 12299114 # Optional: limit blocks for development
    contracts:
      - name: BoredApeYachtClub
        address:
          - 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D
        handler: src/EventHandlers.ts
        events:
          - event: Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
```

### Define the Schema

Create a schema to store NFT ownership data:

```graphql
# schema.graphql
type Nft {
  id: ID! # tokenId
  owner: String!
}
```

### Implement the Event Handler

Track ownership changes by handling Transfer events:

```typescript
// src/EventHandler.ts
import { BoredApeYachtClub } from "generated";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

BoredApeYachtClub.Transfer.handler(async ({ event, context }) => {
  if (event.params.from === ZERO_ADDRESS) {
    // mint
    context.Nft.set({
      id: event.params.tokenId.toString(),
      owner: event.params.to,
    });
  } else {
    // transfer
    const nft = await context.Nft.getOrThrow(event.params.tokenId.toString());
    context.Nft.set({
      ...nft,
      owner: event.params.to,
    });
  }
});
```

Run your indexer with `pnpm dev` and visit http://localhost:8080 to see the ownership data:

![Basic NFT ownership data](/docs-assets/ipfs-screenshot.jpg)

## Step 2: Fetching IPFS Metadata

Now, let's enhance our indexer to fetch metadata from IPFS:

### Update the Schema

Extend the schema to include metadata fields:

```graphql
# schema.graphql
type Nft {
  id: ID! # tokenId
  owner: String!
  image: String!
  attributes: String! # JSON string of attributes
}
```

### Create IPFS Effect

We'll use the [Effect API](/docs/HyperIndex/loaders#effect-api-experimental) to fetch the IPFS metadata. Let's put it in the `src/effects/ipfs.ts` file:

```typescript
// src/utils/ipfs.ts
import { experimental_createEffect, S, type EffectContext } from "envio";

const nftMetadataSchema = S.schema({
  image: S.string,
  attributes: S.string,
});

type NftMetadata = S.Output<typeof nftMetadataSchema>;

// unique identifier for the BoredApeYachtClub IPFS tokenURI
const BASE_URI_UID = "QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq";

const endpoints = [
  // Try multiple endpoints to ensure data availability
  // Optional paid gateway (set in .env)
  ...(process.env.PINATA_IPFS_GATEWAY ? [process.env.PINATA_IPFS_GATEWAY] : []),
  "https://cloudflare-ipfs.com/ipfs",
  "https://ipfs.io/ipfs",
];

async function fetchFromEndpoint(
  context: EffectContext,
  endpoint: string,
  tokenId: string
): Promise<NftMetadata | null> {
  try {
    const response = await fetch(`${endpoint}/${BASE_URI_UID}/${tokenId}`);
    if (response.ok) {
      const metadata: any = await response.json();
      return {
        image: metadata.image,
        attributes: JSON.stringify(metadata.attributes),
      };
    } else {
      context.log.warn(`IPFS didn't return 200`, { tokenId, endpoint });
      return null;
    }
  } catch (e) {
    context.log.warn(`IPFS fetch failed`, { tokenId, endpoint, err: e });
    return null;
  }
}

export const getIpfsMetadata = experimental_createEffect(
  {
    name: "getIpfsMetadata",
    input: S.string,
    output: nftMetadataSchema,
  },
  async ({ input: tokenId, context }) => {
    for (const endpoint of endpoints) {
      const metadata = await fetchFromEndpoint(context, endpoint, tokenId);
      if (metadata) {
        return metadata;
      }
    }

    // ⚠️ Dangerous: Sometimes it's better to crash, to prevent corrupted data
    // But we're going to use a fallback value, to keep the indexer process running.
    // Both approaches have their pros and cons.
    context.log.warn(
      "Unable to fetch IPFS. Continuing with fallback metadata.",
      {
        tokenId,
      }
    );
    return { attributes: `["unknown"]`, image: "unknown" };
  }
);
```

### Update the Event Handler

Let's modify the event handler to fetch and store metadata using the `getIpfsMetadata` effect:

```typescript
// src/EventHandlers.ts
import { BoredApeYachtClub } from "generated";
import { getIpfsMetadata } from "./utils/ipfs";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

BoredApeYachtClub.Transfer.handler(async ({ event, context }) => {
  if (event.params.from === ZERO_ADDRESS) {
    // mint
    const metadata = await context.effect(
      getIpfsMetadata,
      event.params.tokenId.toString()
    );
    context.Nft.set({
      id: event.params.tokenId.toString(),
      owner: event.params.to,
      image: metadata.image,
      attributes: metadata.attributes,
    });
  } else {
    // transfer
    const nft = await context.Nft.getOrThrow(event.params.tokenId.toString());
    context.Nft.set({
      ...nft,
      owner: event.params.to,
    });
  }
});
```

When you run the indexer now, it will populate both ownership data and token metadata:

![NFT ownership and metadata](/docs-assets/ipfs-screenshot-2.jpg)

## Best Practices for IPFS Integration

When working with IPFS in your indexers, consider these best practices:

### 1. Use Multiple Gateways

IPFS gateways can be unreliable, so always implement multiple fallback options:

```typescript
const endpoints = [
  ...(process.env.PAID_IPFS_GATEWAY ? [process.env.PAID_IPFS_GATEWAY] : []),
  "https://cloudflare-ipfs.com/ipfs",
  "https://ipfs.io/ipfs",
  "https://gateway.pinata.cloud/ipfs",
];
```

### 2. Handle Failures Gracefully

Always include error handling and provide fallback values:

```typescript
try {
  // IPFS fetch logic
} catch (error) {
  context.log.error(`Failed to fetch from IPFS`, error as Error);
  return { attributes: [], image: "default-image-url" };
}
```

### 3. Implement Local Caching (For Local Development)

Follow the [Effect API Persistence](/docs/HyperIndex/loaders#persistence) guide to implement caching for local development. This should allow you to avoid repeatedly fetching the same data.

```typescript
export const getIpfsMetadata = experimental_createEffect(
  {
    name: "getIpfsMetadata",
    input: S.string,
    output: nftMetadataSchema,
    cache: true, // Enable caching
  },
  async ({ input: tokenId, context }) => {...}
);
```

> **Important:** While the example repository includes SQLite-based caching, this approach is outdated and leads to many indexing issues.

> **Note:** We're working on a better integration with the hosted service. Currently, due to the cache size, it's not recommended to commit the `.envio/cache` directory to the GitHub repository.

### 4. Improve Performance with Loaders

The solution will perform external calls for each handler one by one. This is not efficient and can be improved with loaders.
Follow the [Going All-In with Loaders](/docs/HyperIndex/loaders#going-all-in-with-loaders) guide to make your indexer dozens of times faster.

```typescript
// src/EventHandlers.ts
import { BoredApeYachtClub } from "generated";
import { getIpfsMetadata } from "../utils/ipfs";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

BoredApeYachtClub.Transfer.handlerWithLoader({
  loader: async ({ event, context }) => {
    if (event.params.from === ZERO_ADDRESS) {
      // mint
      const metadata = await context.effect(
        getIpfsMetadata,
        event.params.tokenId.toString()
      );
      context.Nft.set({
        id: event.params.tokenId.toString(),
        owner: event.params.to,
        image: metadata.image,
        attributes: metadata.attributes,
      });
    } else {
      // transfer
      const nft = await context.Nft.getOrThrow(event.params.tokenId.toString());
      context.Nft.set({
        ...nft,
        owner: event.params.to,
      });
    }
  },
  handler: async (_) => {},
});
```

## Understanding IPFS

### What is IPFS?

IPFS (InterPlanetary File System) is a distributed system for storing and accessing files, websites, applications, and data. It works by:

1. Splitting files into chunks
2. Creating content-addressed identifiers (CIDs) based on the content itself
3. Distributing these chunks across a network of nodes
4. Retrieving data based on its CID rather than its location

### Common Use Cases with Smart Contracts

IPFS is frequently used alongside smart contracts for:

- **NFTs**: Storing images, videos, and metadata while the contract manages ownership
- **Decentralized Identity Systems**: Storing credential documents and personal information
- **DAOs**: Maintaining governance documents, proposals, and organizational assets
- **dApps**: Hosting front-end interfaces and application assets

### IPFS Challenges

IPFS integration comes with several challenges:

1. **Slow Retrieval Times**: IPFS data can be slow to retrieve, especially for less widely replicated content
2. **Gateway Reliability**: Public gateways can be inconsistent in their availability
3. **Data Persistence**: Content may become unavailable if nodes stop hosting it

To mitigate these issues:

- Use pinning services like Pinata or Infura to ensure data persistence
- Implement multiple gateway fallbacks
- Consider paid gateways for production applications
