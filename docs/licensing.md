---
id: licensing
title: Licensing
sidebar_label: Licensing
slug: /licensing
---

## TL;DR

- Envio's licensing reflects open source ethos but is not OSI recognized.
- Developers can use Envio's services without vendor lock-in, either by self-hosting or specifying an RPC URL.
- The generated code by Envio's HyperIndex CLI tool adopts Elastic Search's v2 license.
- Elastic Search's v2 license allows self-hosting but restricts third-party competition with Envio's hosted service.
- Envio may consider open-sourcing in the future but prioritizes stakeholder interests and market traction.

## Our position

We're devs and we value OS ethos too, that's why our licensing mirrors a lot of the benefits from open source licensing however Envio and it's products do not use an open source license recognized by the [OSI](https://opensource.org/), we are however public and open and our licensing reflects this.

Our future business model lies in our hosted service and HyperSync requests and so we are protecting this but to ensure continuity and no vendor lock-in, developers are able to run and develop on their indexer without either. Either by self hosting, which our license permits or by specifying an RPC url in their indexer configuration and bypassing HyperSync.

Envio is in it's formative stages and though we may look to open source the software in the future we are dedicated to ensuring the best interests of all stakeholders. Going open source is some what of a one way function and it is easier to go open source than to proverbially go "closed source". Once we have gained more market traction we will review our position on going open source.

## Elastic Search v2 license

The generated code by the envio HyperIndex cli tool adopts the [Elastic Search's v2 license](https://www.elastic.co/licensing/elastic-license). The license essentially allows developers control to self host their indexer but prevents 3rd parties from competing with our hosted service by providing a hosted service or managed solution. Read more on some of the FAQs of the license [here](https://www.elastic.co/licensing/elastic-license/faq). The generated code is still open and can be seen by developers and customized.
