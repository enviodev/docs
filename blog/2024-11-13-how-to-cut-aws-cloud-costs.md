---
title: How to Optimize Blockchain Indexers on AWS and Reduce Cloud Costs
sidebar_label: How to Optimize Blockchain Indexers on AWS and Reduce Cloud Costs
slug: /cut-aws-cloud-costs
description: "Learn how to optimize your blockchain indexer on AWS using smarter infrastructure planning caching and scaling techniques to cut costs and improve performance."
---

<img src="/blog-assets/cut-aws-cloud-costs1.png" alt="Envio Cover Photo" width="100%"/>

<!--truncate-->

When running any application on cloud infrastructure, one of the first questions that comes up is: “*Where did all the money go?”* In the [AWS](https://aws.amazon.com/free/?gclid=CjwKCAjwgfm3BhBeEiwAFfxrG2y6uVQn8UrvcpSgZSCHqIXEmy5S6MNO5jM026non-9PUdmF3E3VZBoCX4UQAvD_BwE&trk=d5254134-67ca-4a35-91cc-77868c97eedd&sc_channel=ps&ef_id=CjwKCAjwgfm3BhBeEiwAFfxrG2y6uVQn8UrvcpSgZSCHqIXEmy5S6MNO5jM026non-9PUdmF3E3VZBoCX4UQAvD_BwE:G:s&s_kwcid=AL!4422!3!433803620858!e!!g!!aws!1680401428!67152600164&all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=*all&awsf.Free%20Tier%20Categories=*all) (Amazon Web Services) ecosystem, expenses like hidden EC2 charges, complex data transfer costs, or the confusing [Aurora pricing model](https://aws.amazon.com/rds/aurora/pricing/) can quickly leave you confused.

Whether you're running Envio’s [HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) on your own AWS setup or are curious about how Envio optimizes cloud resources to deliver Hosted HyperIndex, this guide will walk you through practical techniques to maximize your blockchain indexer’s performance, while keeping costs as low as possible.



## Challenges of Running Indexers on AWS

While leveraging AWS for your indexers offers significant advantages, it also comes with its share of challenges. Understanding these hurdles can help you prepare and optimize your setup effectively:



* **Cost Management**: Navigating the complex pricing structure of AWS can be daunting. Hidden charges, especially for data transfer and compute resources, can lead to unexpected bills if not carefully monitored.

* **Configuration Complexity**: Setting up an efficient and cost-effective architecture requires a solid understanding of AWS services. Misconfigurations can not only lead to increased costs but also impact performance and reliability.

* **Performance Tuning**: Indexers often need to handle fluctuating workloads. Balancing performance with cost-effectiveness demands constant monitoring and adjustments to resource allocation, which can be time-consuming.

* **High Availability (HA)**: Achieving true high availability without incurring significant costs can be tricky. The trade-offs between cost and redundancy require careful consideration to maintain system resilience.

* **Data Management**: As indexers scale, managing large volumes of data efficiently becomes critical. Ensuring data integrity and performance while keeping costs low can pose significant challenges.

By being aware of these challenges, you can devise strategies to mitigate risks and streamline your AWS deployment for running indexers.


## The Costs of Running an Indexer

The cost of running an indexer boils down to three key areas and their related costs:



1. Networking

	**Avoid NAT Gateway**


    At the core of every indexer is fetching data from external sources (like HyperSync or an RPC provider) and indexing it into a storage layer (PostgreSQL). If you're running your indexer in an AWS private subnet, network traffic passes through a NAT Gateway, costing $0.045/GB (US-East) for both requests and responses and costs can add up fast!


    Think of a NAT Gateway as a hotel doorman. They handle your packages and deliveries, ensuring your privacy—so the sender has no idea where you are. But, like most good services, it comes at a cost.


    Now, if you’ve carefully assessed your security needs and set up proper security measures—like well-defined security groups—running your indexer in a public subnet can be a perfectly acceptable option. In this case, you can bypass the NAT Gateway entirely. Instead, your indexer will use an Internet Gateway, allowing you to communicate with the outside world without the added cost of NAT traffic. Just make sure your security posture is solid, and you can enjoy those cost savings with confidence.


    **Transferring Data Within a Region**


    Another sneaky contributor to network costs in AWS is data transfer within a region. When deploying an indexer in [Kubernetes](https://kubernetes.io/) (EKS) or a random EC2, it’s easy for your indexer and storage layer (whether a container or RDS instance) to end up in different availability zones (AZs). AWS charges $0.01/GB (US-East) for data transferred between AZs—both in and out. So, to minimize costs, it’s optimal to deploy both your indexer and storage layer within the same AZ.


    You might wonder, doesn’t this compromise HA (High Availability)? Yes and no. If, say, ***us-east-1a*** goes down, both your indexer and storage layer will go down together. But since these two components are tightly coupled, if one fails, the other might as well go with it—it’s like pulling the plug on the whole operation.


    For true HA with low costs, consider using AWS Aurora. Aurora replicates data across multiple AZs at no extra cost (baked into Aurora’s pricing), and your indexer can connect to an Aurora instance within its AZ. If one AZ fails, your indexer can redeploy in another AZ, where another Aurora instance is ready.



2. Compute

    Figuring out the right amount of compute power for your indexer can feel like walking a tightrope—it's resource needs aren’t consistent. When first deployed, your indexer will likely chug through historical data before catching up to real-time indexing. The trick here is that the compute resources required for these two stages are quite different: historical indexing demands more resources while real-time indexing requires less.


    To optimize costs, you can use different EC2 instance types for each stage. Start with a larger, more powerful instance to breeze through historical indexing as quickly as possible, then switch to a smaller, cheaper instance once you’re caught up and only need to handle real-time data. Since AWS charges by the hour, your goal is to strike the perfect balance—find the smallest instance that can sync historical data quickly enough, then downsize for real-time indexing to keep costs low.


    **Spot Instances**

Of course, no AWS cost-savings discussion would be complete without mentioning [spot instances](https://aws.amazon.com/ec2/spot/?gclid=CjwKCAjwgfm3BhBeEiwAFfxrGxxemjOOxB1bkGIRt57ZntuZl60_feeehNVGNYPZtc-Go_3ytbK0PhoCaygQAvD_BwE&cards.sort-by=item.additionalFields.startDateTime&cards.sort-order=asc&trk=f38fa353-0155-4fcc-8e3d-7d3737b38226&sc_channel=ps&ef_id=CjwKCAjwgfm3BhBeEiwAFfxrGxxemjOOxB1bkGIRt57ZntuZl60_feeehNVGNYPZtc-Go_3ytbK0PhoCaygQAvD_BwE:G:s&s_kwcid=AL!4422!3!517649434519!p!!g!!ec2%20spot!12876304542!122013844952)! Spot instances can save you up to 90% on EC2 costs, which sounds fantastic—until you realize they’re available one minute and gone the next. Spot instances are essentially unused EC2 capacity that AWS offers at a discount, but they can be terminated if another customer needs that capacity and is willing to pay for it. In other words, if someone wants an on-demand ***t3.large*** and there aren’t any left, AWS will kindly shut down your spot instance to accommodate them.


    Now, for HyperIndex indexers—which are stateless by nature—this isn’t a huge issue. Moving an indexer from one instance to another isn’t a big deal. But if your goal is to stay as close to real-time as possible, the constant up-and-down of spot instances could be a headache.


    **Using Bottlerocket OS for EC2 Instances**


    One way to minimize downtime in this scenario, especially if you’re running your indexer in [EKS](https://aws.amazon.com/eks/), is to use [Bottlerocket OS](https://aws.amazon.com/bottlerocket/?amazon-bottlerocket-whats-new.sort-by=item.additionalFields.postDateTime&amazon-bottlerocket-whats-new.sort-order=desc) for your EC2 instances. Bottlerocket is a lightweight, container-optimized operating system that boots up much faster than [Ubuntu](https://ubuntu.com/) or [Amazon Linux](https://aws.amazon.com/amazon-linux-2/?amazon-linux-whats-new.sort-by=item.additionalFields.postDateTime&amazon-linux-whats-new.sort-order=desc). By leveraging Bottlerocket, you can significantly cut down on the downtime when a spot instance gets replaced. Plus, since it’s so lightweight, more of your resources can be dedicated to the indexer itself, squeezing out even more savings.


    *💡Tip: when using spot instances with tools like EKS and Karpenter, specify as many EC2 instance types as possible. This way, if one type runs out of spot capacity, Karpenter can try another before falling back to an on-demand instance.*

3. Storage

    Ah, storage—the one thing that keeps infrastructure engineers up at night.Since we’re focusing on AWS, we’ll stick to AWS storage solutions rather than running your own Postgres on an EC2 instance or inside Kubernetes.

When hosting indexers on AWS, your primary options for PostgreSQL are AWS RDS and Aurora. On the surface, RDS might seem like the cheaper choice, but the devil is in the details and the decision isn’t so straightforward. To help you out, We’ve added some tips below on things to consider when deciding which AWS storage solution is best for you.


    **IOPS**


    Indexers are high IOPS (Input/output operations per second) based applications (some more so than others depending on the underlying chain) that handle a relentless stream of inserts and updates, meaning they need a storage solution that can support high IOPS. For this reason, serverless options won’t cut it—they simply can’t manage the constant load and since there is never a quiet time, will not provide a cost-effective solution. 


    For indexers on Aurora, Aurora I/O-Optimized is a game-changer. Released in May 2023, this configuration eliminates IOPS charges, allowing you to avoid the significant I/O costs that can make up to 50% of your expenses on standard Aurora. By switching to Aurora I/O-Optimized, you effectively get unlimited IOPS. The higher storage costs associated with Aurora I/O-Optimized are offset by the elimination of per-IOPS billing, making it a more predictable and potentially cheaper option for high-I/O workloads like indexers.


    **Storage Requirements**


    With RDS, you need to provision storage upfront. While this might seem simple, it can lead to over-provisioning—reserving more storage than you need "just in case." This means you're paying for storage from day one, even if you're not using it yet. On the other hand, Aurora offers a pay-as-you-go storage option that scales automatically as your data grows. This flexibility can result in significant savings, especially when dealing with historical indexing or unpredictable storage growth.


    **Resource Requirements**


    Another element worth considering is the resource requirements during the indexer’s lifecycle. A key component of Aurora is its separation of compute and storage. Unlike RDS, where storage is tightly coupled with compute, Aurora allows you to scale these independently. This is particularly useful when your indexers compute and storage requirements fluctuate at different stages of the indexing processes as it gives you more flexibility and better cost optimization.


    In a nutshell, since indexers are high-I/O-based applications that scale up and down over time, Aurora I/O optimized can provide significant cost savings while also delivering the performance you need. RDS, on the other hand, remains a more affordable option for a more hands-on approach to managing the storage layer or smaller indexers where a micro-based database instance is adequate.



# Conclusion

Running indexers on AWS doesn’t have to be an expensive endeavor. By understanding the key cost drivers in networking, compute, and storage—and using the right AWS tools and configurations—you can significantly reduce your cloud bill while maintaining high performance. Whether you're optimizing your network with a single AZ setup or taking advantage of spot instances for compute savings, there’s always a smart way to balance performance and cost at every stage of your indexer’s deployment.

These tips are just some of the levers Envio uses to provide a powerful and cost-effective solution for Hosted HyperIndex—while ensuring [Jeff](https://x.com/JeffBezos) can’t buy that next yacht so easily. 


## What is AWS?

AWS (Amazon Web Services) is a cloud computing platform that provides a broad range of on-demand services like computing power, storage, and networking. It allows businesses to scale their infrastructure without owning physical servers, offering flexibility and cost efficiency. Whether you're running a simple website or a complex application like a blockchain indexer, AWS helps you manage your resources while only paying for what you use, making it a popular choice for developers looking to optimize cloud costs and performance.


## About Envio

[Envio](https://envio.dev) is a fast, developer friendly blockchain indexer and the fastest, most flexible way to get on-chain data, making real-time data accessible for developers across the Web3 ecosystem.

With Envio, developers can query and stream blockchain data efficiently without the complexity of running their own infrastructure. Envio’s blockchain indexing tools supports any EVM network and is trusted by many teams building everything from DeFi platforms to analytics dashboards and production applications.

If you’re a blockchain developer or analyst looking to enhance your workflow, look no further. Join our growing community of Web3 builders and explore our docs.

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.com/invite/gt7yEUZKeB) | [Farcaster](https://warpcast.com/envio) | [GitHub](https://github.com/enviodev) | [Medium](https://medium.com/@Envio_Indexer)
