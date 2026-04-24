---
id: hypersync-clients
title: HyperSync Clients
sidebar_label: Clients
slug: /hypersync-clients
description: Explore HyperSync clients for fast blockchain data access in Node.js, Python, Rust, and Go.
---

# HyperSync Client Libraries

HyperSync provides powerful client libraries that enable you to integrate high-performance blockchain data access into your applications. These libraries handle the communication with HyperSync servers, data serialization/deserialization, and provide convenient APIs for querying blockchain data.

## Quick Links

| Client               | Resources                                                                                                                                                                                                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js**          | [📝 API Docs](https://enviodev.github.io/hypersync-client-node/) · [📦 NPM](https://www.npmjs.com/package/@envio-dev/hypersync-client) · [💻 GitHub](https://github.com/enviodev/hypersync-client-node) · [🧪 Examples](https://github.com/enviodev/hypersync-client-node/tree/main/examples) |
| **Python**           | [📦 PyPI](https://pypi.org/project/hypersync/) · [💻 GitHub](https://github.com/enviodev/hypersync-client-python) · [🧪 Examples](https://github.com/enviodev/hypersync-client-python/tree/main/examples)                                                                                     |
| **Rust**             | [📦 Crates.io](https://crates.io/crates/hypersync-client) · [📝 API Docs](https://docs.rs/hypersync-client/latest/hypersync_client/) · [💻 GitHub](https://github.com/enviodev/hypersync-client-rust) · [🧪 Examples](https://github.com/enviodev/hypersync-client-rust/tree/main/examples)   |
| **Go** _(community)_ | [💻 GitHub](https://github.com/enviodev/hypersync-client-go) · [🧪 Examples](https://github.com/enviodev/hypersync-client-go/tree/main/examples)                                                                                                                                              |
| **API Tokens**       | [🔑 Get Tokens](./api-tokens.mdx)                                                                                                                                                                                                                                                             |

## Client Overview

All HyperSync clients share these key features:

- **High Performance**: Built on a common Rust foundation for maximum efficiency
- **Optimized Transport**: Uses binary formats to minimize bandwidth and maximize throughput
- **Consistent Experience**: Similar APIs across all language implementations
- **Automatic Pagination**: Handles large data sets efficiently
- **Event Decoding**: Parses binary event data into structured formats

Choose the client that best matches your application's technology stack:

| Feature           | Node.js       | Python             | Rust          | Go            |
| ----------------- | ------------- | ------------------ | ------------- | ------------- |
| Async Support     | ✅            | ✅                 | ✅            | ✅            |
| Typing            | TypeScript    | Type Hints         | Native        | Native        |
| Data Formats      | JSON, Parquet | JSON, Parquet, CSV | JSON, Parquet | JSON, Parquet |
| Memory Efficiency | Good          | Better             | Best          | Better        |
| Installation      | npm           | pip                | cargo         | go get        |

## Node.js Client

:::info Resources

- [📝 API Documentation](https://enviodev.github.io/hypersync-client-node/)
- [📦 NPM Package](https://www.npmjs.com/package/@envio-dev/hypersync-client)
- [💻 GitHub Repository](https://github.com/enviodev/hypersync-client-node)
- [🧪 Example Projects](https://github.com/enviodev/hypersync-client-node/tree/main/examples)
  :::

The Node.js client provides a TypeScript-first experience for JavaScript developers.

### Installation

```bash
# Using npm
npm install @envio-dev/hypersync-client

# Using yarn
yarn add @envio-dev/hypersync-client

# Using pnpm
pnpm add @envio-dev/hypersync-client
```

## Python Client

:::info Resources

- [📦 PyPI Package](https://pypi.org/project/hypersync/)
- [💻 GitHub Repository](https://github.com/enviodev/hypersync-client-python)
- [🧪 Example Projects](https://github.com/enviodev/hypersync-client-python/tree/main/examples)
  :::

The Python client provides a Pythonic interface with full type hinting support.

### Installation

```bash
pip install hypersync
```

## Rust Client

:::info Resources

- [📦 Crates.io Package](https://crates.io/crates/hypersync-client)
- [📝 API Documentation](https://docs.rs/hypersync-client/latest/hypersync_client/)
- [💻 GitHub Repository](https://github.com/enviodev/hypersync-client-rust)
- [🧪 Example Projects](https://github.com/enviodev/hypersync-client-rust/tree/main/examples)
  :::

The Rust client provides the most efficient and direct access to HyperSync, with all the safety and performance benefits of Rust.

### Installation

Add the following to your `Cargo.toml`:

```toml
[dependencies]
hypersync-client = "0.1"
tokio = { version = "1", features = ["full"] }
```

## Go Client

:::info Resources

- [💻 GitHub Repository](https://github.com/enviodev/hypersync-client-go)
- [🧪 Example Projects](https://github.com/enviodev/hypersync-client-go/tree/main/examples)
  :::

:::caution Community Maintained
The Go client is community maintained and marked as work-in-progress. For production use, you may want to test thoroughly or consider the officially supported clients.
:::

The Go client provides a native Go interface for accessing HyperSync, with support for streaming and decoding blockchain data.

### Installation

```bash
go get github.com/enviodev/hypersync-client-go
```

## Using API Tokens

:::info Get Your API Token
You'll need an API token to use any HyperSync client. [Get your token here](./api-tokens.mdx).
:::

All HyperSync clients require an API token for authentication. Tokens are used to manage access and usage limits.

To get an API token:

1. Visit [Envio](https://.envio.dev)
2. Register or sign in with your github account
3. Navigate to the API Tokens section
4. Create a new token

For detailed instructions, see our [API Tokens](./api-tokens.mdx) guide.

## Client Selection Guide

Choose the client that best fits your use case:

:::tip Node.js Client
**Choose when**: You're building JavaScript/TypeScript applications or if your team is most comfortable with the JavaScript ecosystem.
:::

:::tip Python Client
**Choose when**: You're doing data science work, need integration with pandas/numpy, or if your team prefers Python's simplicity.
:::

:::tip Rust Client
**Choose when**: You need maximum performance, are doing systems programming, or building performance-critical applications.
:::

:::tip Go Client
**Choose when**: You're working in a Go ecosystem and want native integration with Go applications. Note that this client is community maintained.
:::

## Additional Resources

- [📚 HyperSync Usage Guide](./hypersync-usage)
- [📝 Query Reference](./hypersync-query)
- [🧪 cURL Examples](./hypersync-curl-examples)
- [📊 Supported Networks](./hypersync-supported-networks)

## Support

Need help getting started or have questions about our clients? Connect with our community:

- [Discord Community](https://discord.gg/envio)
- [GitHub Issues](https://github.com/enviodev)
- [Documentation Feedback](https://github.com/enviodev/docs/issues)

```

```
