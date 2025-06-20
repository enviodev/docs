---
title: Envio Developer Update April 2025
sidebar_label: Envio Developer Update April 2025
slug: /envio-developer-update-april-2025
---

<img src="/blog-assets/dev-update-april-2025.png" alt="Cover Image Envio Developer Community Update April 2025" width="100%"/>

<!--truncate-->

Welcome to Our April 2025 Developer Update!

This month, we launched v2.16.0 & v2.17.0, introducing Topic Filters by Contract Addresses for more precise indexing and a new development console to track indexer progress. We've also expanded indexing support for Monad and released tools like Snubb for token approval scanning and Loggregate for real-time EVM event data aggregation and much more. Let's jump in!


## 🚀 HyperIndex Version 2.16.0 & 2.17.0 are now available 🚀

*Please note: Current release 2.17.1*


### Topic Filters by Contract Addresses

Besides **<code>chainId</code>** added in the previous release, you can now also access contract addresses to filter by. 

For example, index your users' USDC transfers as easily as:


```
import { FactoryContract, UserContract } from "generated";

const USDC_ADDRESS = {
  84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  11155111: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
};

FactoryContract.UserCreted.contractRegister(async ({ event, context }) => {
  context.addUserContract(event.params.userContractAddress);
});

UserContract.Transfer.handler(async ({ event, context }) => {
  // Filter and store only the USDC transfers that involve a Safe address
  if (event.srcAddress === USDC_ADDRESS[event.chainId]) {
    context.Transfer.set({
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      from: event.params.from,
      to: event.params.to,
    });
  }
}, {
  wildcard: true,
  eventFilters: ({ addresses }) => [{ from: addresses }, { to: addresses }],
});
```



### New Development Console! 

V2.17.0 also went live, allowing you to track indexer progress, access the GraphQL Playground, and level up your local dev experience, with plenty more features on the way! 👇


<img src="/blog-assets/dev-update-april-2025-1.png" alt="logtui" width="100%"/>


### Logger improvements 📝

Added the ability to pass params on a log call:


```
context.log.info("Sucessfully handled Transfer()", { from: event.params.from, to: event.params.to })

These params will be displayed in the logs in your terminal as well as in Hosted Service.

You can also pass an error:
} catch (error) {
  context.log.error("Failed ipfs call", error)
}
```


For more information, you can view [all past and current release notes](https://github.com/enviodev/hyperindex/releases) on our GitHub.

If you love what we’re building as much as we do and want to stay updated on our latest releases and developments, give us a star on [GitHub](https://github.com/enviodev/hyperindex)! Your support means the world to us!  ⭐


## Envio Delivers Modular, Real-Time Indexing for Monad Builders

<img src="/blog-assets/dev-update-april-2025-2.png" alt="logtui" width="100%"/>

We’re excited to announce that Envio’s open indexing framework now supports developers building on Monad. [Monad](https://www.monad.xyz/) is pushing the boundaries of performance at the execution layer, and Envio ensures your data pipeline keeps up seamlessly. Instantly index real-time and historical data on Monad using Envio, fast, reliable, and fully customizable. Track complex state changes, power prediction markets, or build whatever you’re working on with full control over how your data flows.

We’re proud to support Monad developers with the fastest blockchain indexing solution available.


## Introducing Snubb: A Multichain Token Approval Scanner for Your Terminal

<img src="/blog-assets/dev-update-april-2025-3.png" alt="logtui" width="100%"/>

Inspired by [Revoke](https://revoke.cash/), Snubb is an incredibly fast and efficient CLI tool to scan for outstanding token approvals for your address across as many as 70 chains simultaneously.

Try it out now with one terminal command:


```
npx snubb --address <your-address> --chains 1,10,130
```


For example:


```
npx snubb --address 0x7C25a8C86A04f40F2Db0434ab3A24b051FB3cA58 --chains many-networks
```


Check out this [video](https://x.com/jonjonclark/status/1907821189789016415) to see it in action.

It’s lightning fast, able to scan multiple chains and return results in seconds. Under the hood, it uses HyperSync to scan entire chains quickly, with specific filters for approval and transfer events related to the given address.

If you're curious, feel free to check out the original background [post](https://x.com/jonjonclark/status/1907821187469541781) on X that kicked this all off.



## Introducing Loggregate: A Terminal-Native Tool for Real-Time EVM Event Data Aggregation

<img src="/blog-assets/dev-update-april-2025-4.png" alt="logtui" width="100%"/>

We’re excited to introduce [Loggregate](https://www.npmjs.com/package/loggregate), inspired by [LogTUI](https://www.npmjs.com/package/logtui). It’s a terminal-native tool that lets developers aggregate and analyze EVM event data in real-time. Whether it’s token transfers, swaps, or deposits, Loggregate makes it easy to pull meaningful data from Ethereum and other networks.

With Loggregate, you can quickly calculate key statistics like counts, sums, and averages, all within your terminal. For example, we aggregated live transfer data to reveal 127 million transfers with an average value of $111,727 per transaction.

Built for developers and powered by [HyperSync](https://docs.envio.dev/docs/HyperIndex/overview), Loggregate is fully open-source and extensible.

Try it out now:


```
npx loggregate -e "event Transfer(address indexed from, address indexed to, uint256 value)" -n eth -p "value" -c 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 -d 6
```


Explore it on [npm](https://www.npmjs.com/package/loggregate) and check out the open-source [repo](https://github.com/denhampreen/loggregate).

Feel free to check out the original background [post](https://x.com/DenhamPreen/status/1909267253821845707) on X.


## Oracle Wars: Exploring Real-Time Oracle Behavior and Push-Based Feeds

<img src="/blog-assets/dev-update-april-2025-5.png" alt="logtui" width="100%"/>

Who watches the watchers? We do, in real time. Powered by HyperIndex, [Oracle Wars](https://www.oraclewars.xyz/) visualizes how oracle feeds behave on-chain, highlighting deviations and helping you design more reliable smart contracts.

Learn more about it in our latest [blog](https://docs.envio.dev/blog/oracle-wars).


## Envio's HyperSync Powers Trading Strategy with Multichain Data Collection

<img src="/blog-assets/dev-update-april-2025-6.png" alt="logtui" width="100%"/>

Another great example of HyperSync in action! Check out how [Trading Strategy](https://tradingstrategy.ai/) leveraged Envio to collect on-chain data across multiple chains and dive into their epic data & research notebook analyzing the performance of 7,000 ERC-4626 vaults across 10 blockchains!

Learn more in this [post](https://x.com/TradingProtocol/status/1910319480887975965).


## HyperSync Now Supports 70+ EVM Networks, Enhancing Real-time Data Access Across Web3

<img src="/blog-assets/dev-update-april-2025-7.png" alt="logtui" width="100%"/>

We’re excited to share that HyperSync now supports 70+ EVM networks, with many more on the way! Developers and analysts can now access real-time and historical data across various EVM networks with ease. Whether you're tracking activity, analyzing trends, or powering apps, HyperSync makes querying fast, reliable, and effortless.

To learn more about the networks we support, check out our latest [blog](https://docs.envio.dev/blog/envio-hypersync-supports-70-networks).


## Developer Workshop: Indexing Real-Time Data on the XDC Network with Envio

 <iframe width="560" height="315" src="https://www.youtube.com/live/cFrOw5lTd3E" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Missed our XDC Developer Workshop? We got you. Check out this step-by-step walkthrough on how to instantly index real-time and historical data on the XDC Network using Envio.


## Upcoming Events 🗓️

* [Sonic Summit](https://www.soniclabs.com/summit): 6th → 8th May 2025
* [ETHPrague](https://ethprague.com/): 27th → 29th May 2025
* [DappCon](https://dappcon.io/): 16th → 18th June 2025
* WAGMI Sponsors at [EthCC](https://ethcc.io/)** **Cannes**:** 30th June → 3rd July 2025
* [Pragama](https://ethglobal.com/events/pragma-cannes) Cannes: July 3rd 2025



## Featured Developer 🧑‍💻

<img src="/blog-assets/dev-update-april-2025-8.png" alt="logtui" width="100%"/>

This month, we’re excited to feature Manu Soman, a talented developer who transitioned from UX design to mastering backend programming in Rust and JavaScript. Manu’s work primarily revolves around systems programming and crypto, with a special focus on Solana. Recently, he’s been expanding his skill set by exploring Go.

Manu has been actively building out the UniV3 Indexer (coming soon) using Envio, a custom-built multi-chain indexer for Uniswap V3 powered by HyperIndex. This project tracks top swaps, pools, and trends in real-time, providing invaluable insights into liquidity, trading volumes, fees, and more!

His passion for exploring new technologies and creating robust solutions makes him a standout developer and member of our community.

***“Though my prior experience with blockchain indexers is limited to a small project using Subgraph, I was amazed at how quickly HyperIndex was able to index high-traffic smart contracts like Uniswap. Not only is it fast, it’s also easy to set up and fully syncs with chains. Subgraph fell short in all of those areas. Envio's tech support on Discord is also active, responsive, and super helpful. Choosing Envio for indexing is a no-brainer.” - Manu Soman***

We’re excited to see where Manu’s journey takes him next and appreciate his contributions to our community.

Be sure to follow Manu and his work on [X](https://x.com/manu_221b) for the latest updates and insights!


## Playlist of the Month 🎧️ 

<img src="/blog-assets/dev-update-april-2025-9.png" alt="logtui" width="100%"/>

▶️ [Open Spotify](https://open.spotify.com/playlist/5ICzfWy4hkVDOEe0NSOuZy?si=762121a2d366461b)


## Ship with us. 🚢 

Envio is a modern, multi-chain EVM blockchain indexer for querying real-time and historical data.

If you’re working on a Web3 project and want a smoother development process, Envio’s got your back(end). Check out our docs, join the community, and let’s talk about your data needs.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.


[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌 

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) || [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer) |
