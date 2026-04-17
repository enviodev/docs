---
title: Exploring Real-time Oracle Behavior and Push Based Feeds
sidebar_label: Exploring Real-time Oracle Behavior and Push Based Feeds
slug: /oracle-wars
description: "Learn how Oracle Wars uses Envio's HyperIndex to visualise how different oracle providers behave in real-time so you can design more reliable onchain systems."
image: /blog-assets/oracle-wars-1.png
last_update:
  date: 2026-04-15
---

Co-authors: [Jordyn Laurier](https://x.com/j_o_r_d_y_s), Head of Marketing & Operations, and [Jonjon Clark](https://x.com/jonjonclark), Co-Founder at Envio

<img src="/blog-assets/oracle-wars-1.png" alt="Cover Image Oracle Wars" width="100%"/>

<!--truncate-->

:::note TL;DR
- Oracle Wars is a live dashboard that visualizes real-time oracle behavior on MegaETH, built with Envio HyperIndex in under two hours.
- Push oracles use heartbeat intervals and deviation thresholds to trigger updates. A 0.5% deviation threshold does not mean consecutive onchain prices only differ by 0.5%.
- HyperIndex makes building real-time monitoring tools for high-throughput chains like MegaETH straightforward, with no RPC rate limit concerns.
:::

Oracles are the connection between blockchains and real-world data, enabling smart contracts to interact with off-chain events like asset prices, market rates, or real-time sports scores. Visualizing how they behave in practice offers a new level of clarity for developers building onchain apps.

[Oracle Wars](https://www.oraclewars.xyz/) is a live feed of onchain oracle data that shows how different providers behave in real time. It helps developers visualize and better understand how oracles function under different market conditions, so they can design more reliable and secure smart contracts.

**Please note**: The multi-oracle comparison dashboard shown in earlier versions is no longer live on the site. Oracle Wars currently displays live ETH/USD price oracle updates from the [Redstone Bolt](https://blog.redstone.finance/2025/04/08/introducing-redstone-bolt-the-fastest-blockchain-oracle-to-date/) oracle feed on MegaETH. Oracle Wars remains an educational and experimental tool for surfacing real-time data from various oracle providers.

## What is a blockchain oracle?

In simple terms, oracles allow smart contracts to react to external data sources. Whether it is the latest price of an asset or the outcome of a sporting event, oracles are how the blockchain sees the world.

Over time, oracle architectures have evolved, giving rise to push-based oracles, pull-based oracles, and many more. Each design has trade-offs. This post focuses on push oracles and how they behave from a data perspective.

### Push oracles in practice

A push oracle periodically pushes data onto the blockchain. Your contract reads that data and responds accordingly, whether it is executing a trade, adjusting a loan-to-value ratio, or triggering another onchain action.

Most push oracles use two primary mechanisms:

1. **Heartbeat intervals**: Regular updates (e.g., every 24 hours)
2. **Deviation thresholds**: Immediate updates when data shifts significantly (e.g., 0.5% price movement)

## Visualizing real-time oracle activity with Oracle Wars

Wonder what happens in live conditions during periods of high volatility? That is where Oracle Wars came in. The earlier version of the dashboard showed a live comparison between price feeds from different oracle providers such as [Chainlink](https://chain.link/) and [RedStone](https://www.redstone.finance/). Oracle Wars now focuses on Redstone Bolt ETH/USD updates on MegaETH, but the patterns below still apply to the earlier multi-oracle view.

You will notice that updates are not always evenly spaced. That is the deviation threshold kicking in: when markets get volatile, updates come in fast. When things are calm, fewer updates appear. This is a valuable pattern to observe if you are designing a protocol that depends on accurate and real-time data.

<img src="/blog-assets/oracle-wars-2.png" alt="Oracle Wars 2" width="100%"/>

## Understanding the limitations of deviation thresholds in push oracles

Oracle Wars also shows the maximum deviation between any two consecutive price points over 24 hours. Every DeFi protocol relies on timely and accurate price data, and large shifts between updates can lead to exploit risk, broken assumptions, or cascading failures. This metric gives developers a real-world view of how much price movement can actually occur between updates, even when using well-known oracle providers.

This brings us to a common misunderstanding: deviation thresholds are not strict limits.

Take Chainlink and RedStone, for instance. Both use a 0.5% deviation threshold for price feeds. That should mean the oracle updates whenever the price moves more than 0.5%. But here is the catch:

A 0.5% deviation threshold does not mean consecutive onchain prices will only differ by 0.5%.

In practice, you might see larger deviations. Over 24 hours alone, Oracle Wars recorded deviations of around 0.67% for both providers. This does not mean the oracles were broken. It means they are working as designed. The threshold is more of a trigger condition than a strict upper bound.

If you are competing in security audits on platforms like Sherlock, Code4rena, or CodeHawks, these edge cases are worth thinking through. Your protocol logic needs to account for potentially higher-than-expected changes, especially in volatile markets.

## Is a super-fast push oracle now better than a pull oracle?

With the advent of high-speed chains like MegaETH and Monad, we are starting to see ultra-fast push oracles that update data with each block. This near-instantaneous data feed challenges traditional push oracles, offering freshness comparable to pull oracles, provided transaction costs remain manageable.

On Oracle Wars, you can observe how these super-fast push oracles behave in real time, with feeds like the ETH/USD price on MegaETH. The data is continuously updated, providing a new level of insight into how push oracles might evolve to rival the responsiveness of pull models.

<img src="/blog-assets/oracle-wars-3.png" alt="Oracle Wars 2" width="100%"/>

One aspect that remains intriguing is the frequent occurrence of multiple price updates at the same timestamp. This raises questions about whether these oracles are pushing multiple updates within the same block and the rationale behind this granularity.

While Redstone's Bolt push oracle is an exciting development, it is still early days. It will be interesting to see how other oracle providers and chains approach the super-fast push model. The key question remains: can ultra-fast push oracles maintain the freshness and reliability of pull oracles without significant cost overhead?

## Oracle Wars: powered by Envio's HyperIndex

Oracle Wars was built in under two hours using Envio's HyperIndex, which made indexing real-time oracle data smooth and straightforward. No custom RPC infrastructure was needed, and no rate limit concerns applied.

If you are building dashboards, simulations, or monitoring tools, it is worth checking out. Need help getting started? Feel free to reach out in our Discord or on Telegram.

### Helpful resources

* [HyperIndex Quickstart](https://docs.envio.dev/docs/HyperIndex/contract-import)
* [Guides](https://docs.envio.dev/docs/HyperIndex/configuration-file)
* [Examples](https://docs.envio.dev/docs/HyperIndex/example-uniswap-v4-multi-chain-indexer)
* [GitHub Repo](https://github.com/enviodev/hyperindex)

Background posts on X that kicked this off:

* [Thinking through oracles with data](https://x.com/jonjonclark/status/1890426833088246054)
* [Understanding the Limitations of Deviation Thresholds in Push Oracles](https://x.com/jonjonclark/status/1892208677815300350)
* [How Much Latency Do High-Frequency Oracle Push Feeds Actually Have?](https://x.com/jonjonclark/status/1903109614318575809)
* [Is a super-fast push oracle now better than a pull oracle?](https://x.com/jonjonclark/status/1909635483182789020)

## Frequently asked questions

### What is the difference between a push oracle and a pull oracle?

A push oracle periodically writes updated data directly to the blockchain. A pull oracle does not write data proactively. Instead, it allows consumers to request data on demand, usually with a small fee. Pull oracles can offer fresher data per request, but push oracles are simpler to integrate since the data is already onchain when your contract needs it.

### Why can the actual price deviation between oracle updates exceed the stated deviation threshold?

Deviation thresholds are trigger conditions, not strict caps. When the threshold is set at 0.5%, the oracle updates whenever the price moves 0.5% from the last onchain price. However, by the time the update transaction is confirmed, the actual market price may have moved further. During high volatility, you can observe deviations larger than the configured threshold.

### How was Oracle Wars built so quickly using Envio?

Oracle Wars was built in under two hours because Envio HyperIndex handles all data ingestion, storage, and GraphQL API generation automatically. The developer only needed to define the oracle contract's ABI, configure the events of interest in `config.yaml`, and write event handlers to store price updates. Envio handles the rest.

### Can HyperIndex handle the data throughput of high-frequency oracle feeds on MegaETH?

Yes. HyperIndex is designed for high-throughput chains and uses HyperSync as its data retrieval layer, which bypasses RPC entirely for historical data and keeps up with real-time blocks efficiently. Oracle Wars on MegaETH demonstrates this with continuous ETH/USD price streaming at sub-millisecond block times.

### Should I use Oracle Wars for production smart contract design decisions?

Oracle Wars is an educational and experimental tool, not a production monitoring service. It is useful for understanding how push oracles behave under real market conditions and for informing your protocol design. For production systems, use the oracle provider's official documentation and run your own analysis of historical deviation data.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
