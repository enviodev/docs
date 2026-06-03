---
title: "Just-in-Time Indexing: Using Agents to Answer Onchain Questions"
sidebar_label: "Just-in-Time Indexing: Using Agents to Answer Onchain Questions"
slug: /just-in-time-indexing-agents-onchain
tags: ["ai"]
description: "How to use an AI agent and Envio to answer one-off onchain questions without maintaining permanent infrastructure - build the indexer on demand, query it once, and delete it."
image: /blog-assets/just-in-time-indexing-agents-onchain.png
last_update:
  date: 2026-06-03
  author: Denham
authors: ["denhampreen"]
---

<img src="/blog-assets/just-in-time-indexing-agents-onchain.png" alt="Just-in-Time Indexing: Using Agents to Answer Onchain Questions" width="100%"/>

<!--truncate-->

Just-in-time indexing is a way of using an AI agent to answer one-off questions about onchain data without maintaining permanent infrastructure or finding a pre-indexed data point. Rather than building an indexer in advance and keeping it running, the dataset is built on demand when a question comes up, read once, and deleted afterward.

## How it Works

One user, Michael K from Curve Finance, uses it for ad hoc analysis of pool activity. The flow starts with a plain-language prompt to Claude, for example: "Use Envio to parse all the trades from this pool."

Claude, using Envio's tooling, generates the indexer: the config, schema, and event handlers, scoped to the specific contract and events in the question. It deploys to Envio's free development plan cloud service with `envio-cloud`, the CLI, and the indexer backfills from scratch. After 5 to 10 minutes, the data is ready to query. Once the researcher has pulled what they need, they delete the indexer.

<div style={{margin: "2rem 0", padding: "1.5rem 2rem", borderLeft: "4px solid #f97316", background: "rgba(249,115,22,0.06)", borderRadius: "0 8px 8px 0"}}>
  <p style={{fontSize: "1.1rem", fontStyle: "italic", marginBottom: "0.75rem"}}>"One of the simplest ways to get large datasets of onchain data for our research purposes."</p>
  <p style={{margin: 0, fontWeight: 600}}>Michael K, Researcher at Curve Finance</p>
</div>

## Why the Free Tier Covers it

The workflow runs on Envio's free hosted cloud tier. The requests are one-off, so a single repo is enough: the agent manages it and deploys each question as a branch. A backfill of 5 to 10 minutes is acceptable for ad hoc work, where the alternative is building a pipeline by hand.

## The Pattern

Traditional indexing requires deciding what data is needed, building the pipeline, and then querying it, which limits the user to questions planned for in advance. Just-in-time indexing reverses the order: the question comes first, and the dataset is built to answer it.

This works because backfilling takes minutes rather than days, and because an agent can stand up the indexer from a natural-language prompt without anyone writing config by hand. The same pattern applies to any agent or user asking one-off onchain questions.

<div style={{margin: "2rem 0", padding: "1.5rem 2rem", borderLeft: "4px solid #f97316", background: "rgba(249,115,22,0.06)", borderRadius: "0 8px 8px 0"}}>
  <p style={{fontSize: "1.1rem", fontStyle: "italic", marginBottom: "0.75rem"}}>"We use Envio regularly to parse all kinds of data from all kinds of contracts across dozens of chains."</p>
  <p style={{margin: 0, fontWeight: 600}}>Michael K, Researcher at Curve Finance</p>
</div>

## Build With Envio

Envio is a real-time multichain blockchain indexer that turns onchain events into a queryable GraphQL API. Supports any EVM chain, plus Solana and Fuel. Use [Envio Cloud](https://docs.envio.dev/docs/HyperIndex/hosted-service) or self-host. If you're building onchain, come talk to us about your data needs.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
