---
title: Envio Celebrates Its First Successful Grantee
sidebar_label: Envio Celebrates Its First Successful Grantee
slug: /envio-celebrates-first-grantee-multi-chain-liquidation-metrics-indexer
description: "Discover how our first grant recipient built a multi chain multi protocol liquidation metrics indexer using Envio to boost performance cross chain insight and developer efficiency."
---


<img src="/blog-assets/envio-multi-chain-liquidation-metrics-indexer.png" alt="Cover Image How to Become a Blockchain DApp Developer" width="100%"/>

<!--truncate-->

We are thrilled to announce a significant milestone in our Envio "[Build Bigger. Ship Faster" Grant Program](https://docs.envio.dev/blog/envio-grant-program-now-live). One of our incredible community members has successfully completed an outstanding project that showcases the true potential of Envio's indexing capabilities.

Joss applied for a grant with Envio to build a blockchain indexer that would assist him with his ambitious personal project of building a CompoundV2 liquidation bot. The indexer would serve the purpose of collecting real-time information on liquidation events occurring across CompoundV2 forks, which in turn would help him to identify potential target protocols to deploy his liquidation bot onto.
Joss applied for a grant with Envio to build a blockchain indexer that would assist him with his ambitious personal project of building a CompoundV2 liquidation bot. The indexer would serve the purpose of collecting real-time information on liquidation events occurring across CompoundV2 forks, which in turn would help him to identify potential target protocols to deploy his liquidation bot onto.

When asked what motivated him to build the indexer, Joss provided an insightful response:

> _Liquidation bots are a crucial component of CompoundV2 and you can think of liquidations in DeFi as a “high-stakes race”, where bots compete to execute smart contract functions before anyone else. This function comes into play when a user's position becomes under-collateralized, i.e. they are borrowing more value than they've supplied as collateral. The first bot triggers this function and receives a reward proportionate to the severity of the under-collateralized account's status […] This competitive environment demands hyper-performance and ingenuity, pushing bot developers to efficiently program and optimize to keep ahead […]. I humbly knew I wasn’t going to be able to build a bot in my free time that competes with bots funded by fully staffed LLCs, but I did notice an opportunity.  Compound V2 is one of the most forked lending protocols and many of the smaller protocols that forked Compound V2 don’t have the community, market cap, or presence to catch the attention of the maintainers of the leviathan liquidation bots […]. The problem I needed to solve was identifying potential target protocols to deploy my liquidation bot onto.  A good target would be one without much liquidator bot activity but large liquidations occurring_ - Joss

With that context all cleared up, let's dive into how Joss approached building his blockchain indexer using Envio 👇

For milestone A of the project, our grantee created an indexer for a single Compound V2 fork. To do this, Joss first decided on what data he wanted to collect. He was interested in the `LiquidateBorrow` event that is emitted by the Compound V2 fork’s smart contract each time a liquidation bot succeeded. The signature of LiquidateBorrow event is as follows:

```solidity
LiquidateBorrow(address liquidator, address borrower, uint repayAmount, address cTokenCollateral, uint seizeTokens)
```

This would allow Joss to collect information about liquidator addresses, amounts won by each liquidator, all liquidated accounts, amounts lost by each liquidated account, most popular tokens to liquidate, etc. Next our grantee defined the chain and contract addresses in the config (`config.yaml`), and the logic for the event handlers (`EventHandlers.ts`) to sort the said event data into the defined schema (`schema.graphql`).

For milestone B, our grantee extended the indexer to support indexing events from multiple CompoundV2 forks across various chains. This process involved pasting more addresses into the config with no further changes to the handlers being required. The following CompoundV2 forks were indexed across various chains:

- [Compound V2](https://compound.finance/) - ETH Mainnet
- [Venus](https://venus.io/) - BNB
- [BENQI Lending](https://benqi.fi/) - Avalanche
- [Sonne Finance](https://sonne.finance/) - Optimism
- [Flux Finance](https://fluxfinance.com/) - ETH Mainnet
- [Iron Bank](https://app.ib.xyz/lending) - ETH Mainnet
- [Iron Bank](https://app.ib.xyz/lending) - Avalanche
- [Iron Bank](https://app.ib.xyz/lending) - Optimism
- [Strike Finance](https://strike.org/) - ETH Mainnet

> _I indexed 9 for the largest Compound V2 forks across 4 chains for a total of 124 contracts indexed.  (the LiquidateBorrow event is emitted by multiple cToken contracts on each Compound V2 fork, hence the need for multiple addresses indexed for each) -_ Joss

The entire project and all files can be viewed in this Github [repo](https://github.com/JossDuff/liquidation-metrics/tree/main). Below are some example queries that allow Joss to quickly generate this relevant data for any Compound V2 fork he finds while browsing the DeFi ecosystem.

**Top 3 liquidators (address and chain ID) by number of liquidations:**

Query:

```graphql
query MyQuery {
  liquidatoraccount(order_by: { numberLiquidations: desc }, limit: 3) {
    id
    numberLiquidations
    event_chain_id
  }
}
```

Output:

```json
{
  "data": {
    "liquidatoraccount": [
      {
        "id": "0x9d3a168cF3a54Bae225471FC061A77E49C741751",
        "numberLiquidations": 8495,
        "event_chain_id": 56
      },
      {
        "id": "0x0870793286aaDA55D39CE7f82fb2766e8004cF43",
        "numberLiquidations": 4811,
        "event_chain_id": 56
      },
      {
        "id": "0x81366FFe0508403663A3b4633a077e0655412B8a",
        "numberLiquidations": 3918,
        "event_chain_id": 56
      }
    ]
  }
}
```

**Top 3 protocols by number of liquidations**

Query:

```graphql
query MyQuery {
  protocol(order_by: { numberLiquidations: desc }, limit: 3) {
    numberLiquidations
    name
  }
}
```

Output:

```json
{
  "data": {
    "protocol": [
      {
        "numberLiquidations": 53600,
        "name": "Venus"
      },
      {
        "numberLiquidations": 18317,
        "name": "Compound V2"
      },
      {
        "numberLiquidations": 7466,
        "name": "Benqi Lending"
      }
    ]
  }
}
```

**Get a list of all liquidator bots on a Compound V2 fork (ex:Sonne finance):**

Query:

```graphql
query MyQuery {
  protocol(where: { name: { _eq: "Sonne Finance" } }) {
    childCtokensMap {
      liquidatorAccountsMap {
        liquidatorAccountWonMap {
          id
        }
      }
    }
  }
}
```

Output:

```json
{
  "data": {
	"protocol": [
  	{
    	"childCtokensMap": [
      	{
        	"liquidatorAccountsMap": [
          	{
            	"liquidatorAccountWonMap": {
              	"id": "0x19E4D205C4881B8356216801242b313cfbA36E30"
            	}
          	},
          	{
            	"liquidatorAccountWonMap": {
              	"id": "0x44257B9171d5E3B6C01BB8FD64a617a1B8B71624"
            	}
          	},
          	{
            	"liquidatorAccountWonMap": {
              	"id": "0x0000000186dD90D3871C12FBb8F510Cbca9C8376"
            	},
[...]
```

After submitting the grant, we asked Joss what his experience was like using Envio to support his use case and what he enjoyed about Envio blockchain indexing capabilities:
After submitting the grant, we asked Joss what his experience was like using Envio to support his use case and what he enjoyed about Envio blockchain indexing capabilities:

> _As a next step I intend to run this data through a price oracle so I can know the USD amounts being liquidated and generate some cool data graphics. […] I’ve made a number of theGraph indexers in the past but this was my first time using Envio. The transition was smooth and intuitive. The most noticeable difference between theGraph and Envio is indexing speed. Anyone who has used theGraph is familiar with the feeling of a cortisol spike when their subgraph abruptly fails after syncing for 26 hours. Since Envio is so ridiculously fast these errors were caught in minutes instead of days. I felt spoiled. I found myself frequently and nonchalantly running `envio dev` to deploy the indexer and check for errors. The iterative developer experience was so much easier thanks to Envio. -_ Joss

### About Compound

Compound is an EVM-compatible protocol that enables the supply of crypto assets as collateral in order to borrow the *base asset*. Accounts can also earn interest by supplying the base asset to the protocol. According to [Defillama](https://defillama.com/forks), it is the second most forked project by TVL. For documentation of the Compound v2 Protocol, see [docs.compound.finance/v2](https://docs.compound.finance/v2/)

## About Envio

[Envio](https://envio.dev) is a fast, developer friendly blockchain indexer and the fastest, most flexible way to get on-chain data, making real-time data accessible for developers across the Web3 ecosystem.
## About Envio

[Envio](https://envio.dev) is a fast, developer friendly blockchain indexer and the fastest, most flexible way to get on-chain data, making real-time data accessible for developers across the Web3 ecosystem.

With Envio, developers can query and stream blockchain data efficiently without the complexity of running their own infrastructure. Envio’s blockchain indexing tools supports any EVM network and is trusted by many teams building everything from DeFi platforms to analytics dashboards and production applications.
With Envio, developers can query and stream blockchain data efficiently without the complexity of running their own infrastructure. Envio’s blockchain indexing tools supports any EVM network and is trusted by many teams building everything from DeFi platforms to analytics dashboards and production applications.

If you’re a blockchain developer or analyst looking to enhance your workflow, look no further. Join our growing community of Web3 builders and explore our docs.
If you’re a blockchain developer or analyst looking to enhance your workflow, look no further. Join our growing community of Web3 builders and explore our docs.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [GitHub](https://github.com/enviodev) | [Medium](https://medium.com/@Envio_Indexer)
[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [GitHub](https://github.com/enviodev) | [Medium](https://medium.com/@Envio_Indexer)