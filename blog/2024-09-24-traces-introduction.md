---
title: Basic introduction to traces
sidebar_label: Using Traces from HyperSync
slug: /hypersync-traces-introduction
---

# Introduction to Traces

A few months ago, we added traces to HyperSync support. This allows you to fetch data about function calls on Ethereum just like you fetch events, transactions or blocks currently. And this is a really cool and powerful addition to your toolbelt.

Traces allow you to get a deeper understanding of what has happened on-chain and understand and analyze that on-chain activity. With simple filters, you can retrieve information about specific function signatures across the Ethereum blockchain and understand what parameters those functions are called with and what the outputs of those functions are.

There is a lot that can be done with traces. But for now, let's keep the example fun, light, and easy to understand.I know that many of you might want to delve into the depths of DeFi protocols, but to keep this blog accessible to all Ethereum developers, let's use a very simple example. CryptoKitties.

## What is CryptoKitties?

CryptoKitties was a novel game and a pioneering project in the NFT space, but at its core, it allows digital kittens, each with a unique set of genes, to mate with other digital kittens and create new digital kittens that combine the DNA set of the parents with some element of randomness.

It is not strictly necessary to understand the deep inner workings of CryptoKitties to follow along, but it will help you understand the example better. There are other external resources that go into more depth, the official docs have great detail on [cattributes](https://guide.cryptokitties.co/guide/cat-features/cat-attributes),  and [mutations](https://guide.cryptokitties.co/guide/cat-features/mutations). 

<img src="/blog-assets/traces-intro/cryptokitties-infographic.webp" alt="CryptoKitties Genome Mapping" width="100%"/>
Source: a great [article](https://medium.com/newtown-partners/cryptokitties-genome-mapping-6412136c0ae4) with excellent infographics written by our very own (co-founder) JonJon Clark.

<details>
<summary>Reference: Genetic Inheritance in CryptoKitties</summary>

#### **Cattributes**

The appearance of a gene and they are seen in the NFT image, e.g., the shape of the eye, or the color of the fur. More details can be found in the official [cattributes guide](https://guide.cryptokitties.co/guide/cat-features/cat-attributes).

#### **Gene Structure**

Each CryptoKitty has a genome that is stored on-chain as a 256 bit value. This genome composed of blocks, with each block containing four genes for different traits (such as fur pattern and eye color). Each block includes:

- **1 Primary Gene** (dominant): This gene determines the visible trait of the kitty.
- **3 Hidden Genes** (recessive): These genes are not visible but can be passed on to offspring.

#### **Probability of Gene Inheritance**

When two CryptoKitties breed, the inheritance of traits follows specific probabilities:

| SIRE GENE POSITION | SIRE % TO PASS | DAME GENE POSITION | DAME % TO PASS |
|--------------------|----------------|--------------------|----------------|
| P                  | 37.5%          | P                  | 37.5%          |
| H1                 | 9.4%           | H1                 | 9.4%           |
| H2                 | 2.3%           | H2                 | 2.3%           |
| H3                 | 0.8%           | H3                 | 0.8%           |

This means that when breeding two kitties, there is a significant likelihood that the offspring will display the dominant traits of one or both parents (75% to be exact, which is 37.5 + 37.5).

#### Mutations

In addition to standard inheritance, mutations can occur during breeding. A mutation is when a newborn kitty possesses a trait not seen in either parent. The chances of mutations depend on several factors:

- **Base Level Mutations**: When two kitties with certain compatible traits breed, there is up to a **25% chance** for first-order mutations (M1) and up to **12.5%** for second-order mutations (M2) or higher. Mutations can introduce new traits that enhance the uniqueness and potentially the value of the offspring.

Mutations can introduce new traits that enhance the uniqueness and potentially the value of the offspring.
</details>

 It is interesting to analyze the code that governs cryptokitties genes because it has never been open sourced and there is not extensive documentation on exactly how it works. Lets see what we can uncover.

## Extracting the traces

