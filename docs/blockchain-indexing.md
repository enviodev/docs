---
id: blockchain-indexing
title: Blockchain Indexing
sidebar_label: Indexing 101
slug: /blockchain-indexing
---

Blockchain technology has revolutionized the way we store and access data. The decentralized nature of blockchain allows for transparency and immutability, making it an ideal technology for a variety of industries and use cases. Every blockchain project is trying to build something fresh, innovative and unique. 

### The elephant in the room

<img alt="elephant in the room" src="/img/elephant-in-the-room-2.png" width="400px" height="100%" style="margin:auto" />

All of these applications produce and store a variety of underutilized data across multiple networks, which is inherently difficult, complex and computationally expensive to retrieve & read, especially when it comes down to:

- Speed
- Reliability 
- Scalability
- Customizability
- Aggregation (e.g. multi-chain app)

This makes it difficult for developers to query data efficiently, thus maximizing the time you spend on infrastructure and maintenance, where a project's main focus should be on shipping. 

The most common methods or services used to query data from the blockchain:

- Hosting your own dedicated node (e.g. locally, co-location or cloud service provider)
- Using a RPC node provider (e.g. public or private)
- Blockchain indexing solution providers (backend as a service)

### Hosting your own dedicated node

Hosting a node yourself and then querying that node directly can be done by using an Ethereum client. An Ethereum client is the respective blockchain platform's “client” software on a machine, which will download, verify, and propagate new blocks across a blockchain network. It uses a JSON-RPC specification to provide a uniform set of methods for accessing blockchain data commonly known as RPC node.

There are currently two types of node client software: execution clients and consensus clients. Execution layer clients are responsible for managing the overall state of the blockchain and completing transactions, and consensus layer clients are responsible for verifying transactions. 

To propagate transactions across the network, nodes use a series of P2P networking protocols to discover new nodes, establish secure connections, and synchronize state, blocks, and pooled transactions.

Web3 developers may choose to run an RPC node to read and write data to the blockchain. Some developers choose to run their own nodes to customize the node configuration, increase security, and make system-level optimizations that are not possible using shared or dedicated nodes with a RPC provider.

#### Trade-offs

There are three main trade-offs with running a node on your own compared to using an RPC node provider, including maintenance, time, and reliability costs.

- Running your own full node requires dedicated hardware (e.g. RAM, storage, etc.) to download, validate, and store transaction information. Maintaining hardware to support changing levels of product usage is important to balance capacity and fault tolerance for your customers without overspending.

- The maintenance costs of running a node will be highly dependent on whether you use a provider like Amazon Web Services, run a bare-metal server, engineering time, and the amount of hardware and bandwidth resources you need for your specific application

- Running and maintaining blockchain nodes can involve lots of technical issues, which can be difficult and time-consuming for beginners.


For web3 startups with limited funding and engineering time, dedicating a non-trivial amount of engineering resources to managing their own infrastructure comes at the cost of not focusing on building out the core functionality of their product. 

> In today's fast-paced Web3 environment, time is of the essence to stand out in a crowded space. With an endless stream of innovative products being released daily, reducing time-to-market is critical to success - Sven, Growth at Envio.

Startups considering running their own node face numerous reliability and scalability issues such as bugs in software updates, CPU spikes, memory leaks, disk issues, inconsistent peering, and data accuracy across a fleet of nodes.

Unreliable nodes not only take time away from engineers that could be building core functionality of their product, but it directly impacts the user experience. When nodes go down, users can not use your product, which has many potential downstream implications such user retention, where users churn to alternative products.


### Using a RPC node provider

RPC nodes function by connecting your application to all of the blockchain’s data, and is able to retrieve your application's necessary requests to the blockchain and return requested payloads back to your application. 

Node RPC endpoints are categorized into two main infrastructure offerings: public and private. 

- Public RPC Endpoints are shared, rate-limited resources which run on RPC nodes available for any person to make requests to. Blockchains offer public RPC endpoints because they allow anybody to send and receive data from the blockchain (e.g. make a transaction). Public endpoints are free and ready to use at any time, and because they are not meant to support production-grade applications, they are often rate-limited. Further, public RPC endpoints have limited customer support, lack active developer infrastructure, and do not scale to the demands of running dApps.

- Private RPC endpoints are those that operate in order to service your dApp’s needs alone, avoiding request congestion created by other programs and benefiting from a fast and consistent RPC service. Private RPC nodes run at your request. Additionally, if you’re using a node provider, private RPC endpoints often maintain explicit service-level agreements (SLAs), guaranteeing your dApp performant service, whenever you need it.

RPC node providers handle all node setup, management and maintenance for your dApp and ensure that it’s running smoothly, and is the best practice for the majority of web3 builders.

Therefore, by choosing a node provider, all node setup and maintenance responsibility is relieved from the developer. The top blockchain node providers have these features integrated natively, saving developers time and energy to focus on building innovative end-user products. Node providers are available for most leading blockchains such as Ethereum and Solana and also Layer-2s like

#### Trade-offs

RPC node providers predominantly focus only solving two of the said challenges for developers and production-grade blockchain powered applications to query data efficiently and effectively from the blockchain: 

- &#x2612; Speed
- &#x2611; Reliability
- &#x2611; Scalability
- &#x2612; Customisability
- &#x2612; Aggregation (e.g. multi-chain app)

However even the challenges RPC node providers aim to solve are a good whether they using the best tech and most efficient methods to solve these user problems. RPC nodes are typically base-level tech and form one the simplest building blocks of blockchain technology. 

For one, RPC nodes require are request-heavy, which demands a lot of work and back and forth communication of the network. 

In addition, to program all that also consumes a lot of time, which is the most valuable asset a developer has. e.g if a user has one hundred tokens, one hundred requests would need to be sent to get the balance of every token. Applications that are built around RPC nodes are also difficult to maintain. As such, it drains your resources trying to maintain and also keeping them up to date.

Furthermore, building your own indexes means you’ll spend weeks, if not months, developing the backend part of your application's needs and use cases. 

However, when we use a proper Web3 SDK, we solve this by a single request – we just ask for a user’s balance, and it automatically covers all types of tokens and coins. Moreover, you have to keep in mind that checking a balance is a basic task. Just imagine the number of requests you would require to use RPC nodes to do more advanced queries and computations. 

Furthermore, imagine your backend is also pre-built and you've got a team of subject matter experts to present information within your application in a few clicks. 

This is where another form of querying and storing blockchain data exists and is an emerging space with a number of Blockchain Indexing solutions forming an integral part of every blockchain=powered application.

### Blockchain indexing solution providers 

Full-stack blockchain indexing SDK are next paradigm in comparison to building around RPC nodes. As such, it makes the development lifecycle of applications quick, and predominantly about the frontend. Blockchain indexing solutions offer Web3 SDKs with all the materials and tools as far as the backend portion of your application goes. 

As a blockchain developer, you should never speak with an RPC node directly unless you really have to. For instance, when you need to upload a smart contract, you have to communicate directly with the RPC node. However, for most of the Web3 development process (especially to fetch data from the blockchain), this is not necessary when you using blockchain indexing solutions. 

Blockchain indexing solutions prioritize developer experience and performance, and  mostly takes care of the entire blockchain-related backend development. As such, anyone proficient in JavaScript and able to use MetaMask can create blue-chip applications in a shorter period of time.

Most importantly though, is the customisability that blockchain indexing solution providers offer. Whether you're building a decentralized exchange (DEX), a decentralized autonomous organization (DAO), an immersive Game-Fi experience, a multi-chain NFT marketplace, or the next big P2E (play-to-earn) project in Web3, blockchain indexers offer the customisability to support your project's specific use cases. 

#### What is an indexer?

An indexer is a specialised tool that organises and indexes blockchain data, making it easier for developers to efficiently query, retrieve, and utilise advanced data on-chain. Blockchain indexing solutions abstract the complexity away from the developer and improves the overall developer experience.

A blockchain indexing solution's core components from an end-user perspective typically includes:
- Configuration (e.g. `config.yaml`) containing configuration items for your indexer, such as smart contract address, chain, rpc endpoint, start block, abi path

- GraphQL schema file (e.g. `schema.graphql`) which defines the schema for your application, i.e. all the possible data and types of data your application can query via the GraphQL API. 

- Event Handlers (e.g. `handlers.ts`) is a component or function that listens for specific events in a blockchain system and performs actions in response to those events.

<img alt="envio-conceptual-design" src="/img/envio-conceptual-design.png"/>


#### How does Envio compare to traditional blockchain indexing solutions?

For one, Envio allows you to receive the data you need from multiple data sources, in a unified database, and eradicates the need to deploy and maintain multiple API instance, when compared to traditional blockchain indexing solutions. Envio allows the aggregation of data (i.e. same db table) from multiple data sources, which is a great use case for multi-chain applications. This is also illustrated by the diagram below. 

<img alt="envio-solution-architecture" src="/img/envio-solution-architecture.png"/>






