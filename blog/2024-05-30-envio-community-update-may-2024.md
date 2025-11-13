---
title: Envio Developer Update May 2024  
sidebar_label: Envio Developer Update May 2024  
slug: /envio-developer-update-may-2024  
description: "Explore Envio’s May 2024 update with release v1.1.0, our new Python HyperFuel client, upcoming developer events and the latest community milestones."  
---  

<img src="/blog-assets/envio-dev-community-update-may-2024.png" alt="Cover Image Envio Developer Community Update May 2024" width="100%"/>

<!--truncate-->

Welcome to our latest developer update for May 2024. Dive into our latest release V.1.1.0 and discover what the Envio team has been shipping over the past month, including exciting new features, technical updates, upcoming events, our time at [DappCon](https://www.dappcon.io/) Berlin, and more. ⚡️

## 🚀 New Release: Version 1.1.0 Now Available! 🚀

(All non-breaking changes.)

- Refactor ABI parsing. (non-breaking)
- Add txTo as an optional field alongside txOrigin (non-breaking).
- Add retry to HyperSync in case where a HyperSync replica is out of sync (bug fix).

_⭐️ Please note: We are marking V1.0.x as deprecated in NPM due to the bug we fixed in this release. Please upgrade if you are on V1.0.2._

Stay up-to-date with our latest version releases by following the “🚨releases” [channel](https://discord.gg/uGVheTdmaH) in our Discord to get live updates as soon as new versions are available!

## Python Package for Envio’s HyperFuel Client is live! 🐍

Now developers and analysts building on the [Fuel Network](https://fuel.network/) can interact with our flexible [HyperSync](https://docs.envio.dev/docs/HyperSync/overview) API using either [JavaScript](https://www.javascript.com/), [Python](https://www.python.org/) or [Rust](https://www.rust-lang.org/) clients, and choose to query their data in JSON, Arrow, and Parquet data formats.

To install, run the $ pip install hyperfuel command.

Learn more [here](https://github.com/enviodev/hyperfuel-client-python).

See the simple Python script example below:

```python
# This example will simply fetch the logs from the given contracts over a block range

# returns all log data necessary for fuel's decoder

import hyperfuel
import asyncio

async def main():
client = hyperfuel.HyperfuelClient()

contracts = ["0xff63ad3cdb5fde197dfa2d248330d458bffe631bda65938aa7ab7e37efa561d0"]
from_block = 8076516
to_block = 8076517

logs = await client.preset_query_get_logs(contracts, from_block, to_block)

print("number of logs: " + str(len(logs.data)))
print("logs: " + str(logs.data))

asyncio.run(main())
```

## Upcoming Events 🗓️

- [ETHCC Brussels](https://ethcc.io/): 8th - 11th July, 2024
- [Encode Club - Brussels Hacker House](https://www.encode.club/brussels2024): 8th - 10th July, 2024
- [Modular Summit 3.0](https://modularsummit.dev/): 11th - 13th July, 2024

## Developer Workshops 🧑‍💻

[DappCon: Modern Blockchain Indexing](https://www.youtube.com/live/4079kgB4EVM?feature=shared&t=12668) 📺️

<img src="/blog-assets/envio-dev-community-update-may-2024-dappcon.png" alt="Cover Image DappCon Speaker Modern Blockchain Indexing" width="100%"/>

### Upcoming Workshops

Encode Club Boot Camp: Why you should think about indexing when developing smart contracts - 15th July 3 pm CET

How to monitor and get data from your smart contracts once they are deployed in production -  22nd July 3 pm CET

<img src="/blog-assets/envio-dev-community-update-may-2024-encode.png" alt="Cover Image DappCon Speaker Modern Blockchain Indexing" width="100%"/>

Register [here](https://www.encode.club/solidity-bootcamps/?utm_source=twitter&utm_medium=social&utm_campaign=e0338_external_envio&utm_content=wopg5g).

For a full list of written tutorials visit our [docs](https://docs.envio.dev/docs/tutorial-op-bridge-deposits).

For a full list of our video tutorials visit our [YouTube](https://www.youtube.com/@envio_indexer)

## Playlist of the month 🎧️

▶️ [Open Spotify](http://open.spotify.com/playlist/6CEWlx8MCYjBJoJoOkTOx9?si=94abcc8bb4a0413e)

<img src="/blog-assets/envio-dev-community-update-may-2024-spotify.png" alt="Cover Image DappCon Speaker Modern Blockchain Indexing" width="100%"/>

## Featured Developer 🧑‍💻

<img src="/blog-assets/envio-dev-community-update-may-2024-featured-developer.png" alt="Cover Image DappCon Speaker Modern Blockchain Indexing" width="100%"/>

This month's featured community member and developer of the month is Zonder, the CTO of GBlast. With four years of back-end development experience in the crypto field, Zonder’s engagement with our indexing infrastructure, invaluable feedback, and active presence in our Discord make them a standout crew member. We are pleased to recognize Zonder for their contributions and involvement and for building this epic indexer for GBlast:

[GBlast](https://gblast.gg/), is a GambleFi platform with both PvP and house-banked games built on [Blast](https://blast.io/en).

For a full list of deployed indexers visit our [explorer](https://envio.dev/explorer).

Follow GBlast on [X](https://x.com/GBlast_gg).

## Modular Summit 3.0 2024 Sponsors 🏆️

<img src="/blog-assets/envio-dev-community-update-may-2024-modular-summit.png" alt="Cover Image DappCon Speaker Modern Blockchain Indexing" width="100%"/>

<!--truncate-->

We’re excited to announce that Envio has been listed as a proud sponsor of the Modular Summit 3.0, a premier event in modular technology and Web3! 

Join us in Brussels, with top industry leaders, innovators, and enthusiasts to explore the future of decentralized technologies. Highlights include in-depth sessions, interactive workshops, and networking opportunities with key influencers and venture capitalists.

Stay tuned for more details and registration info [here](https://modularsummit.dev/).

## Envio Freelancer Network 🌐

We love connecting developers! Join our network of freelancers & contractors and get connected with Web3 protocols to service their data needs.⚡️

Simply fill out the [form](https://noteforms.com/forms/envio-freelancer-network-u9zqbv) to join our freelancer network.

## About Envio
## About Envio

[Envio](https://envio.dev) is a fast, developer-friendly blockchain indexer and the fastest, most flexible way to get on-chain data, making real-time data accessible for developers across the Web3 ecosystem.

With Envio, developers can query and stream blockchain data efficiently without the complexity of running their own infrastructure. Envio’s blockchain indexing tools supports any EVM network and is trusted by many teams building everything from DeFi platforms to analytics dashboards and production applications.

If you’re a blockchain developer or analyst looking to enhance your workflow, look no further. Join our growing community of Web3 builders and explore our docs.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [GitHub](https://github.com/enviodev) | [Medium](https://medium.com/@Envio_Indexer)
[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [GitHub](https://github.com/enviodev) | [Medium](https://medium.com/@Envio_Indexer)
