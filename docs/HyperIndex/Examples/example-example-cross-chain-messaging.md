---
id: example-cross-chain-messaging
title: Cross Chain Messaging Indexer
sidebar_label: Cross-chain messaging
slug: /example-
---

The following indexer example is a reference implementation and can serve as a starting point for applications with similar logic.

:::note
It is important to note that these are not vetted for accuracy, and testing or some level of data validation is always recommended. Additionally the indexer my not be using the latest Envio version and was built by Envio partners and community builders. 
::: 

This [repo](https://github.com/ringecosystem/ormpexer/tree/main) contains a comprehensive example indexer for cross-chain messaging indexer using Envio HyperIndex.  

This indexer is a multi-chain indexer, built using TypeScript, that indexes 14 EVM chains. This indexer uses a mix between HyperSync and RPC as data source. Data is accessible via a unified graphQL API. 
