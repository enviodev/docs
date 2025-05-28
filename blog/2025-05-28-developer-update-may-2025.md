---
title: Envio Developer Update May 2025
sidebar_label: Envio Developer Update May 2025
slug: /envio-developer-update-may-2025
---

<img src="/blog-assets/dev-update-may-2025.png" alt="Cover Image Envio Developer Update May 2025" width="100%"/>

<!--truncate-->

May was a big month at Envio.

We shipped major versions with powerful new features, which gave indexing performance a serious upgrade, and made the CLI even smoother for automation.

We also landed some exciting integrations, improved tooling across the board, locked in our DappCon 2025 sponsorship and speaking slot, and much more. Let’s dive in!

## Latest Releases: v2.19.0 → v2.21.3

#### **Fixed Invalid Rollback on Reorg Bug**

In v2.21.3, we addressed an issue with invalid rollbacks during reorgs. We highly recommend upgrading to this version to ensure smoother contract indexing and enhanced system stability.

#### **Async Contract Registration**

You can now register contracts asynchronously using external logic. Perfect for dynamic deployments where the contract address depends on an external source.

```
NftFactory.SimpleNftCreated.contractRegister(async ({ event, context }) => {
  const version = await getContractVersion(event.params.contractAddress);
  if (version === "v2") {
    context.addSimpleNftV2(event.params.contractAddress);
  } else {
    context.addSimpleNft(event.params.contractAddress);
  }
});
```

#### **New EVM Fields**

Added **<code>accessList</code>** and **<code>authorizationList</code>** (EIP-7702) to transactions for expanded chain compatibility.
#### **JSON Field Support in Schema**

You can now define flexible **<code>JSON</code>** fields in your GraphQL schema,  ideal for storing dynamic metadata.

```
type User {
  id: ID!
  metadata: Json!
}
```

#### **Effect API for Effcient External Calls**

The new Effect API lets you batch, memoize, and deduplicate external calls directly from your handlers.

Paired with loaders, it prevents overfetching and speeds up processing across large batches.

Check out the [walkthrough](walkthrough) on Loom or dive into our [Loaders](Loaders) guide to learn more.


#### **Contract Registration Boost**

Dynamic contract indexing is now dramatically faster. We’ve deprecated preRegisterDynamicContracts, it’s no longer needed.


#### **Improved RPC Error Handling**

We added support for 9 more RPC error types to improve retry logic and block range fallback.


#### **Non-Interactive CLI Setup**

You can now initialize an indexer entirely through the CLI, no prompts, ideal for scripting and automation.

This comes as part of early experimentation with Envio MCP.


For more information, view [all past and current release notes](https://github.com/enviodev/hyperindex/releases) on our GitHub.

If you love what we’re building as much as we do and want to stay updated on our latest releases and developments, give us a star on [GitHub](https://github.com/enviodev/hyperindex)! Your support means the world to us! ⭐


## Envio Rolls Out Major Upgrade to Contract Indexing

Our latest performance upgrade unlocks dramatically faster dynamic indexing, especially for contracts deployed by factories. What previously took hours can now be done in minutes, with indexing speeds reaching nearly 30,000 events per second, even while dynamically registering new contracts.

No more two-pass preregistration flows. As of V2.19.0, contract registration happens in real-time, and the preregistration option has been deprecated. HyperIndex supports nested factory contracts, so if your contracts deploy other contracts (even more factories), we’ll handle it automatically.

Big shoutout to one of our leading devs, [Dmitry Zakharov](https://x.com/dzakh_dev), for leading the work to streamline contract registration.

Here’s a look at the local dev console, a useful way to track indexing speed and progress in real time. In this example, it’s tearing through Uniswap V3 data.

<img src="/blog-assets/dev-update-may-2025-1.png" alt="contract indexing" width="100%"/>

## Envio Sponsors DappCon 2025

<img src="/blog-assets/dev-update-may-2025-2.png" alt="dappcon 2025" width="100%"/>

We’re excited to announce that Envio is one of the many proud sponsors of [DappCon](https://dappcon.io/) 2025, joining an incredible lineup of projects pushing Web3 forward.

Be sure to also catch our speaking slot, Envio Co-founder [Denham Preen](https://x.com/DenhamPreen) will be sharing insights on real-time blockchain indexing and building open access to on-chain data.

See you in Berlin! 🇩🇪🥨


## Exciting DeFi Integration With Nad.fun

<img src="/blog-assets/dev-update-may-2025-3.png" alt="nad dot fun" width="100%"/>

We’re excited to share that Envio has been integrated with [Nad.fun](https://testnet.nad.fun/), an on-chain trading game built on Monad. We recently developed geographic request visualizations as we began serving HyperSync requests from multiple regions. Check out the awesome graphs showcasing where traffic is coming from.

Learn more in this [post](https://x.com/naddotfun/status/1920483968417177768) on X.


## Envio Powers Real-Time Analytics on Monorail

<img src="/blog-assets/dev-update-may-2025-4.png" alt="monorail" width="100%"/>

Another solid example of Envio in the wild, [Monorail](https://testnet-preview.monorail.xyz/) is now serving up real-time blockchain analytics, powered by our indexing infrastructure on Monad.

From live data to actionable insights, it’s all running smoothly under the hood. Big props to Monorail for the slick integration.

Learn more in this [post](https://x.com/envio_indexer/status/1923323564117156011) on X.


## Sonic Summit Keynote

<img src="/blog-assets/dev-update-may-2025-5.png" alt="sonic summit" width="100%"/>

Learn how to index millions of events on Sonic—in seconds.

Watch our keynote from Sonic Summit and see what real-time indexing looks like on a chain built for speed.⚡️

Watch on [YouTube](https://www.youtube.com/watch?v=DYvzHIRinQQ).


## Integration Spotlight: Forever Moments

<img src="/blog-assets/dev-update-may-2025-6.png" alt="forever moments" width="100%"/>

[Forever Moments](https://www.forevermoments.life/) just rolled out a robust new indexing setup using Envio. The result? Faster performance, cleaner data feeds, and expanded features. Even better, they’ll be open-sourcing their version soon so others can build on it too.

Shout out to the Forever Moments team for pushing on-chain media forward.

Learn more in this [post](https://x.com/momentsonchain/status/1927278966659785058) on X.


## Monad Evm/Accathon Winners

<img src="/blog-assets/dev-update-may-2025-7.png" alt="monad hackathon" width="100%"/>

Congratulations to the winners of the first-ever Monad hackathon (evm/accathon). It brought some serious builder energy, and we were proud to support teams with the fastest and most performant data indexing on Monad.

Learn more about the winning projects in our [blog](https://docs.envio.dev/blog/announcing-the-monad-envio-hackathon-winners).


## Upcoming Events 🗓️

* [DappCon](https://dappcon.io/): 16th → 18th June 2025
* WAGMI Sponsors at [EthCC](https://ethcc.io/) Cannes: 30th June → 3rd July 2025
* [Pragama](https://ethglobal.com/events/pragma-cannes) Cannes: July 3rd, 2025



## Featured Developer 🧑‍💻

<img src="/blog-assets/dev-update-may-2025-8.png" alt="dev of the month paul" width="100%"/>

This month, we’re proud to spotlight Paul Berg, co-founder and CEO of Sablier Labs, and a long-time contributor to the open-source Ethereum ecosystem. Known for building tools like [Sablier](https://sablier.com/) and [PRBMath](https://github.com/paulrberg/prb-math), Paul continues to push the space forward with thoughtful, developer-first projects.

***“Envio is the best indexer for EVM chains. Blazing fast indexing and native multi-chain support make it a game-changer.” - Paul Berg, Co-Founder & CEO at Sablier Labs***

We’re especially thankful for Paul’s ongoing support of Envio and for being such an engaged developer and community member.

We highly recommend exploring Paul’s contributions and projects in the space. He’s also an active voice on [X](https://x.com/PaulRBerg) and [Farcaster](https://farcaster.xyz/prberg), where he shares insights that go beyond crypto, diving into topics like longevity, epistemology, and physics. Give him a follow and check out his [GitHub](https://github.com/PaulRBerg
) to stay in the loop! 

## Playlist of the Month 🎧️ 

<img src="/blog-assets/dev-update-may-2025-9.png" alt="playlist may 2025" width="100%"/>

▶️ [Open Spotify](https://open.spotify.com/playlist/5qpi10IrOQcNv8ixqWPkFB?si=876ddf7528534b2f)


## Ship With Us 🚢 

Envio is a modern, multi-chain EVM blockchain indexer for querying real-time and historical data. If you’re working on a Web3 project and want a smoother development process, Envio’s got your back(end). Check out our docs, join the community, and let’s talk about your data needs.

Stay tuned for more monthly updates by subscribing to our newsletter, following us on X, or hopping into our Discord for more up-to-date information.


[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌 

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)