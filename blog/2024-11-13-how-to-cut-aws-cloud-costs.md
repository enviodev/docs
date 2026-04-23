---
title: Optimizing Blockchain Indexers on AWS
sidebar_label: How to Optimize Blockchain Indexers on AWS and Reduce Cloud Costs
slug: /cut-aws-cloud-costs
description: "Learn how to optimize your blockchain indexer on AWS using smarter infrastructure planning and scaling techniques to cut costs and improve performance."
image: /blog-assets/cut-aws-cloud-costs1.png
last_update:
  date: 2026-04-15
authors: ["j_o_r_d_y_s"]
---

<img src="/blog-assets/cut-aws-cloud-costs1.png" alt="Envio Cover Photo" width="100%"/>

<!--truncate-->

:::note TL;DR
- Running blockchain indexers on AWS has three main cost drivers: networking (NAT Gateway, cross-AZ data transfer), compute (instance sizing, spot instances), and storage (RDS vs Aurora I/O-Optimized).
- Practical strategies like single-AZ deployment, Bottlerocket OS, and Aurora I/O-Optimized can cut costs significantly without sacrificing reliability.
- These are the same optimizations Envio uses internally to power its Hosted Service, so teams using Envio Cloud get these benefits without configuring them manually.
:::

When running any application on cloud infrastructure, one of the first questions that comes up is: where did all the money go? In the [AWS](https://aws.amazon.com/) ecosystem, expenses like hidden EC2 charges, complex data transfer costs, or the confusing [Aurora pricing model](https://aws.amazon.com/rds/aurora/pricing/) can quickly add up.

Whether you are running Envio's [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) on your own AWS setup or are curious about how Envio optimizes cloud resources to deliver its Hosted Service, this guide walks through practical techniques to maximize your blockchain indexer's performance while keeping costs as low as possible.

## Challenges of running indexers on AWS

Understanding these challenges helps you prepare and optimize your setup effectively:

- **Cost management**: Navigating AWS pricing is complex. Hidden charges, especially for data transfer and compute, can lead to unexpected bills if not carefully monitored.
- **Configuration complexity**: Setting up an efficient architecture requires a solid understanding of AWS services. Misconfigurations lead to increased costs and reduced reliability.
- **Performance tuning**: Indexers handle fluctuating workloads. Balancing performance with cost-effectiveness requires constant monitoring and adjustments.
- **High availability**: Achieving true high availability without significant costs requires careful trade-offs between cost and redundancy.
- **Data management**: As indexers scale, managing large volumes of data efficiently becomes critical for maintaining performance while keeping costs low.

## The costs of running an indexer

The cost of running an indexer breaks down into three key areas:

### 1. Networking

**Avoid NAT Gateway**

At the core of every indexer is fetching data from external sources (like HyperSync or an RPC provider) and indexing it into a storage layer (PostgreSQL). If you are running your indexer in an AWS private subnet, network traffic passes through a NAT Gateway, costing $0.045/GB (US-East) for both requests and responses.

Think of a NAT Gateway as a hotel doorman: it handles your packages and ensures your privacy, but it comes at a cost. If you have carefully assessed your security needs and set up proper security groups, running your indexer in a public subnet is a perfectly acceptable option. In that case, you can bypass the NAT Gateway entirely and use an Internet Gateway, allowing communication with the outside world without the added cost of NAT traffic.

**Transferring data within a region**

When deploying an indexer in [Kubernetes](https://kubernetes.io/) (EKS) or on an EC2 instance, it is easy for your indexer and storage layer to end up in different availability zones (AZs). AWS charges $0.01/GB (US-East) for data transferred between AZs, both in and out. To minimize costs, deploy both your indexer and storage layer within the same AZ.

You might wonder: does this compromise high availability? Somewhat. If one AZ goes down, both your indexer and storage layer go down together. But since these two components are tightly coupled, if one fails the other is effectively unusable anyway.

For true HA with low costs, consider AWS Aurora. Aurora replicates data across multiple AZs at no extra cost (baked into Aurora's pricing), and your indexer can connect to an Aurora instance within its own AZ. If one AZ fails, your indexer can redeploy in another AZ where another Aurora instance is ready.

### 2. Compute

Figuring out the right amount of compute power for your indexer requires balancing two distinct phases. When first deployed, your indexer processes historical data. Once caught up, it only needs to handle real-time indexing. The compute resources required for these two stages are quite different: historical indexing demands more resources while real-time indexing requires less.

To optimize costs, use different EC2 instance types for each stage. Start with a larger, more powerful instance to process historical data as quickly as possible, then switch to a smaller, cheaper instance once you are caught up. Since AWS charges by the hour, find the smallest instance that can sync historical data quickly enough, then downsize for real-time indexing.

**Spot instances**

[Spot instances](https://aws.amazon.com/ec2/spot/) can save up to 90% on EC2 costs. They are unused EC2 capacity offered at a discount but can be terminated when AWS needs the capacity. For HyperIndex indexers, which are stateless by nature, this is less of an issue since moving an indexer from one instance to another is straightforward. If staying close to real-time is critical, the interruptions of spot instances may be a headache.

**Using Bottlerocket OS for EC2 instances**

One way to minimize downtime when using spot instances, especially if running your indexer in [EKS](https://aws.amazon.com/eks/), is to use [Bottlerocket OS](https://aws.amazon.com/bottlerocket/) for your EC2 instances. Bottlerocket is a lightweight, container-optimized operating system that boots up much faster than Ubuntu or Amazon Linux. By using Bottlerocket, you can significantly cut downtime when a spot instance gets replaced. Since it is lightweight, more of your resources are dedicated to the indexer itself.

Tip: when using spot instances with tools like EKS and Karpenter, specify as many EC2 instance types as possible. If one type runs out of spot capacity, Karpenter can try another before falling back to an on-demand instance.

### 3. Storage

When hosting indexers on AWS, your primary options for PostgreSQL are AWS RDS and Aurora.

**IOPS**

Indexers are high-IOPS applications that handle a relentless stream of inserts and updates, meaning they need a storage solution that can support high IOPS. Serverless options will not cut it for indexers, as they cannot manage the constant load.

For indexers on Aurora, Aurora I/O-Optimized is worth considering. Released in May 2023, this configuration eliminates IOPS charges, allowing you to avoid significant I/O costs that can make up 50% of expenses on standard Aurora. By switching to Aurora I/O-Optimized, you effectively get unlimited IOPS. The higher storage costs are offset by the elimination of per-IOPS billing, making it a more predictable and potentially cheaper option for high-I/O workloads.

**Storage requirements**

With RDS, you provision storage upfront, which can lead to over-provisioning. Aurora offers a pay-as-you-go storage option that scales automatically as your data grows. This flexibility can result in significant savings, especially when dealing with historical indexing or unpredictable storage growth.

**Resource requirements**

A key component of Aurora is its separation of compute and storage. Unlike RDS, where storage is tightly coupled with compute, Aurora allows you to scale these independently. This is particularly useful when your indexer's compute and storage requirements fluctuate at different stages of the indexing process.

In short: since indexers are high-I/O applications that scale up and down over time, Aurora I/O-Optimized can provide significant cost savings while delivering the performance you need. RDS remains a more affordable option for smaller indexers or a more hands-on approach to storage management.

## Conclusion

Running indexers on AWS does not have to be expensive. By understanding the key cost drivers in networking, compute, and storage and using the right AWS tools and configurations, you can significantly reduce your cloud bill while maintaining high performance. Whether you are optimizing your network with a single-AZ setup or taking advantage of spot instances for compute savings, there is always a smart way to balance performance and cost.

These are the same optimizations Envio uses to power its Hosted Service. Teams using Envio Cloud get these benefits automatically, without needing to configure them manually.

## What is AWS?

AWS (Amazon Web Services) is a cloud computing platform providing on-demand services including computing power, storage, and networking. It allows businesses to scale their infrastructure without owning physical servers, offering flexibility and cost efficiency. Whether you are running a simple website or a complex application like a blockchain indexer, AWS helps you manage resources while paying only for what you use.

## Frequently asked questions

### Should I run my blockchain indexer in a public or private AWS subnet?

For most indexers, a public subnet with well-configured security groups is a perfectly acceptable and cost-effective option. It avoids NAT Gateway charges ($0.045/GB) while still maintaining security through security groups. Private subnets add privacy but add cost and complexity that may not be justified for an indexer.

### Is Aurora always cheaper than RDS for blockchain indexers?

Not always, but for high-IOPS indexers Aurora I/O-Optimized is typically more cost-effective. Standard Aurora and RDS charge per I/O operation, which adds up fast for indexers doing constant inserts and updates. Aurora I/O-Optimized eliminates per-IOPS billing in favor of higher storage costs, which is usually a net win for indexing workloads.

### Can I use spot instances for a production blockchain indexer?

Yes, with caveats. HyperIndex indexers are stateless, so recovering from a spot termination is straightforward. If you need to stay as close to real-time as possible, spot interruptions may cause brief gaps. Using Bottlerocket OS and specifying multiple instance types in Karpenter minimizes downtime when instances are replaced.

### How does Envio's hosted service compare to self-managing on AWS?

Envio's Hosted Service applies the same optimizations described in this post (single-AZ networking, Aurora I/O-Optimized, Bottlerocket OS on EKS) internally. Self-managing on AWS gives you more control but requires engineering time to configure and maintain these optimizations yourself. For most teams, the hosted service is faster and cheaper to operate.

### What is the biggest hidden cost when running indexers on AWS?

NAT Gateway charges and cross-AZ data transfer fees are the most commonly overlooked costs. A single indexer processing large volumes of HyperSync data through a NAT Gateway can generate hundreds of dollars per month in transfer fees. Deploying in a public subnet or consolidating your indexer and database in the same AZ eliminates most of this cost.

## Build With Envio

Envio is the fastest independently benchmarked EVM blockchain indexer for querying real-time and historical data. If you are building onchain and need indexing that keeps up with your chain, check out the [docs](https://docs.envio.dev/docs/HyperIndex/overview), run the benchmarks yourself, and come talk to us about your data needs.

Stay tuned for more updates by subscribing to our newsletter, following us on X, or hopping into our Discord.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post) 💌

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
