<!--

---


## Indexing B² Testnet Data with Envio


<table>
  <tr>
   <td><strong>B2 Testnet Chain ID</strong>
   </td>
   <td>1123
   </td>
  </tr>
  <tr>
   <td><strong>HyperSync URL Endpoint</strong>
   </td>
   <td><a href="https://b2-testnet.hypersync.xyz/">https://b2-testnet.hypersync.xyz</a> or <a href="https://1123.hypersync.xyz/">https://1123.hypersync.xyz</a>
   </td>
  </tr>
  <tr>
   <td><strong>HyperRPC URL Endpoint</strong>
   </td>
   <td><a href="https://b2-testnet.rpc.hypersync.xyz/">https://b2-testnet.rpc.hypersync.xyz</a> or <a href="https://1123.rpc.hypersync.xyz/">https://1123.rpc.hypersync.xyz</a>
   </td>
  </tr>
</table>



### Overview

Envio is a modular hyper-performant data indexing solution for the B² Testnet, enabling applications and developers to efficiently index and aggregate real-time and historical blockchain data. Envio offers three primary solutions for indexing and accessing large amounts of data: [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) (a customizable indexing framework), [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) (a real-time indexed data layer), and [HyperRPC](https://docs.envio.dev/docs/HyperRPC/overview-hyperrpc) (extremely fast read-only RPC).

HyperSync accelerates the synchronization of historical data on the B² Testnet, enabling what usually takes hours to sync millions of events to be completed in under a minute—up to 1000x faster than traditional RPC methods.

Designed to optimize the user experience, Envio offers automatic code generation, flexible language support, multi-chain data aggregation, and a reliable, cost-effective hosted service.

To get started, see our documentation or follow our quickstart [guide](https://docs.envio.dev/docs/HyperIndex/contract-import).


### Defining Network Configurations


```
name: IndexerName # Specify indexerName name
description: Indexer Description # Include indexer description
networks:
  - id: 1123 # B2 Testnet  
    start_block: START_BLOCK_NUMBER  # Specify the starting block
    contracts:
      - name: ContractName
        address:
         - "0xYourContractAddress1"
         - "0xYourContractAddress2"
        handler: ./src/EventHandlers.ts
        events:
          - event: Event # Specify event
          - event: Event
```


With these steps completed, your application will be set to efficiently index B² data using Envio’s blockchain indexer.

For more information on how to set up your config, define a schema, and write event handlers, refer to the guides section in our [documentation](https://docs.envio.dev/docs/HyperIndex/configuration-file).

The full list of HyperSync supported networks can be found [here](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks).


### Support

Can’t find what you’re looking for or need support? Reach out to us on [Discord](https://discord.com/invite/Q9qt8gZ2fX); we’re always happy to help!


### About The B² Testnet 

B² Testnet is a Layer-2 blockchain built on the B² Network, designed to improve Bitcoin’s scalability and transaction efficiency. It offers a secure and cost-effective platform for developing and testing dApps, enabling faster and cheaper transactions while maintaining Bitcoin’s robust security. Through the use of ZKPs, B² provides enhanced scalability for Bitcoin-based applications


---


## Indexing Base Data with Envio


<table>
  <tr>
   <td><strong>Base Chain ID</strong>
   </td>
   <td>8453
   </td>
  </tr>
  <tr>
   <td><strong>HyperSync URL Endpoint</strong>
   </td>
   <td><a href="https://base.hypersync.xyz/">https://base.hypersync.xyz</a> or <a href="https://8453.hypersync.xyz/">https://8453.hypersync.xyz</a>
   </td>
  </tr>
  <tr>
   <td><strong>HyperRPC URL Endpoint</strong>
   </td>
   <td><a href="https://base.rpc.hypersync.xyz/">https://base.rpc.hypersync.xyz</a> or <a href="https://8453.rpc.hypersync.xyz/">https://8453.rpc.hypersync.xyz</a>
   </td>
  </tr>
</table>



### Overview

Envio is a modular hyper-performant data indexing solution for [Base](https://www.base.org/), enabling applications and developers to efficiently index and aggregate real-time and historical blockchain data. Envio offers three primary solutions for indexing and accessing large amounts of data: [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) (a customizable indexing framework), [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) (a real-time indexed data layer), and [HyperRPC](https://docs.envio.dev/docs/HyperRPC/overview-hyperrpc) (extremely fast read-only RPC).

HyperSync accelerates the synchronization of historical data on Base, enabling what usually takes hours to sync millions of events to be completed in under a minute—up to 1000x faster than traditional RPC methods.

Designed to optimize the user experience, Envio offers automatic code generation, flexible language support, multi-chain data aggregation, and a reliable, cost-effective hosted service.

To get started, see our documentation or follow our quickstart [guide](https://docs.envio.dev/docs/HyperIndex/contract-import).


### Defining Network Configurations


```
name: IndexerName # Specify indexerName name
description: Indexer Description # Include indexer description
networks:
  - id: 8453 # Base  
    start_block: START_BLOCK_NUMBER  # Specify the starting block
    contracts:
      - name: ContractName
        address:
         - "0xYourContractAddress1"
         - "0xYourContractAddress2"
        handler: ./src/EventHandlers.ts
        events:
          - event: Event # Specify event
          - event: Event
```


With these steps completed, your application will be set to efficiently index Base data using Envio’s blockchain indexer.

For more information on how to set up your config, define a schema, and write event handlers, refer to the guides section in our [documentation](https://docs.envio.dev/docs/HyperIndex/configuration-file).

**Other Supported Networks: \
**



* Base Sepolia
* Base Traces

The full list of HyperSync supported networks can be found [here](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks).


### Support

Can’t find what you’re looking for or need support? Reach out to us on [Discord](https://discord.com/invite/Q9qt8gZ2fX); we’re always happy to help!


### About Base

Base is an L2 blockchain developed by [Coinbase](https://www.coinbase.com/en-gb/) that enhances Ethereum's scalability and usability. It provides a secure and efficient platform for building dApps, enabling faster and cheaper transactions while maintaining Ethereum's decentralization.


---


## Indexing Berachain Data with Envio


<table>
  <tr>
   <td><strong>Berachain Bartio Chain ID</strong>
   </td>
   <td>80084
   </td>
  </tr>
  <tr>
   <td><strong>HyperSync URL Endpoint</strong>
   </td>
   <td><a href="https://berachain-bartio.hypersync.xyz/">https://berachain-bartio.hypersync.xyz</a> or <a href="https://80084.hypersync.xyz/">https://80084.hypersync.xyz</a>
   </td>
  </tr>
  <tr>
   <td><strong>HyperRPC URL Endpoint</strong>
   </td>
   <td><a href="https://berachain-bartio.rpc.hypersync.xyz/">https://berachain-bartio.rpc.hypersync.xyz</a> or <a href="https://80084.rpc.hypersync.xyz/">https://80084.rpc.hypersync.xyz</a>
   </td>
  </tr>
</table>



### Overview

Envio is a modular hyper-performant data indexing solution for [Berachain](https://www.berachain.com/), enabling applications and developers to efficiently index and aggregate real-time and historical blockchain data. Envio offers three primary solutions for indexing and accessing large amounts of data: [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) (a customizable indexing framework), [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) (a real-time indexed data layer), and [HyperRPC](https://docs.envio.dev/docs/HyperRPC/overview-hyperrpc) (extremely fast read-only RPC).

HyperSync accelerates the synchronization of historical data on Berachain, enabling what usually takes hours to sync millions of events to be completed in under a minute—up to 1000x faster than traditional RPC methods.

Designed to optimize the user experience, Envio offers automatic code generation, flexible language support, multi-chain data aggregation, and a reliable, cost-effective hosted service.

To get started, see our documentation or follow our quickstart [guide](https://docs.envio.dev/docs/HyperIndex/contract-import).


### Defining Network Configurations


```
name: IndexerName # Specify indexerName name
description: Indexer Description # Include indexer description
networks:
  - id: 80084 # Berachain Bartio  
    start_block: START_BLOCK_NUMBER  # Specify the starting block
    contracts:
      - name: ContractName
        address:
         - "0xYourContractAddress1"
         - "0xYourContractAddress2"
        handler: ./src/EventHandlers.ts
        events:
          - event: Event # Specify event
          - event: Event
```


With these steps completed, your application will be set to efficiently index Berachain data using Envio’s blockchain indexer.

For more information on how to set up your config, define a schema, and write event handlers, refer to the guides section in our [documentation](https://docs.envio.dev/docs/HyperIndex/configuration-file).

The full list of HyperSync supported networks can be found [here](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks).


### Support

Can’t find what you’re looking for or need support? Reach out to us on [Discord](https://discord.com/invite/Q9qt8gZ2fX); we’re always happy to help!


### About Berachain

Berachain is a high-performance EVM-identical L1 blockchain that uses Proof-of-Liquidity (PoL) for consensus. Built on the modular [BeaconKit](https://docs.berachain.com/learn/#beaconkit-%E2%9B%B5%E2%9C%A8) framework, it offers scalability and efficiency for dApps.


---


## Indexing Blast Data with Envio


<table>
  <tr>
   <td><strong>Blast Chain ID</strong>
   </td>
   <td>81457
   </td>
  </tr>
  <tr>
   <td><strong>HyperSync URL Endpoint</strong>
   </td>
   <td><a href="https://blast.hypersync.xyz/">https://blast.hypersync.xyz</a> or <a href="https://81457.hypersync.xyz/">https://81457.hypersync.xyz</a>
   </td>
  </tr>
  <tr>
   <td><strong>HyperRPC URL Endpoint</strong>
   </td>
   <td><a href="https://blast.rpc.hypersync.xyz/">https://blast.rpc.hypersync.xyz</a> or <a href="https://81457.rpc.hypersync.xyz/">https://81457.rpc.hypersync.xyz</a>
   </td>
  </tr>
</table>



### Overview

Envio is a modular hyper-performant data indexing solution for [Blast](https://blast.io/), enabling applications and developers to efficiently index and aggregate real-time and historical blockchain data. Envio offers three primary solutions for indexing and accessing large amounts of data: [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) (a customizable indexing framework), [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) (a real-time indexed data layer), and [HyperRPC](https://docs.envio.dev/docs/HyperRPC/overview-hyperrpc) (extremely fast read-only RPC).

HyperSync accelerates the synchronization of historical data on Blast, enabling what usually takes hours to sync millions of events to be completed in under a minute—up to 1000x faster than traditional RPC methods.

Designed to optimize the user experience, Envio offers automatic code generation, flexible language support, multi-chain data aggregation, and a reliable, cost-effective hosted service.

To get started, see our documentation or follow our quickstart [guide](https://docs.envio.dev/docs/HyperIndex/contract-import).


### Defining Network Configurations


```
name: IndexerName # Specify indexerName name
description: Indexer Description # Include indexer description
networks:
  - id: 81457 # Blast  
    start_block: START_BLOCK_NUMBER  # Specify the starting block
    contracts:
      - name: ContractName
        address:
         - "0xYourContractAddress1"
         - "0xYourContractAddress2"
        handler: ./src/EventHandlers.ts
        events:
          - event: Event # Specify event
          - event: Event
```


With these steps completed, your application will be set to efficiently index Blast data using Envio’s blockchain indexer.

For more information on how to set up your config, define a schema, and write event handlers, refer to the guides section in our [documentation](https://docs.envio.dev/docs/HyperIndex/configuration-file).

**Other Supported Networks: \
**



* Blast Sepolia

The full list of HyperSync supported networks can be found [here](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks).


### Support

Can’t find what you’re looking for or need support? Reach out to us on [Discord](https://discord.com/invite/Q9qt8gZ2fX); we’re always happy to help!


### About Blast

The Blast Blockchain is an Ethereum L2 scaling solution that utilizes optimistic rollup technology to enhance transaction speed and lower costs while ensuring the security of the Ethereum mainnet.


---


## Indexing Boba Data with Envio


<table>
  <tr>
   <td><strong>Boba Chain ID</strong>
   </td>
   <td>288
   </td>
  </tr>
  <tr>
   <td><strong>HyperSync URL Endpoint</strong>
   </td>
   <td><a href="https://boba.hypersync.xyz/">https://boba.hypersync.xyz</a> or <a href="https://288.hypersync.xyz/">https://288.hypersync.xyz</a>
   </td>
  </tr>
  <tr>
   <td><strong>HyperRPC URL Endpoint</strong>
   </td>
   <td><a href="https://boba.rpc.hypersync.xyz/">https://boba.rpc.hypersync.xyz</a> or <a href="https://288.rpc.hypersync.xyz/">https://288.rpc.hypersync.xyz</a>
   </td>
  </tr>
</table>



### Overview

Envio is a modular hyper-performant data indexing solution for [Boba](https://boba.network/), enabling applications and developers to efficiently index and aggregate real-time and historical blockchain data. Envio offers three primary solutions for indexing and accessing large amounts of data: [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) (a customizable indexing framework), [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) (a real-time indexed data layer), and [HyperRPC](https://docs.envio.dev/docs/HyperRPC/overview-hyperrpc) (extremely fast read-only RPC).

HyperSync accelerates the synchronization of historical data on Boba, enabling what usually takes hours to sync millions of events to be completed in under a minute—up to 1000x faster than traditional RPC methods.

Designed to optimize the user experience, Envio offers automatic code generation, flexible language support, multi-chain data aggregation, and a reliable, cost-effective hosted service.

To get started, see our documentation or follow our quickstart [guide](https://docs.envio.dev/docs/HyperIndex/contract-import).


### Defining Network Configurations


```
name: IndexerName # Specify indexerName name
description: Indexer Description # Include indexer description
networks:
  - id: 288 # Boba  
    start_block: START_BLOCK_NUMBER  # Specify the starting block
    contracts:
      - name: ContractName
        address:
         - "0xYourContractAddress1"
         - "0xYourContractAddress2"
        handler: ./src/EventHandlers.ts
        events:
          - event: Event # Specify event
          - event: Event
```


With these steps completed, your application will be set to efficiently index Boba data using Envio’s blockchain indexer.

For more information on how to set up your config, define a schema, and write event handlers, refer to the guides section in our [documentation](https://docs.envio.dev/docs/HyperIndex/configuration-file).

The full list of HyperSync supported networks can be found [here](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks).


### Support

Can’t find what you’re looking for or need support? Reach out to us on [Discord](https://discord.com/invite/Q9qt8gZ2fX); we’re always happy to help!


### About Boba

Boba is a compute-focused L2 solution built on top of L1 blockchains, Ethereum and BNB Chain. It scales and augments the core compute capabilities of Ethereum and BNB Chain, reducing gas fees and improving transaction throughput while retaining the security guarantees of its underlying network.


---


## Indexing BSC (Binance Smart Chain) Data with Envio


<table>
  <tr>
   <td><strong>BSC Chain ID</strong>
   </td>
   <td>56
   </td>
  </tr>
  <tr>
   <td><strong>HyperSync URL Endpoint</strong>
   </td>
   <td><a href="https://bsc.hypersync.xyz/">https://bsc.hypersync.xyz</a> or <a href="https://56.hypersync.xyz/">https://56.hypersync.xyz</a>
   </td>
  </tr>
  <tr>
   <td><strong>HyperRPC URL Endpoint</strong>
   </td>
   <td><a href="https://bsc.rpc.hypersync.xyz/">https://bsc.rpc.hypersync.xyz</a> or <a href="https://56.rpc.hypersync.xyz/">https://56.rpc.hypersync.xyz</a>
   </td>
  </tr>
</table>



### Overview

Envio is a modular hyper-performant data indexing solution for [BSC](https://www.bnbchain.org/en/bnb-smart-chain), enabling applications and developers to efficiently index and aggregate real-time and historical blockchain data. Envio offers three primary solutions for indexing and accessing large amounts of data: [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) (a customizable indexing framework), [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) (a real-time indexed data layer), and [HyperRPC](https://docs.envio.dev/docs/HyperRPC/overview-hyperrpc) (extremely fast read-only RPC).

HyperSync accelerates the synchronization of historical data on BSC, enabling what usually takes hours to sync millions of events to be completed in under a minute—up to 1000x faster than traditional RPC methods.

Designed to optimize the user experience, Envio offers automatic code generation, flexible language support, multi-chain data aggregation, and a reliable, cost-effective hosted service.

To get started, see our documentation or follow our quickstart [guide](https://docs.envio.dev/docs/HyperIndex/contract-import).


### Defining Network Configurations


```
name: IndexerName # Specify indexerName name
description: Indexer Description # Include indexer description
networks:
  - id: 56 # BSC  
    start_block: START_BLOCK_NUMBER  # Specify the starting block
    contracts:
      - name: ContractName
        address:
         - "0xYourContractAddress1"
         - "0xYourContractAddress2"
        handler: ./src/EventHandlers.ts
        events:
          - event: Event # Specify event
          - event: Event
```


With these steps completed, your application will be set to efficiently index BSC data using Envio’s blockchain indexer.

For more information on how to set up your config, define a schema, and write event handlers, refer to the guides section in our [documentation](https://docs.envio.dev/docs/HyperIndex/configuration-file).

**Other Supported Networks: \
**



* BSC Testnet

The full list of HyperSync supported networks can be found [here](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks).


### Support

Can’t find what you’re looking for or need support? Reach out to us on [Discord](https://discord.com/invite/Q9qt8gZ2fX); we’re always happy to help!


### About BSC

Binance Smart Chain (BSC) is a blockchain network developed by Binance to support smart contracts and dApps. It operates in tandem with Binance Chain, combining fast transaction speeds with low fees, making it ideal for DeFi, NFTs, and cross-chain asset transfers. BSC’s compatibility with Ethereum also allows developers to easily build or migrate their applications.


---


## Indexing Celo Data with Envio


<table>
  <tr>
   <td><strong>Celo Chain ID</strong>
   </td>
   <td>42220
   </td>
  </tr>
  <tr>
   <td><strong>HyperSync URL Endpoint</strong>
   </td>
   <td><a href="https://celo.hypersync.xyz/">https://celo.hypersync.xyz</a> or <a href="https://42220.hypersync.xyz/">https://42220.hypersync.xyz</a>
   </td>
  </tr>
  <tr>
   <td><strong>HyperRPC URL Endpoint</strong>
   </td>
   <td><a href="https://celo.rpc.hypersync.xyz/">https://celo.rpc.hypersync.xyz</a> or <a href="https://42220.rpc.hypersync.xyz/">https://42220.rpc.hypersync.xyz</a>
   </td>
  </tr>
</table>



### Overview

Envio is a modular hyper-performant data indexing solution for Celo, enabling applications and developers to efficiently index and aggregate real-time and historical blockchain data. Envio offers three primary solutions for indexing and accessing large amounts of data: [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) (a customizable indexing framework), [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) (a real-time indexed data layer), and [HyperRPC](https://docs.envio.dev/docs/HyperRPC/overview-hyperrpc) (extremely fast read-only RPC).

HyperSync accelerates the synchronization of historical data on Celo, enabling what usually takes hours to sync millions of events to be completed in under a minute—up to 1000x faster than traditional RPC methods.

Designed to optimize the user experience, Envio offers automatic code generation, flexible language support, multi-chain data aggregation, and a reliable, cost-effective hosted service.

To get started, see our documentation or follow our quickstart [guide](https://docs.envio.dev/docs/HyperIndex/contract-import).


### Defining Network Configurations


```
name: IndexerName # Specify indexerName name
description: Indexer Description # Include indexer description
networks:
  - id: 42220 # Celo  
    start_block: START_BLOCK_NUMBER  # Specify the starting block
    contracts:
      - name: ContractName
        address:
         - "0xYourContractAddress1"
         - "0xYourContractAddress2"
        handler: ./src/EventHandlers.ts
        events:
          - event: Event # Specify event
          - event: Event
```


With these steps completed, your application will be set to efficiently index Celo data using Envio’s blockchain indexer.

For more information on how to set up your config, define a schema, and write event handlers, refer to the guides section in our [documentation](https://docs.envio.dev/docs/HyperIndex/configuration-file).

The full list of HyperSync supported networks can be found [here](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks).


### Support

Can’t find what you’re looking for or need support? Reach out to us on [Discord](https://discord.com/invite/Q9qt8gZ2fX); we’re always happy to help!


### About Celo

Celo is an emerging Ethereum L2 designed to make blockchain technology accessible to all. With its focus on scalability, low fees, and ease of use, Celo is ideal for building blockchain products that reach millions of users around the globe.


---


## Indexing Chiliz Data with Envio


<table>
  <tr>
   <td><strong>Chiliz Chain ID</strong>
   </td>
   <td>8888
   </td>
  </tr>
  <tr>
   <td><strong>HyperSync URL Endpoint</strong>
   </td>
   <td><a href="https://chiliz.hypersync.xyz/">https://chiliz.hypersync.xyz</a> or <a href="https://8888.hypersync.xyz/">https://8888.hypersync.xyz</a>
   </td>
  </tr>
  <tr>
   <td><strong>HyperRPC URL Endpoint</strong>
   </td>
   <td><a href="https://chiliz.rpc.hypersync.xyz/">https://chiliz.rpc.hypersync.xyz</a> or <a href="https://8888.rpc.hypersync.xyz/">https://8888.rpc.hypersync.xyz</a>
   </td>
  </tr>
</table>



### Overview

Envio is a modular hyper-performant data indexing solution for [Chiliz](https://www.chiliz.com/), enabling applications and developers to efficiently index and aggregate real-time and historical blockchain data. Envio offers three primary solutions for indexing and accessing large amounts of data: [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) (a customizable indexing framework), [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) (a real-time indexed data layer), and [HyperRPC](https://docs.envio.dev/docs/HyperRPC/overview-hyperrpc) (extremely fast read-only RPC).

HyperSync accelerates the synchronization of historical data on Chiliz, enabling what usually takes hours to sync millions of events to be completed in under a minute—up to 1000x faster than traditional RPC methods.

Designed to optimize the user experience, Envio offers automatic code generation, flexible language support, multi-chain data aggregation, and a reliable, cost-effective hosted service.

To get started, see our documentation or follow our quickstart [guide](https://docs.envio.dev/docs/HyperIndex/contract-import).


### Defining Network Configurations


```
name: IndexerName # Specify indexerName name
description: Indexer Description # Include indexer description
networks:
  - id: 8888 # Chiliz  
    start_block: START_BLOCK_NUMBER  # Specify the starting block
    contracts:
      - name: ContractName
        address:
         - "0xYourContractAddress1"
         - "0xYourContractAddress2"
        handler: ./src/EventHandlers.ts
        events:
          - event: Event # Specify event
          - event: Event
```


With these steps completed, your application will be set to efficiently index Chiliz data using Envio’s blockchain indexer.

For more information on how to set up your config, define a schema, and write event handlers, refer to the guides section in our [documentation](https://docs.envio.dev/docs/HyperIndex/configuration-file).

The full list of HyperSync supported networks can be found [here](https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks).


### Support

Can’t find what you’re looking for or need support? Reach out to us on [Discord](https://discord.com/invite/Q9qt8gZ2fX); we’re always happy to help!


### About Chiliz

Chiliz Chain is the leading blockchain for enterprise-level sports and entertainment brands that want to create a Web3 ecosystem where stakeholders can build Web3 experiences within a secured network-effect-driven community. 


--- -->