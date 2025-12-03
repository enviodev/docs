---
id: websockets
title: Using WebSockets with GraphQL
sidebar_label: WebSockets
slug: /websockets
description: Learn how to use WebSocket connections with your HyperIndex GraphQL endpoint
---

# Using WebSockets with GraphQL

> **⚠️ Important**: WebSocket support is available but should be used at your own risk on plans other than dedicated.

## Overview

By default, HyperIndex provides GraphQL endpoints over HTTP/HTTPS. However, you can also connect to your GraphQL endpoint using WebSocket connections (WSS/WS) for real-time subscriptions and persistent connections.

## WebSocket Support Status

WebSocket connections are available with different levels of support depending on your hosting plan:

- **Dedicated**: WebSockets are fully supported. The dedicated package includes additional infrastructure such as connection pooling which enables proper WebSocket support.
- **Other Plans**: WebSocket support is available but should be used at your own risk. These plans do not have the same infrastructure support for WebSockets as dedicated. We don't recommend relying on WebSockets for more than 10 concurrent connections.

## How to Use WebSockets

To use WebSockets with your HyperIndex GraphQL endpoint, simply swap the protocol in your endpoint URL:

### Protocol Mapping

- **HTTPS → WSS**: Change `https://` to `wss://` in your GraphQL endpoint URL
- **HTTP → WS**: Change `http://` to `ws://` in your GraphQL endpoint URL

### Example

If your GraphQL endpoint is:

```
https://indexer.hyperindex.xyz/123abcd/graphql
```

You can connect via WebSocket using:

```
wss://indexer.hyperindex.xyz/123abcd/graphql
```

Similarly, for HTTP endpoints:

```
http://localhost:8080/v1/graphql
```

Becomes:

```
ws://localhost:8080/v1/graphql
```

## Usage Example

Here's a TypeScript example using the `graphql-ws` library to subscribe to real-time updates from your indexer:

```typescript
import { createClient } from 'graphql-ws';

// Define the entity you are subscribing to (must match your schema definition)
interface Swap {
  id: string;
}

interface SubscriptionData {
  data?: {
    Swap?: Swap[];
  };
}

const client = createClient({
  url: 'ws://localhost:8080/v1/graphql',
});

console.log('Connecting to WebSocket...');

client.subscribe<SubscriptionData>(
  {
    query: `
      subscription {
        Swap(order_by: { id: desc }, limit: 10) {
          id
        }
      }
    `,
  },
  {
    next: (data) => {
      console.log('\n📥 New event received:');
      console.log(JSON.stringify(data, null, 2));
    },
    error: (err) => {
      console.error('❌ Error:', err);
    },
    complete: () => {
      console.log('✅ Subscription completed');
    },
  }
);
```

### Installation

To use this example, install the required dependencies:

```bash
npm install graphql-ws ws
# or
yarn add graphql-ws ws
```

## Getting Support

For any questions about WebSocket usage, contact the Envio team via [Telegram](https://t.me/envio) or [Discord](https://discord.gg/envio).


