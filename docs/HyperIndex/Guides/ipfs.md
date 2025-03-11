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
npx envio init
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

### Create IPFS Utility Functions

Create a new file to handle IPFS requests with fallbacks to multiple gateways:

```typescript
// src/utils/ipfs.ts
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
    // Try multiple endpoints to ensure data availability
    process.env.PINATA_IPFS_GATEWAY || "", // Optional paid gateway (set in .env)
    "https://cloudflare-ipfs.com/ipfs",
    "https://ipfs.io/ipfs",
  ];

  for (const endpoint of endpoints) {
    if (!endpoint) continue; // Skip empty endpoints

    const metadata = await fetchFromEndpoint(endpoint, tokenId, context);
    if (metadata) {
      return metadata;
    }
  }

  context.log.error("Unable to fetch from all endpoints");
  return { attributes: ["unknown"], image: "unknown" };
}
```

### Update the Event Handler

Modify the event handler to fetch and store metadata:

```typescript
// src/EventHandlers.ts
import { BoredApeYachtClub, Nft } from "generated";
import { tryFetchIpfsFile } from "./utils/ipfs";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

BoredApeYachtClub.Transfer.handler(async ({ event, context }) => {
  if (event.params.from === ZERO_ADDRESS) {
    // mint
    let metadata = await tryFetchIpfsFile(
      event.params.tokenId.toString(),
      context
    );

    const nft: Nft = {
      id: event.params.tokenId.toString(),
      owner: event.params.to,
      image: metadata.image,
      attributes: JSON.stringify(metadata.attributes),
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

When you run the indexer now, it will populate both ownership data and token metadata:

![NFT ownership and metadata](/docs-assets/ipfs-screenshot-2.jpg)

## Best Practices for IPFS Integration

When working with IPFS in your indexers, consider these best practices:

### 1. Use Multiple Gateways

IPFS gateways can be unreliable, so always implement multiple fallback options:

```typescript
const endpoints = [
  process.env.PAID_IPFS_GATEWAY || "",
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
  context.log.error(`Failed to fetch from IPFS: ${error.message}`);
  return { attributes: [], image: "default-image-url" };
}
```

### 3. Implement Local Caching (For Local Development)

For local development, consider implementing in-memory caching to avoid repeatedly fetching the same data:

```typescript
// Simple in-memory cache for local development
const metadataCache = new Map<string, any>();

async function getMetadata(tokenId: string) {
  // Check cache first
  if (metadataCache.has(tokenId)) {
    return metadataCache.get(tokenId);
  }

  // Fetch from IPFS
  const metadata = await fetchFromIPFS(tokenId);

  // Store in cache
  metadataCache.set(tokenId, metadata);

  return metadata;
}
```

> **Note:** For production indexers, the Envio hosted service automatically handles optimizations. You should not implement persistent file-based caching mechanisms as they are not supported in the hosted environment. Please discuss with the team your options regarding caching.
>
> **Important:** While the example repository includes SQLite-based caching, this approach is not compatible with the Envio hosted service and should not be used for production deployments.

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
