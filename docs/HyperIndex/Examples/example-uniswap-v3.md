---
id: example-uniswap-v3
title: Uniswap V3 Multi-chain indexer
sidebar_label: Uniswap V3 (DEX)
slug: /example-uniswap-v3-multi-chain-indexer
---

The following indexer example is a reference implementation and can serve as a starting point for applications with similar logic.

:::note
It is important to note that these are not vetted for accuracy, and testing or some level of data validation is always recommended. Additionally the indexer my not be using the latest Envio version and was built by Envio partners and community builders. 
::: 

This [repo](https://github.com/jack-landon/uniswap-v3-indexer) contains a comprehensive example indexer for the Uniswap V3 protocol using Envio HyperIndex.  

This indexer is a multi-chain indexer, built using TypeScript, that indexes Uniswap V3 deployments on Ethereum Mainnet, Arbitrum One and Base. Data is accessible via a unified graphQL API. It is intended as as like-for-like copy of the [Uniswap V3 subgraph](https://github.com/Uniswap/v3-subgraph). 

More information on the [ReadMe](https://github.com/jack-landon/uniswap-v3-indexer/blob/main/README.md). 
