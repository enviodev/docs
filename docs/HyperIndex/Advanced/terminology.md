---
id: terminology
title: Terminology & Key Concepts
sidebar_label: Terminology
slug: /terminology
description: Explore key terms for fast reference and blockchain indexer development.
---

# HyperIndex Terminology & Key Concepts

This comprehensive glossary explains the key terms and concepts used throughout the Envio documentation and ecosystem. Terms are organized by category for easier reference.

## Table of Contents

- [Blockchain Fundamentals](#blockchain-fundamentals)
- [Smart Contract Concepts](#smart-contract-concepts)
- [Indexing & Data](#indexing--data)
- [Development Tools](#development-tools)
- [Programming Languages](#programming-languages)
- [Envio Platform](#envio-platform)
- [Mathematical Concepts](#mathematical-concepts)

## Blockchain Fundamentals

### Address

A unique identifier representing an account or entity within a blockchain network. Addresses are typically represented as hexadecimal strings (e.g., `0x1234...abcd`) and used to send, receive, or interact with blockchain resources.

### Block

A collection of data containing a set of transactions that are bundled together and added to the blockchain. Blocks are linked together chronologically to form the blockchain.

### EVM

**Ethereum Virtual Machine (EVM)** is a runtime environment that executes smart contracts on the Ethereum blockchain. It provides a sandboxed and deterministic execution environment for smart contract code.

### EVM Compatible

The ability for a blockchain to run the EVM and execute Ethereum smart contracts. In the context of Envio, it's the ability to deploy a unified API to retrieve data from multiple EVM-compatible blockchains (e.g., Ethereum, BSC, Arbitrum, Polygon, Avalanche, Optimism, Fantom, Cronos, etc.).

### Node

A device or computer that participates in a blockchain network, maintaining a copy of the blockchain and validating transactions.

### Transaction

An action or set of actions recorded on the blockchain, typically involving the transfer of assets, execution of smart contracts, or other network interactions. Once confirmed, transactions become a permanent part of the blockchain.

## Smart Contract Concepts

### Event

A specific occurrence or action within a blockchain system that is specified in smart contracts and used to emit data from the blockchain. Smart contracts can emit events to essentially communicate that something has happened on the blockchain.

Web applications or any kind of application (e.g., mobile app, backend job, etc.) can listen to events and take actions when they occur. Events are typically data that are not stored on-chain as it would be considerably more expensive to store.

**Example:**

Declaring an event:

```solidity
event Deposit(address indexed _from, bytes32 indexed _id, uint _value);
```

Emitting an event:

```solidity
emit Deposit(msg.sender, _id, msg.value);
```

### Event Handler

A function that listens for a specific event from a smart contract and either updates or inserts new data into your Envio API. Event handlers define the business logic for processing blockchain events.

### Smart Contract

A self-executing program with the terms of an agreement directly written into code that runs on the blockchain. Smart contracts are not controlled by a user but are deployed to the network and run as programmed. User accounts can interact with smart contracts by submitting transactions that execute defined functions.

### Tokens

Digital representations of assets or utilities within a blockchain system that follow a specific standard. Common token standards include:

- **ERC-20**: Standard for fungible tokens (identical and interchangeable)
- **ERC-721**: Standard for non-fungible tokens (unique and non-interchangeable)
- **ERC-1155**: Multi-token standard supporting both fungible and non-fungible tokens

## Indexing & Data

### API

**Application Programming Interface** is a set of protocols and tools for building software applications. APIs define how different software components should interact with each other.

### Endpoint

A URL that can be used to query an Envio custom API. Endpoints provide a structured way to request specific data from the indexer.

### GraphQL

A query language for interacting with APIs, commonly used in blockchain systems for retrieving specific data from blockchain platforms. As an alternative to REST, GraphQL lets developers construct requests that pull data from multiple data sources in a single API call.

### GraphQL API

The data presentation part of an Envio indexer. Typically, it's a GraphQL API auto-generated from the schema file, allowing flexible and efficient data queries.

### Blockchain Indexer

A specialized database management system (DBMS) that indexes and organizes blockchain data, making it easier for developers to efficiently query, retrieve, and utilize on-chain data.

Web2 apps usually rely on indexers like Google to pre-sort information into indices for data retrieval and filtering. In blockchain and Web3, applications need blockchain indexers to achieve similar data retrieval capabilities.

### Query

A request for data. In the context of Envio, a query is a request for data from an Envio API that will be answered by an Envio Indexer.

### Schema File

A file that defines entities based on events emitted from smart contracts and specifies the data types for these entities. The schema serves as the blueprint for your indexed data structure.

## Development Tools

### Codegen

The process of automatically generating code based on a given input. In blockchain development, codegen is often used for generating client libraries, interfaces, or type-safe data access layers from schemas or specifications.

### Envio CLI

A command line interface tool for building and deploying Envio indexers. The CLI provides commands for initializing, developing, and managing your indexer projects.

### SDK

**Software Development Kit** is a collection of tools, libraries, and documentation that facilitates the development of applications for a specific platform or system.

## Programming Languages

### JavaScript

A high-level, interpreted programming language primarily used for client-side scripting in web browsers. It is the de facto language for web development, enabling developers to create interactive and dynamic web applications.

### ReScript

A robustly typed language that compiles to efficient and human-readable JavaScript. ReScript aims to bring the power and expressiveness of functional programming to JavaScript development. It offers seamless integration with JavaScript and provides features like static typing, pattern matching, and immutable data structures.

### TypeScript

A superset of JavaScript that adds static typing and other advanced features to the language. It compiles down to plain JavaScript, making it compatible with existing JavaScript codebases. TypeScript helps developers catch errors during development by providing type-checking and improved tooling support. It enhances JavaScript by adding features like interfaces, classes, modules, and generics.

## Envio Platform

### Hosted Service

A managed service platform for building, hosting, and querying Envio's Indexers with guaranteed uptime and performance service level agreements. The Hosted Service removes the operational burden of running blockchain indexers.

### Ploffen

Ploffen (meaning "Pop" in Dutch) is a fun game based on an ERC20 token contract, where users can deposit a game token (i.e., make a contribution) into a savings pool.

The last user to add a contribution to the savings pool has a chance of winning the entire pool if no other user deposits a contribution within 1 hour of the previous contribution. For example, if 30 persons play the game, and each person contributes a small amount, the last person can win the _total contributions_ made by all 30 persons in the savings pool.

The Ploffen project demonstrates a Hardhat framework example. It includes a sample contract, a test for that contract, a deployment script, and the Envio integration to index emitted events from the Ploffen smart contract.

## Mathematical Concepts

### Commutative Property

A fundamental property of certain binary operations in mathematics. An operation is said to be commutative if the order in which you apply the operation to two operands does not affect the result. In other words, for a commutative operation:

a + b = b + a

**Examples of commutative operations:**

1. **Addition**: 2 + 3 = 3 + 2
2. **Multiplication**: 2 _ 3 = 3 _ 2

**Examples of non-commutative operations:**

1. **Subtraction**: 5 - 3 ≠ 3 - 5
2. **Division**: 8 / 4 ≠ 4 / 8
3. **String Concatenation**: "Hello" + "World" ≠ "World" + "Hello"

The commutative property is a property of the operation itself, not necessarily the numbers involved. If an operation is commutative, you can switch the order of the operands without changing the result.
