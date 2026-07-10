---
title: How to Build an Open Source RWA Stablecoin Dashboard
sidebar_label: How to Build an Open Source RWA Stablecoin Dashboard
slug: /how-to-build-rwa-dashboard
tags: ["tutorials"]
description: "How to build an open-source RWA stablecoin dashboard backed by a HyperIndex indexer you can run yourself, deriving total supply, transfers, mints, burns, and daily snapshots straight from Transfer events, with USDT's Issue and Redeem handled directly."
image: /blog-assets/rwa-dashboard.png
last_update:
  date: 2026-07-10
  author: Nikhil Bhintade
authors: ["nikbhintade"]
---

<img src="/blog-assets/rwa-dashboard.png" alt="How to Build an Open Source RWA Stablecoin Dashboard" width="100%"/>

<!--truncate-->

:::note TL;DR

- The RWA dashboard is open source and backed by an indexer you can run yourself, starting with stablecoins, with the live dashboard at rwaradar.io.
- On the stablecoin side it surfaces total supply, transfer count, transfer amount and volume, mint and burn amounts, and daily snapshots of each.
- Every metric falls out of Transfer events, since mints and burns show up as transfers to and from the zero address.
- USDT is the exception, so the indexer reads its Issue and Redeem events directly for clean mint and burn numbers.
- The transfer and mint/burn logic lives in shared handlers, so every token reuses the same paths.

:::

Real-world assets have gone from a niche thing a few companies were poking at to one of the biggest sectors in crypto over the last few years.
This post isn't a market take, though. At Envio, my job is to build technical demos that actually use our products, so I decided to build something real, an open-source RWA dashboard backed by a HyperIndex metrics indexer you can run yourself. If you want to check whether the data lines up, or you want to build something similar, the whole thing is there to fork.

## Why stablecoins first

RWA is a huge bucket, so I had to pick a starting point. Stablecoins were the obvious one.

The goal for the stablecoin side of the dashboard is to surface the metrics that actually tell you something. Total supply, transfer count, transfer amount and volume, mint and burn amounts, and daily snapshots of all of it. Nothing exotic, just the numbers you'd want if you were tracking how a stablecoin is actually being used onchain.

Now that we've covered what the dashboard is supposed to do, let's get into the indexer and the logic behind it. That's the part that matters.

## The indexer

### Wiring up the handlers

I'm tracking a set of major stablecoins across a dozen chains to start. The full list lives in the [config.yaml](https://github.com/enviodev/rwa/blob/main/indexers/rwa-tokens/config.yaml) if you want to see exactly which ones.

For most of them, tracking `Transfer` events is enough. Every metric we care about falls out of transfers, including mints and burns, since those show up as transfers from or to the zero address. USDT is the exception. Its issue and redeem don't emit Transfers, so the indexer tracks its Issue and Redeem events directly. Bridged USDT on other chains does emit zero-address Transfers, so the Transfer handler covers it.

```ts
indexer.onEvent(
  { contract: "Stablecoins", event: "Transfer" },
  async ({ event, context }) => {
    await handleTransfer(event, context);
  },
);

indexer.onEvent(
  { contract: "USDT", event: "Transfer" },
  async ({ event, context }) => {
    await handleTransfer(event, context);
  },
);

indexer.onEvent(
  { contract: "USDT", event: "Issue" },
  async ({ event, context }) => {
    await handleSupplyChange(event, context, "mint");
  },
);

indexer.onEvent(
  { contract: "USDT", event: "Redeem" },
  async ({ event, context }) => {
    await handleSupplyChange(event, context, "burn");
  },
);
```

The point of pulling the logic out into `handleTransfer` and `handleSupplyChange` is reuse. Every token shares the same transfer logic, and the mint/burn path is shared too. The handlers themselves stay thin and just call into the abstracted functions.

### `handleTransfer`

This is the workhorse. It updates everything tied to a transfer.

First it does the fetching and parsing. It pulls the event params to derive the IDs, and grab the current state of the entities it's about to touch.

```ts
async function handleTransfer(
  event: {
    chainId: number;
    srcAddress: string;
    block: { timestamp: number };
    params: { from: string; to: string; value: bigint };
  },
  context: EvmOnEventContext,
) {
  const { from, to, value } = event.params;
  const chainId = event.chainId;
  const tokenAddress = event.srcAddress;
  const timestamp = event.block.timestamp;
  const currentDayId = Math.floor(timestamp / 86400);
  const midnightTimestamp = currentDayId * 86400;

  const isMint = from === ZERO_ADDRESS;
  const isBurn = to === ZERO_ADDRESS;

  const tokenId = `${chainId}_${tokenAddress}`;
  const dayDataId = `${tokenId}_${currentDayId}`;
  const fromBalanceId = `${tokenId}_${from}`;
  const toBalanceId = `${tokenId}_${to}`;
  const activeAddrId = `${tokenId}_${currentDayId}_${from}`;

  const [
    existingToken,
    existingDayData,
    fromBalance,
    toBalance,
    existingActiveAddr,
  ] = await Promise.all([
    context.Token.get(tokenId),
    context.TokenDayData.get(dayDataId),
    !isMint
      ? context.HolderBalance.get(fromBalanceId)
      : Promise.resolve(undefined),
    !isBurn
      ? context.HolderBalance.get(toBalanceId)
      : Promise.resolve(undefined),
    !isMint
      ? context.DailyActiveAddress.get(activeAddrId)
      : Promise.resolve(undefined),
  ]);

  // continue the snapshot logic
}
```

The snapshot logic is where the only real trick is. Blocks give us a UTC timestamp, so to know whether a transfer belongs to a new day we just check whether its timestamp crossed midnight relative to the last day I recorded. If it's a new day, I start tracking a fresh `TokenDayData` entity. Everything else is the same shape as before: if it's a mint, bump supply up; if it's a burn, bump it down.

```ts
const lastDayId = existingToken?.lastDayId ?? currentDayId;
const isNewDay = currentDayId > lastDayId;

if (isNewDay) {
  const stale = await context.DailyActiveAddress.getWhere({
    token_id: { _eq: tokenId },
  });
  for (const entry of stale) {
    context.DailyActiveAddress.deleteUnsafe(entry.id);
  }
}

const isNewActiveAddr = !isMint && (isNewDay || !existingActiveAddr);

let newTotalSupply = existingToken?.totalSupply ?? 0n;
if (isMint) newTotalSupply += value;
if (isBurn) newTotalSupply -= value;

context.Token.set({
  id: tokenId,
  chainId,
  address: tokenAddress,
  totalSupply: newTotalSupply,
  lastDayId: currentDayId,
});

context.TokenDayData.set({
  id: dayDataId,
  token_id: tokenId,
  chainId,
  date: midnightTimestamp,
  dailyTotalSupply: newTotalSupply,
  dailyMintAmount:
    (existingDayData?.dailyMintAmount ?? 0n) + (isMint ? value : 0n),
  dailyBurnAmount:
    (existingDayData?.dailyBurnAmount ?? 0n) + (isBurn ? value : 0n),
  dailyTransferAmount: (existingDayData?.dailyTransferAmount ?? 0n) + value,
  dailyTransferCount: (existingDayData?.dailyTransferCount ?? 0) + 1,
  dailyActiveAddresses:
    (existingDayData?.dailyActiveAddresses ?? 0) + (isNewActiveAddr ? 1 : 0),
});

if (!isMint) {
  context.HolderBalance.set({
    id: fromBalanceId,
    token_id: tokenId,
    chainId,
    holder: from,
    balance: (fromBalance?.balance ?? 0n) - value,
    firstTransferTimestamp:
      fromBalance?.firstTransferTimestamp ?? BigInt(timestamp),
    lastTransferTimestamp: BigInt(timestamp),
  });
}

if (!isBurn) {
  context.HolderBalance.set({
    id: toBalanceId,
    token_id: tokenId,
    chainId,
    holder: to,
    balance: (toBalance?.balance ?? 0n) + value,
    firstTransferTimestamp:
      toBalance?.firstTransferTimestamp ?? BigInt(timestamp),
    lastTransferTimestamp: BigInt(timestamp),
  });
}

if (isNewActiveAddr) {
  context.DailyActiveAddress.set({
    id: activeAddrId,
    token_id: tokenId,
    chainId,
    date: currentDayId,
    address: from,
  });
}
```

One thing worth calling out: on a new day I clear out the stale `DailyActiveAddress` entries for the token. Active addresses are a per-day count, so they don't carry over. Skipping mint senders from the active-address count is deliberate too, since the zero address isn't a real participant.

### `handleSupplyChange`

This one only exists for USDT's `Issue` and `Redeem`. The logic is mostly a slimmer version of handleTransfer, with one extra input, direction. The events themselves just hand you an amount, so the handler is the thing that decides whether it's a mint or a burn and passes that down.

```ts
async function handleSupplyChange(
  event: {
    chainId: number;
    srcAddress: string;
    block: { timestamp: number };
    params: { amount: bigint };
  },
  context: EvmOnEventContext,
  direction: "mint" | "burn",
) {
  const { amount } = event.params;
  const chainId = event.chainId;
  const tokenAddress = event.srcAddress;
  const timestamp = event.block.timestamp;
  const currentDayId = Math.floor(timestamp / 86400);
  const midnightTimestamp = currentDayId * 86400;

  const tokenId = `${chainId}_${tokenAddress}`;
  const dayDataId = `${tokenId}_${currentDayId}`;

  const [existingToken, existingDayData] = await Promise.all([
    context.Token.get(tokenId),
    context.TokenDayData.get(dayDataId),
  ]);

  const lastDayId = existingToken?.lastDayId ?? currentDayId;
  const isNewDay = currentDayId > lastDayId;

  if (isNewDay) {
    const stale = await context.DailyActiveAddress.getWhere({
      token_id: { _eq: tokenId },
    });
    for (const entry of stale) {
      context.DailyActiveAddress.deleteUnsafe(entry.id);
    }
  }

  let newTotalSupply = existingToken?.totalSupply ?? 0n;
  if (direction === "mint") newTotalSupply += amount;
  else newTotalSupply -= amount;

  context.Token.set({
    id: tokenId,
    chainId,
    address: tokenAddress,
    totalSupply: newTotalSupply,
    lastDayId: currentDayId,
  });

  context.TokenDayData.set({
    id: dayDataId,
    token_id: tokenId,
    chainId,
    date: midnightTimestamp,
    dailyTotalSupply: newTotalSupply,
    dailyMintAmount:
      (existingDayData?.dailyMintAmount ?? 0n) +
      (direction === "mint" ? amount : 0n),
    dailyBurnAmount:
      (existingDayData?.dailyBurnAmount ?? 0n) +
      (direction === "burn" ? amount : 0n),
    dailyTransferAmount: existingDayData?.dailyTransferAmount ?? 0n,
    dailyTransferCount: existingDayData?.dailyTransferCount ?? 0,
    dailyActiveAddresses: existingDayData?.dailyActiveAddresses ?? 0,
  });
}
```

Notice it leaves the transfer fields untouched and only moves supply, mint, and burn. Issue and Redeem aren't transfers, so they shouldn't inflate transfer counts.

## What's next

That's the first step of the RWA dashboard, one indexer, with the logic and setup laid out. Tokenised US Treasuries, with NAV and yield tracking, are already in the same indexer, and I'll walk through those next.

If you want to dig into the code, the [stablecoins indexer is here](https://github.com/enviodev/rwa/tree/main/indexers/rwa-tokens), and the live dashboard is at [rwaradar.io](https://rwaradar.io/). If you're building in the RWA space and want to compare notes, reach out.

## Frequently Asked Questions

### How does the indexer track stablecoin mints and burns?

For most of the stablecoins, tracking Transfer events is enough. Mints and burns fall out of transfers, since they show up as transfers from or to the zero address, so total supply moves up on a mint and down on a burn without needing dedicated events.

### Why is USDT handled differently from the other stablecoins?

USDT is the exception. To get clean mint and burn numbers for it, the indexer tracks its Issue and Redeem events directly through handleSupplyChange, which reads the amount and decides whether it's a mint or a burn. It leaves the transfer fields untouched and only moves supply, mint, and burn, since Issue and Redeem aren't transfers and shouldn't inflate transfer counts.

### How does the indexer decide when a new day begins for the snapshots?

Blocks give a UTC timestamp, so the handler checks whether a transfer's timestamp crossed midnight relative to the last day it recorded, deriving the current day as Math.floor(timestamp / 86400). When it's a new day, it starts tracking a fresh TokenDayData entity.

### Why are mint senders skipped in the daily active address count?

Active addresses are a per-day count, so they don't carry over, and on a new day the stale entries for the token are cleared. Mint senders are skipped deliberately, since a mint comes from the zero address, which isn't a real participant and would otherwise misrepresent daily activity.

### Why are handleTransfer and handleSupplyChange pulled into shared functions?

The point is reuse. Every token shares the same transfer logic, and the mint and burn path is shared too, so the event handlers stay thin and just call into the abstracted functions.

### What metrics does the stablecoin dashboard surface?

It surfaces total supply, transfer count, transfer amount and volume, mint and burn amounts, and daily snapshots of all of it, which are the numbers that show how a stablecoin is actually being used onchain.

## Build With Envio

Envio is a real-time multichain blockchain indexer that turns onchain events into a queryable GraphQL API. Supports any EVM chain, plus Solana and Fuel. Use Envio Cloud or self-host. If you're building onchain, come talk to us about your data needs.

[Subscribe to our newsletter](https://envio.beehiiv.com/subscribe?utm_source=envio.beehiiv.com&utm_medium=newsletter&utm_campaign=new-post)

[Website](https://envio.dev/) | [X](https://twitter.com/envio_indexer) | [Discord](https://discord.gg/envio) | [Telegram](https://t.me/+5mI61oZibEM5OGQ8) | [GitHub](https://github.com/enviodev) | [YouTube](https://www.youtube.com/channel/UCR7nZ2yzEtc5SZNM0dhrkhA) | [Reddit](https://www.reddit.com/user/Envio_indexer)
