---
id: index
title: Supported Networks
sidebar_label: Supported Networks
slug: /supported-networks
---

HyperIndex natively supports indexing any EVM blockchain out of the box. As a developer you can start indexing and querying your smart contract data across any EVM-compatible L1, L2, or L3 blockchain using HyperIndex.

HyperIndex also supports data indexing on [Fuel](/docs/v2/HyperIndex/fuel).

:::info
The backbone of HyperIndex’s blazing-fast indexing speed lies in using HyperSync as a more performant and cost-effective data source to RPC for data retrieval. While RPCs are functional, and can be used in HyperIndex as a data source, they are far from efficient when it comes to querying large amounts of data (a time-consuming and resource-intensive endeavour).

HyperSync is significantly faster and more cost-effective than traditional RPC methods, allowing the retrieval of multiple blocks at once, and enabling sync speeds up to 1000x faster than RPC.
:::

If a [network is supported](/docs/HyperSync/hypersync-supported-networks) on HyperSync, then HyperSync is used by default as the data source. This means developers don't additionally need to worry about RPCs, rate-limiting, etc. This is especially valuable for multi-chain apps.

If the network that you want to index is not supported on HyperSync, please navigate to [RPC Data Source](/docs/v2/HyperIndex/rpc-sync) for more information to use RPC as a data source.

You can also request a network to be added to HyperSync in the [Discord](https://discord.gg/envio).

### Networks available on request

Some networks are supported on a request basis: HyperSync support exists, but access is enabled per project rather than being publicly available. These are marked _"Access on request"_ in the table below — reach out to us on [Discord](https://discord.gg/envio) to request access.

## All supported networks

<!-- NETWORKS_TABLE_START -->

| Network                      | Chain ID   | HyperSync URL                                  | HyperRPC URL                                   |
| ---------------------------- | ---------- | ---------------------------------------------- | ---------------------------------------------- |
| 0G Newton Testnet            | 16600      | _RPC only_                                     | _RPC only_                                     |
| Ab                           | 36888      | https://36888.hypersync.xyz                    | https://36888.rpc.hypersync.xyz                |
| Abstract                     | 2741       | https://2741.hypersync.xyz                     | https://2741.rpc.hypersync.xyz                 |
| Aleph Zero EVM               | 41455      | _RPC only_                                     | _RPC only_                                     |
| Altlayer OP Demo Testnet     | 9997       | _RPC only_                                     | _RPC only_                                     |
| Ancient8                     | 888888888  | _RPC only_                                     | _RPC only_                                     |
| Arbitrum                     | 42161      | https://42161.hypersync.xyz                    | https://42161.rpc.hypersync.xyz                |
| Arbitrum Blueberry           | 88153591557 | _RPC only_                                     | _RPC only_                                     |
| Arbitrum Nova                | 42170      | https://42170.hypersync.xyz                    | https://42170.rpc.hypersync.xyz                |
| Arbitrum Sepolia             | 421614     | https://421614.hypersync.xyz                   | https://421614.rpc.hypersync.xyz               |
| Arc Testnet                  | 5042002    | https://5042002.hypersync.xyz                  | https://5042002.rpc.hypersync.xyz              |
| Artela Testnet               | 11822      | _RPC only_                                     | _RPC only_                                     |
| Arthera Mainnet              | 10242      | _RPC only_                                     | _RPC only_                                     |
| Asset Chain Mainnet          | 42420      | _RPC only_                                     | _RPC only_                                     |
| Astar ZkEVM                  | 3776       | _RPC only_                                     | _RPC only_                                     |
| Astar ZKyoto                 | 6038361    | _RPC only_                                     | _RPC only_                                     |
| Aurora                       | 1313161554 | https://1313161554.hypersync.xyz               | https://1313161554.rpc.hypersync.xyz           |
| Avalanche                    | 43114      | https://43114.hypersync.xyz                    | https://43114.rpc.hypersync.xyz                |
| B2 Hub Testnet               | 1113       | _RPC only_                                     | _RPC only_                                     |
| B3                           | 8333       | _RPC only_                                     | _RPC only_                                     |
| B3 Sepolia Testnet           | 1993       | _RPC only_                                     | _RPC only_                                     |
| Base                         | 8453       | https://8453.hypersync.xyz                     | https://8453.rpc.hypersync.xyz                 |
| Base Sepolia                 | 84532      | https://84532.hypersync.xyz                    | https://84532.rpc.hypersync.xyz                |
| Base Traces*                 | 8453       | https://8453-traces.hypersync.xyz              | https://8453-traces.rpc.hypersync.xyz          |
| Beam                         | 4337       | _RPC only_                                     | _RPC only_                                     |
| Berachain                    | 80094      | https://80094.hypersync.xyz                    | https://80094.rpc.hypersync.xyz                |
| Berachain Artio Testnet      | 80085      | _RPC only_                                     | _RPC only_                                     |
| BEVM Mainnet                 | 11501      | _RPC only_                                     | _RPC only_                                     |
| BEVM Testnet                 | 11503      | _RPC only_                                     | _RPC only_                                     |
| Bitfinity Mainnet            | 355110     | _RPC only_                                     | _RPC only_                                     |
| Bitfinity Testnet            | 355113     | _RPC only_                                     | _RPC only_                                     |
| Bitgert Mainnet              | 32520      | _RPC only_                                     | _RPC only_                                     |
| Bitlayer                     | 200901     | _RPC only_                                     | _RPC only_                                     |
| Blast                        | 81457      | https://81457.hypersync.xyz                    | https://81457.rpc.hypersync.xyz                |
| BOB Mainnet                  | 60808      | _RPC only_                                     | _RPC only_                                     |
| Boba                         | 288        | https://288.hypersync.xyz                      | https://288.rpc.hypersync.xyz                  |
| Boba BNB Mainnet             | 56288      | _RPC only_                                     | _RPC only_                                     |
| Botanix Testnet              | 3636       | _RPC only_                                     | _RPC only_                                     |
| Bsc                          | 56         | https://56.hypersync.xyz                       | https://56.rpc.hypersync.xyz                   |
| Bsc Testnet                  | 97         | https://97.hypersync.xyz                       | https://97.rpc.hypersync.xyz                   |
| Canto                        | 7700       | _RPC only_                                     | _RPC only_                                     |
| Canto Testnet                | 7701       | _RPC only_                                     | _RPC only_                                     |
| Celo                         | 42220      | https://42220.hypersync.xyz                    | https://42220.rpc.hypersync.xyz                |
| Celo Alfajores Testnet       | 44787      | _RPC only_                                     | _RPC only_                                     |
| Chiliz                       | 88888      | https://88888.hypersync.xyz                    | https://88888.rpc.hypersync.xyz                |
| Chiliz Testnet Spicy         | 88882      | _RPC only_                                     | _RPC only_                                     |
| Citrea                       | 4114       | https://4114.hypersync.xyz                     | https://4114.rpc.hypersync.xyz                 |
| Citrea Devnet                | 62298      | _RPC only_                                     | _RPC only_                                     |
| Citrea Testnet               | 5115       | https://5115.hypersync.xyz                     | https://5115.rpc.hypersync.xyz                 |
| Core                         | 1116       | _RPC only_                                     | _RPC only_                                     |
| Creator Testnet              | 66665      | _RPC only_                                     | _RPC only_                                     |
| Cronos ZKEVM                 | 388        | _RPC only_                                     | _RPC only_                                     |
| Cronos ZKEVM Testnet         | 240        | _RPC only_                                     | _RPC only_                                     |
| CrossFi Mainnet              | 4158       | _RPC only_                                     | _RPC only_                                     |
| CrossFi Testnet              | 4157       | _RPC only_                                     | _RPC only_                                     |
| Curtis                       | 33111      | https://33111.hypersync.xyz                    | https://33111.rpc.hypersync.xyz                |
| Cyber                        | 7560       | https://7560.hypersync.xyz                     | https://7560.rpc.hypersync.xyz                 |
| Degen Chain                  | 666666666  | _RPC only_                                     | _RPC only_                                     |
| DFK Chain                    | 53935      | _RPC only_                                     | _RPC only_                                     |
| Dogechain Mainnet            | 2000       | _RPC only_                                     | _RPC only_                                     |
| Dogechain Testnet            | 568        | _RPC only_                                     | _RPC only_                                     |
| DOS Chain                    | 7979       | _RPC only_                                     | _RPC only_                                     |
| Energy Web                   | 246        | _RPC only_                                     | _RPC only_                                     |
| EOS                          | 17777      | _RPC only_                                     | _RPC only_                                     |
| Eth Traces                   | 1          | https://1-traces.hypersync.xyz                 | https://1-traces.rpc.hypersync.xyz             |
| Ethereum Mainnet             | 1          | https://1.hypersync.xyz                        | https://1.rpc.hypersync.xyz                    |
| Etherlink                    | 42793      | https://42793.hypersync.xyz                    | https://42793.rpc.hypersync.xyz                |
| Etherlink Testnet            | 128123     | _RPC only_                                     | _RPC only_                                     |
| Exosama                      | 2109       | _RPC only_                                     | _RPC only_                                     |
| Fantom                       | 250        | https://250.hypersync.xyz                      | https://250.rpc.hypersync.xyz                  |
| Fantom Testnet               | 4002       | _RPC only_                                     | _RPC only_                                     |
| Flare                        | 14         | https://14.hypersync.xyz                       | https://14.rpc.hypersync.xyz                   |
| Flare Songbird               | 19         | _RPC only_                                     | _RPC only_                                     |
| Flow                         | 747        | _RPC only_                                     | _RPC only_                                     |
| Flow Testnet                 | 545        | _RPC only_                                     | _RPC only_                                     |
| Fraxtal                      | 252        | https://252.hypersync.xyz                      | https://252.rpc.hypersync.xyz                  |
| Fuji                         | 43113      | https://43113.hypersync.xyz                    | https://43113.rpc.hypersync.xyz                |
| Gnosis                       | 100        | https://100.hypersync.xyz                      | https://100.rpc.hypersync.xyz                  |
| Gnosis Chiado                | 10200      | https://10200.hypersync.xyz                    | https://10200.rpc.hypersync.xyz                |
| Gravity Alpha Mainnet        | 1625       | _RPC only_                                     | _RPC only_                                     |
| Harmony Shard 0              | 1666600000 | https://1666600000.hypersync.xyz               | https://1666600000.rpc.hypersync.xyz           |
| Heco Chain                   | 128        | _RPC only_                                     | _RPC only_                                     |
| Hoodi                        | 560048     | https://560048.hypersync.xyz                   | https://560048.rpc.hypersync.xyz               |
| Hyperliquid                  | 999        | https://999.hypersync.xyz                      | https://999.rpc.hypersync.xyz                  |
| Immutable ZkEVM              | 13371      | _RPC only_                                     | _RPC only_                                     |
| Immutable ZkEVM Testnet      | 13473      | _RPC only_                                     | _RPC only_                                     |
| Injective*                   | 1776       | https://1776.hypersync.xyz                     | https://1776.rpc.hypersync.xyz                 |
| Ink                          | 57073      | https://57073.hypersync.xyz                    | https://57073.rpc.hypersync.xyz                |
| Iotex Network                | 4689       | _RPC only_                                     | _RPC only_                                     |
| Japan Open Chain             | 81         | _RPC only_                                     | _RPC only_                                     |
| Kaia                         | 8217       | _RPC only_                                     | _RPC only_                                     |
| Kakarot Starknet Sepolia     | 920637907288165 | _RPC only_                                     | _RPC only_                                     |
| Katana                       | 747474     | https://747474.hypersync.xyz                   | https://747474.rpc.hypersync.xyz               |
| Kroma                        | 255        | https://255.hypersync.xyz                      | https://255.rpc.hypersync.xyz                  |
| LayerEdge Testnet            | 3456       | _RPC only_                                     | _RPC only_                                     |
| Lightlink Pegasus Testnet    | 1891       | _RPC only_                                     | _RPC only_                                     |
| Lightlink Phoenix            | 1890       | _RPC only_                                     | _RPC only_                                     |
| Linea                        | 59144      | https://59144.hypersync.xyz                    | https://59144.rpc.hypersync.xyz                |
| Lisk                         | 1135       | https://1135.hypersync.xyz                     | https://1135.rpc.hypersync.xyz                 |
| Lukso                        | 42         | https://42.hypersync.xyz                       | https://42.rpc.hypersync.xyz                   |
| Lukso Testnet                | 4201       | https://4201.hypersync.xyz                     | https://4201.rpc.hypersync.xyz                 |
| Manta                        | 169        | https://169.hypersync.xyz                      | https://169.rpc.hypersync.xyz                  |
| Manta Pacific Sepolia        | 3441006    | _RPC only_                                     | _RPC only_                                     |
| Mantle                       | 5000       | https://5000.hypersync.xyz                     | https://5000.rpc.hypersync.xyz                 |
| Megaeth                      | 4326       | https://4326.hypersync.xyz                     | https://4326.rpc.hypersync.xyz                 |
| Megaeth Testnet2             | 6343       | https://6343.hypersync.xyz                     | https://6343.rpc.hypersync.xyz                 |
| Merlin                       | 4200       | https://4200.hypersync.xyz                     | https://4200.rpc.hypersync.xyz                 |
| Metall2                      | 1750       | https://1750.hypersync.xyz                     | https://1750.rpc.hypersync.xyz                 |
| Meter Mainnet                | 82         | _RPC only_                                     | _RPC only_                                     |
| Meter Testnet                | 83         | _RPC only_                                     | _RPC only_                                     |
| Mint Mainnet                 | 185        | _RPC only_                                     | _RPC only_                                     |
| Mode                         | 34443      | https://34443.hypersync.xyz                    | https://34443.rpc.hypersync.xyz                |
| Monad                        | 143        | https://143.hypersync.xyz                      | https://143.rpc.hypersync.xyz                  |
| Monad Testnet                | 10143      | https://10143.hypersync.xyz                    | https://10143.rpc.hypersync.xyz                |
| Moonbeam                     | 1284       | https://1284.hypersync.xyz                     | https://1284.rpc.hypersync.xyz                 |
| Morph                        | 2818       | https://2818.hypersync.xyz                     | https://2818.rpc.hypersync.xyz                 |
| Nautilus                     | 22222      | _RPC only_                                     | _RPC only_                                     |
| Neo X Testnet                | 12227332   | _RPC only_                                     | _RPC only_                                     |
| Nibiru Testnet               | 7210       | _RPC only_                                     | _RPC only_                                     |
| Now Chaint                   | 2488       | _RPC only_                                     | _RPC only_                                     |
| Oasis Emerald                | 42262      | _RPC only_                                     | _RPC only_                                     |
| Oasis Sapphire               | 23294      | _RPC only_                                     | _RPC only_                                     |
| ONIGIRI Subnet               | 5040       | _RPC only_                                     | _RPC only_                                     |
| ONIGIRI Test Subnet          | 5039       | _RPC only_                                     | _RPC only_                                     |
| Ontology Mainnet             | 58         | _RPC only_                                     | _RPC only_                                     |
| Ontology Testnet             | 5851       | _RPC only_                                     | _RPC only_                                     |
| OP Celestia Raspberry        | 123420111  | _RPC only_                                     | _RPC only_                                     |
| Opbnb                        | 204        | https://204.hypersync.xyz                      | https://204.rpc.hypersync.xyz                  |
| Optimism                     | 10         | https://10.hypersync.xyz                       | https://10.rpc.hypersync.xyz                   |
| Optimism Sepolia             | 11155420   | https://11155420.hypersync.xyz                 | https://11155420.rpc.hypersync.xyz             |
| Optopia                      | 62050      | _RPC only_                                     | _RPC only_                                     |
| Peaq                         | 3338       | _RPC only_                                     | _RPC only_                                     |
| Plasma                       | 9745       | https://9745.hypersync.xyz                     | https://9745.rpc.hypersync.xyz                 |
| Plume                        | 98866      | https://98866.hypersync.xyz                    | https://98866.rpc.hypersync.xyz                |
| Polygon                      | 137        | https://137.hypersync.xyz                      | https://137.rpc.hypersync.xyz                  |
| Polygon Amoy                 | 80002      | https://80002.hypersync.xyz                    | https://80002.rpc.hypersync.xyz                |
| Polygon zkEVM                | 1101       | https://1101.hypersync.xyz                     | https://1101.rpc.hypersync.xyz                 |
| Polygon ZkEVM Cardona Testnet | 2442       | _RPC only_                                     | _RPC only_                                     |
| Public Goods Network         | 424        | _RPC only_                                     | _RPC only_                                     |
| PulseChain                   | 369        | _RPC only_                                     | _RPC only_                                     |
| Puppynet Shibarium           | 157        | _RPC only_                                     | _RPC only_                                     |
| Robinhood                    | 4663       | https://4663.hypersync.xyz                     | https://4663.rpc.hypersync.xyz                 |
| Ronin                        | 2020       | _RPC only_                                     | _RPC only_                                     |
| Rootstock                    | 30         | https://30.hypersync.xyz                       | https://30.rpc.hypersync.xyz                   |
| SatoshiVM                    | 3109       | _RPC only_                                     | _RPC only_                                     |
| Scroll                       | 534352     | https://534352.hypersync.xyz                   | https://534352.rpc.hypersync.xyz               |
| Scroll Sepolia               | 534351     | _RPC only_                                     | _RPC only_                                     |
| Sei Testnet*                 | 1328       | https://1328.hypersync.xyz                     | https://1328.rpc.hypersync.xyz                 |
| Sei*                         | 1329       | https://1329.hypersync.xyz                     | https://1329.rpc.hypersync.xyz                 |
| Sepolia                      | 11155111   | https://11155111.hypersync.xyz                 | https://11155111.rpc.hypersync.xyz             |
| Shibarium                    | 109        | _RPC only_                                     | _RPC only_                                     |
| Shimmer Evm                  | 148        | https://148.hypersync.xyz                      | https://148.rpc.hypersync.xyz                  |
| Skale Europa                 | 2046399126 | _RPC only_                                     | _RPC only_                                     |
| Soneium                      | 1868       | https://1868.hypersync.xyz                     | https://1868.rpc.hypersync.xyz                 |
| Sonic                        | 146        | https://146.hypersync.xyz                      | https://146.rpc.hypersync.xyz                  |
| Sonic Testnet                | 14601      | https://14601.hypersync.xyz                    | https://14601.rpc.hypersync.xyz                |
| Sophon                       | 50104      | https://50104.hypersync.xyz                    | https://50104.rpc.hypersync.xyz                |
| Sophon Testnet               | 531050104  | https://531050104.hypersync.xyz                | https://531050104.rpc.hypersync.xyz            |
| Stable                       | 988        | Access on request — [contact us](https://discord.gg/envio) | Access on request — [contact us](https://discord.gg/envio) |
| StratoVM Testnet             | 93747      | _RPC only_                                     | _RPC only_                                     |
| Superseed                    | 5330       | https://5330.hypersync.xyz                     | https://5330.rpc.hypersync.xyz                 |
| Superseed Sepolia Testnet    | 53302      | _RPC only_                                     | _RPC only_                                     |
| Swell                        | 1923       | https://1923.hypersync.xyz                     | https://1923.rpc.hypersync.xyz                 |
| Taiko                        | 167000     | _RPC only_                                     | _RPC only_                                     |
| Tanssi Demo                  | 5678       | _RPC only_                                     | _RPC only_                                     |
| Telos EVM Mainnet            | 40         | _RPC only_                                     | _RPC only_                                     |
| Telos EVM Testnet            | 41         | _RPC only_                                     | _RPC only_                                     |
| Tempo                        | 4217       | https://4217.hypersync.xyz                     | https://4217.rpc.hypersync.xyz                 |
| Tempo Testnet                | 42429      | _RPC only_                                     | _RPC only_                                     |
| Torus Mainnet                | 8192       | _RPC only_                                     | _RPC only_                                     |
| Torus Testnet                | 8194       | _RPC only_                                     | _RPC only_                                     |
| Tron                         | 728126428  | https://728126428.hypersync.xyz                | https://728126428.rpc.hypersync.xyz            |
| Unichain                     | 130        | https://130.hypersync.xyz                      | https://130.rpc.hypersync.xyz                  |
| Unicorn Ultra Nebulas Testnet | 2484       | _RPC only_                                     | _RPC only_                                     |
| Velas Mainnet                | 106        | _RPC only_                                     | _RPC only_                                     |
| Viction                      | 88         | _RPC only_                                     | _RPC only_                                     |
| Worldchain                   | 480        | https://480.hypersync.xyz                      | https://480.rpc.hypersync.xyz                  |
| X Layer Mainnet              | 196        | _RPC only_                                     | _RPC only_                                     |
| X Layer Testnet              | 195        | _RPC only_                                     | _RPC only_                                     |
| XDC                          | 50         | Access on request — [contact us](https://discord.gg/envio) | Access on request — [contact us](https://discord.gg/envio) |
| XDC Apothem Testnet          | 51         | _RPC only_                                     | _RPC only_                                     |
| XDC Network                  | 50         | _RPC only_                                     | _RPC only_                                     |
| XDC Testnet                  | 51         | Access on request — [contact us](https://discord.gg/envio) | Access on request — [contact us](https://discord.gg/envio) |
| Zeta                         | 7000       | https://7000.hypersync.xyz                     | https://7000.rpc.hypersync.xyz                 |
| Zeta Testnet                 | 7001       | _RPC only_                                     | _RPC only_                                     |
| Zircuit                      | 48900      | Access on request — [contact us](https://discord.gg/envio) | Access on request — [contact us](https://discord.gg/envio) |
| ZkLink Nova Mainnet          | 810180     | _RPC only_                                     | _RPC only_                                     |
| ZKsync                       | 324        | https://324.hypersync.xyz                      | https://324.rpc.hypersync.xyz                  |
| ZkSync Sepolia Testnet       | 300        | _RPC only_                                     | _RPC only_                                     |
| Zora                         | 7777777    | https://7777777.hypersync.xyz                  | https://7777777.rpc.hypersync.xyz              |
| Zora Sepolia                 | 999999999  | _RPC only_                                     | _RPC only_                                     |


**Notes:**

- **Base Traces***: Start block: 39000000 (earlier blocks available on request)
- **Injective***: Start block: 129846180 (non-evm before that)
- **Sei***: Start block: 79123881 (non-evm before that)
- **Sei Testnet***: Start block: 186100000 (non-evm before that)

<!-- NETWORKS_TABLE_END -->

---
