---
id: terminology
title: Terminology
sidebar_label: Terminology
slug: /terminology
---

### Address
A unique identifier representing an account or entity within a blockchain network.
### API
Application Programming Interface, a set of protocols and tools for building software applications.
### Block
A collection of data containing a set of transactions that are bundled together and added to the blockchain.
### Codegen
The process of automatically generating code based on a given input, often used in blockchain development for generating client libraries or interfaces.
### Endpoint
A URL that can be used to query an Envio custom API.
### Envio CLI
A command line interface tool for building and deploying to Envio indexers.
### Event
An event is specific occurrence or action within a blockchain system that is specified in smart contracts, and can be used to emit data from the blockchain. Conversely, smart contracts can emit events to essentially communicate that something has happened on the blockchain.

Web applications or any kind of application (e.g. mobile app, backend job, etc.) can listen to events and take actions when they occur. Events are typically data that are not stored on-chain as it would be considerably more expensive to store.

Here is an example of declaring an event, and then emitting the same event once the event occurs:

Declaring an event:  
`event Deposit(address indexed _from, bytes32 indexed _id, uint _value);`

Emitting an event:   
`emit Deposit(msg.sender, _id, msg.value);`
### Event Handler
A function that listens for a specific event from a smart contract and either updates or inserts new data into your Envio API.
### EVM
Ethereum Virtual Machine (EVM), a runtime environment that executes smart contracts on the Ethereum blockchain.
### EVM compatible
The ability for a blockchain to run the EVM and execute Ethereum smart contracts. In the context of Envio, it's the ability to deploy a unified api to retrieve data from multiple EVM-compatible blockchains (e.g. Ethereum, BSC, Arbitrum, Polygon, Avalanche, Optimism, Fantom, Cronos, etc.) 
### GraphQL
A query language for interacting with APIs, commonly used in blockchain systems for retrieving specific data from the blockchain platforms. As an alternative to REST, GraphQL lets developers construct requests that pull data from multiple data sources in a single API call.
### GraphQL API
The data presentation part of Envio indexer. Typically, it's a GraphQL API auto-generated from the schema file.
### Hosted Service
A managed service platform for building, hosting and querying Envio's Indexers with guaranteed uptime and performance service level agreements. 
### Indexer 
A specialized database management system (DBMS) that indexes and organises blockchain data, making it easier for developers to efficiently query, retrieve, and utilise on-chain data. Web2 apps usually rely on indexers like Google to pre-sort information into indices for data retrieval and filtering. In blockchain and in Web3, applications need to indexers to achieve data retrieval in the same way.
### JavaScript
JavaScript is a high-level, interpreted programming language that is primarily used for client-side scripting in web browsers. It is the de facto language for web development and has been around for a long time. It is the language of the web, enabling developers to create interactive and dynamic web applications.
### Node
A device or computer that participates in a blockchain network, maintaining a copy of the blockchain and validating transactions.
### Ploffen

Ploffen means "Pop" in Dutch and is a fun game based on an ERC20 token contract, where users can deposit a game token (i.e. make a contribution) into a perpetual savings pool. 

The last user to add a contribution to the savings pool has a chance of winning the entire savings pool if no other user doesn't subsequently deposit a contribution within 1 hour of the previous contribution made. For example, if 30 persons play the game, and each person contributes a small amount, the last person can stand a chance of winning the *total contributions* made by all 30 persons in the savings pool. 

The Ploffen project example demonstrates a basic Hardhat use case for developers. It comes with a sample contract, a test for that contract, a script that deploys that contract, as well as the Envio integration to index emitted events. 
<!-- Add gh repo link once public  -->
### Query
A request for data. In the case of Envio, a query is a request for data from a Envio API that will be answered by an Envio Indexer.
### ReScript
ReScript is robustly typed language that compiles to efficient and human-readable JavaScript. ReScript aims to bring the power and expressiveness of functional programming to JavaScript development. It offers a seamless integration with JavaScript and provides features like static typing, pattern matching, and immutable data structures.
### Schema File
A file used to define entities based on events emitted from the smart contract and the data types for these entities.
### SDK
Software Development Kit” is a collection of tools, libraries, and documentation that facilitates the development of applications for a specific platform or system.
### Smart Contract
Smart contracts are a type of Ethereum account. This means they have a balance and can be the target of transactions. However they're not controlled by a user, instead they are deployed to the network and run as programmed. User accounts can then interact with a smart contract by submitting transactions that execute a function defined on the smart contract.
### Tokens
A digital representation of an asset or utility within a blockchain system that follows a specific standard. The ERC-20 token for example, is a standard for creating and issuing smart contracts for fungible tokens on the EVM-compatible blockchains.
### Transaction
An action or set of actions recorded on the blockchain, typically involving the transfer of assets, execution of smart contracts, or other network interactions.
### TypeScript
TypeScript is a superset of JavaScript that adds static typing and other advanced features to the language. It compiles down to plain JavaScript, making it compatible with existing JavaScript codebase. TypeScript helps developers catch errors during development by providing type checking and improved tooling support. It enhances JavaScript by adding features like interfaces, classes, modules, and generics.












