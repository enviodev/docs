---
title: Oracle Wars - Exploring Real-Time Oracle Behavior and Push-Based Feeds
sidebar_label: Oracle Wars - Exploring Real-Time Oracle Behavior and Push-Based Feeds
slug: /oracle-wars
---

<img src="/blog-assets/oracle-wars-1.png" alt="Cover Image Oracle Wars" width="100%"/>

<!--truncate-->

Oracles are the unsung heroes of DeFi. They connect blockchains to real-world data, enabling smart contracts to interact with off-chain events like asset prices (USDC, ETH), market rates, or even real-time sports scores. But while the concept of oracles is often discussed in theoretical terms, visualizing how they behave in practice can offer a new level of clarity, especially for developers building apps on-chain.

Enter [Oracle Wars](https://www.oraclewars.xyz/), a live feed of on-chain oracle data that compares how different providers behave in real-time. It helps developers visualize and gain a better understanding of how oracles actually function under different market conditions, so they can design more reliable and secure smart contracts.

⭐ **Please note**: The dashboard shown above is no longer live on the site, but the platform remains focused on delivering valuable insights into oracle performance. Oracle Wars is an educational and experimental platform designed to showcase data from various oracle providers, with the goal of improving the understanding of oracle behavior through real-time data analysis, which is constantly evolving and being updated.


## What is a Blockchain Oracle?

If you're building in the decentralized space, you’ve more than likely heard about oracles. In simple terms, they allow smart contracts to react to external data sources. Whether it's the latest price of an asset or the outcome of a sporting event, oracles are how the blockchain sees the world.

Over time, oracle architectures have evolved. From the early days of Truffle and Ganache to today’s production-grade protocols, we've seen the rise of push-based oracles, pull-based oracles, and many more. Each design has trade-offs. For now, let’s zero in on push oracles and how they behave from a data perspective.



### Push Oracles in Practice

A push oracle works exactly as the name implies: it periodically pushes data onto the blockchain. Your contract can then read that data and respond accordingly, whether it's executing a trade, adjusting a loan-to-value ratio, or minting some ridiculous meme coin.


#### Most push oracles use two primary mechanisms:



1. **Heartbeat intervals** – Regular updates (e.g., every 24 hours)
2. **Deviation thresholds** – Immediate updates when data shifts significantly (e.g., 0.5% price movement)



## Visualizing Real-Time Oracle Activity with Oracle Wars

Wonder what happens in live conditions, during periods of high volatility? That’s where Oracle Wars comes in. It can show a live comparison between price feeds from different oracle providers, such as [Chainlink](https://chain.link/) and [RedStone](https://www.redstone.finance/).

You’ll notice that updates aren’t always evenly spaced. That’s the deviation threshold kicking in when markets get volatile, updates come in fast. When things are calm, fewer updates appear. It’s a valuable pattern to observe, especially if you’re designing a protocol that depends on accurate and real-time data.

For example, this volatility spike, between Chainlink and RedStone posted frequent updates to reflect price changes, an essential feature for platforms like [Aave](https://app.aacve.com/dashboard), which depend on real-time data for liquidation logic and capital safety.

<img src="/blog-assets/oracle-wars-2.png" alt="Oracle Wars 2" width="100%"/>

## Understanding the Limitations of Deviation Thresholds in Push Oracles

Oracle Wars also allows you to see the maximum deviation between any two consecutive price points over 24 hours. Why does this matter? Every DeFi protocol relies on timely and accurate price data, and large shifts between updates can lead to exploit risk, broken assumptions, or cascading failures. This metric gives developers a real-world view of how much price movement can actually occur between updates, even when using well-known oracle providers.

This brings us to a common misunderstanding: deviation thresholds are not strict limits.

Take Chainlink and RedStone, for instance. Both use a 0.5% deviation threshold for price feeds. That should mean the oracle updates whenever the price moves more than 0.5%. But here’s the catch:

A 0.5% deviation threshold does not mean consecutive on-chain prices will only differ by 0.5%.

In practice, you might see larger deviations. Over 24 hours alone, Oracle Wars recorded deviations of around 0.67% for both providers. This doesn’t mean the oracles were broken, it means they’re working as designed. The threshold is more of a trigger condition than a strict upper bound.

So if you're competing in security audits on platforms like Sherlock, Code4rena, or CodeHawks, it's worth thinking through these edge cases. Your protocol logic needs to account for these potentially higher-than-expected changes, especially in volatile markets.


## Is a Super-Fast Push Oracle Now Better Than a Pull Oracle?

With the advent of high-speed chains like MegaETH and Monad, we’re starting to see the rise of ultra-fast push oracles that update data with each block. This near-instantaneous data feed challenges traditional push oracles, offering freshness comparable to pull oracles, provided transaction costs remain manageable.

On Oracle Wars, you can now observe how these super-fast push oracles behave in real-time, with feeds like the ETH/USD price on MegaETH. The data is continuously updated, providing a new level of insight into how push oracles might evolve to rival the responsiveness of pull models.

<img src="/blog-assets/oracle-wars-3.png" alt="Oracle Wars 2" width="100%"/>

However, one aspect that remains intriguing is the frequent occurrence of multiple price updates at the same timestamp. This raises questions about whether these oracles are pushing multiple updates within the same block, and the rationale behind this granularity.

While Redstone's "Bolt" push oracle is an exciting development, it’s still early days. It will be interesting to see how other oracle providers and chains approach the super-fast push model. The key question remains: Can these ultra-fast push oracles maintain the freshness and reliability of pull oracles without significant cost overhead?


## Oracle Wars: Powered by Envio’s HyperIndex

To pull this off and index this level of data, we used HyperIndex, our open blockchain indexing framework which seamlessly queried this data effortlessly. The entire Oracle Wars platform was built in under two hours using Envio’s HyperIndex, which made indexing real-time oracle data smooth and easy.

If you're building dashboards, simulations, or monitoring tools, it’s worth checking out. Need help getting started? Feel free to reach out to us in our Discord or on Telegram, we’re always happy to walk you through it!


### Helpful Resources



* [HyperIndex Quickstart](https://docs.envio.dev/docs/HyperIndex/contract-import)
* [Guides](https://docs.envio.dev/docs/HyperIndex/configuration-file)
* [Examples](https://docs.envio.dev/docs/HyperIndex/example-uniswap-v4-multi-chain-indexer)
* [GitHub Repo](https://github.com/enviodev/hyperindex)

Thanks for reading, and if you're curious, feel free to check out the original background posts on X that kicked this all off: 



* [Thinking through oracles with data](https://x.com/jonjonclark/status/1890426833088246054)
* [Understanding the Limitations of Deviation Thresholds in Push Oracles](https://x.com/jonjonclark/status/1892208677815300350)
* [How Much Latency Do High-Frequency Oracle Push Feeds Actually Have?](https://x.com/jonjonclark/status/1903109614318575809)
* [Is a super-fast push oracle now better than a pull oracle?](https://x.com/jonjonclark/status/1909635483182789020) 


## About Envio

[Envio](https://envio.dev/) is an open blockchain indexing framework that addresses the limitations of traditional blockchain indexing approaches and gives developers peace of mind. Blockchain developers and data analysts can harness the power of Envio to overcome the challenges posed by latency, reliability, infrastructure management, and costs across various sources. 

If you're a blockchain developer looking to enhance your development process and unlock the true potential of Web3 infrastructure, look no further. 

Join our growing community of Web3 developers, check out our docs, and let's work together to revolutionize the blockchain world and propel your project to the next level.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [GitHub](https://github.com/enviodev) | [Medium](https://medium.com/@Envio_Indexer) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)