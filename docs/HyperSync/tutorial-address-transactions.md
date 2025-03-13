---
id: tutorial-address-transactions
title: Analyzing All Transactions To and From an Address
sidebar_label: Analyzing Address Transactions
slug: /tutorial-address-transactions
---

# Analyzing All Transactions To and From an Address

## Introduction

Understanding all transactions to and from an address is an interesting use case. Traditionally extracting this information would be very difficult with an RPC. In this tutorial, we'll introduce you to the [evm-address-summary](https://github.com/enviodev/evm-address-summary) tool, which uses HyperSync to efficiently extract all transactions associated with a specific address.

## About evm-address-summary

The [evm-address-summary](https://github.com/enviodev/evm-address-summary) repository contains a collection of scripts designed to get activity related to an address. These scripts leverage HyperSync's efficient data access to make complex address analysis simple and quick.

**GitHub Repository**: [https://github.com/enviodev/evm-address-summary](https://github.com/enviodev/evm-address-summary)

## Available Scripts

The repository offers several specialized scripts:

1. **All Transfers**: This script scans the entire blockchain (from block 0 to the present) and retrieves all relevant transactions for the given address. It iterates through these transactions and sums up their values to calculate aggregates for each token.

2. **NFT Holders**: This script scans the entire blockchain and retrieves all token transfer events for an ERC721 address. It records all the owners of these tokens and how many tokens they have traded in the past.

3. **ERC20 Transfers and Approvals**: This script scans the blockchain and retrieves all ERC20 transfer and approval events for the given address.

It calculates the following:

- **Token balances**: Summing up all incoming and outgoing transfers for each token
- **Token transaction counts**: Counting the number of incoming and outgoing transactions for each token
- **Approvals**: Tracking approvals for each token, including the spender and approved amount

## Quick Start Guide

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [pnpm](https://pnpm.io/installation) (recommended)
- Git

### Basic Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/enviodev/evm-address-summary.git
   cd evm-address-summary
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Run a Script** (example with all-transfers)
   ```bash
   pnpm run all-transfers 0xYourAddressHere
   ```

For complete details on all available scripts, their usage, and example outputs, refer to the [project README](https://github.com/enviodev/evm-address-summary#readme).

## Customizing Network Endpoints

The scripts work with any network supported by HyperSync. To change networks, edit the `hyperSyncEndpoint` in the appropriate config file:

```typescript
// For Ethereum Mainnet
export const hyperSyncEndpoint = "https://eth.hypersync.xyz";
```

For a complete list of supported networks, see our [HyperSync Supported Networks](/docs/HyperSync/hypersync-supported-networks) documentation.

## Practical Use Cases

One powerful application is measuring value at risk for any address, similar to [revoke.cash](https://revoke.cash). You can quickly scan an address to find all approvals and transfers to easily determine any outstanding approvals on any token. This helps identify potential security risks from forgotten token approvals.

Other use cases include:

- Portfolio tracking and analysis
- Auditing transaction history
- Research on token holder behavior
- Monitoring NFT ownership changes

## Next Steps

- Check out the [evm-address-summary repository](https://github.com/enviodev/evm-address-summary) for full documentation
- Explore the source code to understand how HyperSync is used for data retrieval
- Try modifying the scripts for your specific use cases
- Learn more about [HyperSync's capabilities](/docs/HyperSync/hypersync-query) for blockchain data analysis

For any questions or support, join our [Discord community](https://discord.gg/Q9qt8gZ2fX) or create an issue on the GitHub repository.
