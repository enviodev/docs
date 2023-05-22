---
title: "Apeing in Responsibly: Managing risk in the Float Alpha"
sidebar_label: Apeing in Responsibly
slug: /apeing-in-responsibly
---

<img src="/blog/ape-responsibly-new.png" alt="apeing in responsibly" width="100%"/>

<!--truncate-->

<em>
“Apeing In Responsibly (AIR)” — the practice of depositing a large amount of liquidity in a protocol while understanding the risks. E.g. “Remember to AIR.”
</em>


Float is entering the onchain asset space with a new approach for creating magic internet assets that are <strong>easy</strong>, <strong>safe</strong> and <strong>efficient</strong>.

But of course, with great innovation comes a degree of risk. Interacting with any DeFi platform will expose the user to some risk. While Float is designed to remove risks that were previously inherent to onchain asset exposure, some risks are still present. This article explores those risks, so that you can ape on the Float Alpha responsibly.

## But first, a 30 second float shill

Float is a community governed <strong>magic internet asset protocol</strong> utilizing novel mechanisms to avoid liquidations, while creating onchain asset markets that <strong>scale</strong>.

You can use a stable coin to simply mint a magic internet asset in a few clicks and leave the rest up to the code. Crypto, equities, commodities, forex, specialized assets (the flipp3ning)… we got you.

We are launching an Alpha, as opposed to the full blown Float launch (even though we are audited and well tested), since we are serious about security and the risks posed by using innovative protocols such as ours. An Alpha will give us a chance to better test the protocol and incentives ‘in the wild’ before degens start locking up hundreds of millions of dollars.

## Testing at Float Capital

Before going through the list of risks, it’s worthwhile talking about what we do to minimize risk within Float. The core of this is how we test our protocol code.

We have developed a unique unit testing framework based in ReasonML that meshes testing flexibility and rapid code iteration. This builds on the great work done by [Smock](https://smock.readthedocs.io/en/latest/fakes.html) for the optimism framework. We are working with the Smock team to release this testing framework as a stand alone library, allowing other teams to improve their smart contract testing.

If you want to learn more about this, you can see a technical walk through of some of the basics [here](https://youtu.be/E08d87QHrOo).

<img src="/blog-assets/apeing/unit-testing.png" alt="apeing in responsibly" width="100%"/>

Besides really solid testing, we also follow the industry standard peer review code practices, and often meditate on random attack vectors while hiking, dreaming, surfing, cooking or at large family gatherings.

Now, let’s discuss the various risk factors you may encounter while interacting with Float.

## Smart contract risk

Float is serious about smart contract security. In addition to rigorous internal testing, we’ve also deployed three iterative system versions on the Mumbai Testnet over the past five months, which have been used regularly by more than 100 users.

We have also invested good old cash money to get external security experts to review our code. In August we conducted a $50,000 smart contract audit competition with Code 432n4, the results of which we’ll publish soon. Other protocols using [Code432n4](https://code423n4.com/) include [Sushiswap](https://sushi.com/), [PoolTogether](https://pooltogether.com/), [BadgerDAO](https://badger.finance/), [Convex Finance](https://www.convexfinance.com/), and more.

You can read Code 432n4’s piece on the audit [here](https://medium.com/code-423n4/the-ones-in-the-arena-float-capital-41ac3c372e97), and browse the contest repo [here](https://github.com/code-423n4/2021-08-floatcapital).

Even in light of the numerous and significant steps we have taken to ensure the smart contracts function safely and as designed, there still remains risk that our code may be exploited by a malicious actor using a novel vector, or just simply break.

## Polygon risk

The Float Capital Alpha will be deployed exclusively on the Polygon network, with more networks to be supported in future. Polygon has various risks that many DeFi thought leaders have been vocal about. Please consider these.

## Composability risk

The Float Alpha deposits all underlying user funds into [Aave](https://aave.com/), a borrowing and lending protocol. While Aave has received many audits and been live in production without incident for a fair amount of time, if Aave were to be exploited, this may have implications for Float. Research Aave, understand the risks of using Aave, and note that the inherent risks of using Aave interact with the risks of using Float.

## Centralization risk

The Float smart contracts are upgradeable. Having upgradeable smart contracts means that the code can change. If we were malicious, rug pulling devs, we could upgrade the contracts and drain funds. Thankfully, our team is publicly known and committed to the growth of DeFi over the long term. Our reputation is worth far more than a rug.

Generally timelocks and multisigs are the two main methods to safeguard against this while maintaining upgradeability, while allowing for swift iteration. While we will utilize these in our main launch, in our Alpha with lower stakes we are not using timelocks or multisigs. This will change as the protocol scales.

## Oracle risk

Historically, oracles have been a significant vector of attacks. Please read [this piece](https://samczsun.com/so-you-want-to-use-a-price-oracle/) if you want to learn more about the risks of using oracles. Our smart contracts heavily rely on oracles, and hence the risks associated with this tech apply to Float as well. To mitigate this risk, Float Capital uses Chainlink as an oracle service provider for our smart contracts. Chainlink is widely recognised as having safe and secure tech, but if exploits are found with their contracts, Float could be exposed as well.

## Stablecoin risk

The Float Alpha will accept DAI as the token to mint assets. DAI is an algorithmic stablecoin that has proven itself a resilient token in the past, surviving the crypto winter of 2018, but please understand the risks associated with this technology.

## Financial risk

Float allows you to purchase magic internet assets which will track the value of an underlying asset and therefore increase or decrease in value over time. You may purchase magic internet assets that significantly decrease in value over time. This is especially true in the crypto space where we see many volatile markets.

Additionally, some magic internet assets may have leverage. This will be clearly stated alongside each asset. This essentially magnifies your gains or losses, and hence magnifies your risk. Make sure you understand what leverage is and how it can get you rekt.

## Liquidation risk

None. Unlike older onchain asset platforms, Float Capital has no risk of liquidation for users.

## Ape risk

The risk of enjoying the Float platform so much that you over commit capital to the protocol. We know the UX is slick and effortless. We know that the [Discord](https://discord.gg/float-capital) is comfy, and the community awesome. Please AIR.

## Acknowledgements

Special shout out to all the eyes on the code (tech team, C4 wardens, friends and community builders) and legends involved with ensuring Float Capital is as safe as possible.

This article was inspired by [this piece](https://help.tokensets.com/en/articles/4091604-risks-of-using-tokensets) by [Anthony Sassano](https://twitter.com/sassal0x), and [this piece](https://blog.pods.finance/risks-of-using-pods-9ea880e192e8) by [Rafaella Barado](https://twitter.com/sassal0x).

Written by [JonJon Clark](https://twitter.com/jonjonclark), with additional contributions from [Campbell Easton](https://twitter.com/CampbellEaston), [Jordyn Laurier](https://twitter.com/j_o_r_d_y_s), [Michael Young](https://twitter.com/mjyoungsta), [Paul Freund](https://twitter.com/PaulFreund18) and [Denham Preen](https://twitter.com/DenhamPreen).

## About Float Capital

Float Capital builds peer-to-peer, yield enhanced magic internet asset markets, allowing users to mint assets in a matter of clicks, without the need for over collateralisation or the risk of liquidation.

If you’re reading this before September 17, 2021, you can test out the platform mechanics with test DAI on the Mumbai Testnet. If you’re reading this after that date, you can mint magic internet assets in our Alpha protocol [here](https://float.capital/app/markets).