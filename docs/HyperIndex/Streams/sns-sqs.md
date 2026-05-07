---
id: streams-sns-sqs
title: AWS SNS / SQS
sidebar_label: AWS SNS / SQS
slug: /streams/sns-sqs
description: Stream decoded events from HyperIndex to AWS SNS topics or SQS queues using the Effect API.
---

Publish to an SNS topic (pub/sub fan-out) or directly to an SQS queue. Both use the official AWS SDK.

### Installation

```bash
# SNS
pnpm add @aws-sdk/client-sns
# SQS
pnpm add @aws-sdk/client-sqs
```

### Configure the client

```typescript title="src/clients/aws.ts"
import { SNSClient } from "@aws-sdk/client-sns";
import { SQSClient } from "@aws-sdk/client-sqs";

const region = process.env.AWS_REGION ?? "us-east-1";
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  ...(process.env.AWS_SESSION_TOKEN
    ? { sessionToken: process.env.AWS_SESSION_TOKEN }
    : {}),
};

export const sns = new SNSClient({ region, credentials });
export const sqs = new SQSClient({ region, credentials });
```

### Define the effects

Topic ARN / queue URL are static — bake them in. `input` carries only event data.

```typescript title="src/effects/sns.ts"
import { PublishCommand } from "@aws-sdk/client-sns";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { createEffect, S } from "envio";
import { sns, sqs } from "../clients/aws";

const TOPIC_ARN = process.env.SNS_TOPIC_ARN!;

export const publishTransferSns = createEffect(
  {
    name: "publishTransferSns",
    input: {
      from: S.string,
      to: S.string,
      value: S.bigint,
      txHash: S.string,
    },
    rateLimit: { calls: 100, per: "second" },
    mode: "unorderedAfterCommit",
  },
  async ({ input }) => {
    await sns.send(
      new PublishCommand({
        TopicArn: TOPIC_ARN,
        Message: JSON.stringify({ ...input, value: input.value.toString() }),
      })
    );
  }
);

const QUEUE_URL = process.env.SQS_QUEUE_URL!;

export const publishTransferSqs = createEffect(
  {
    name: "publishTransferSqs",
    input: {
      from: S.string,
      to: S.string,
      value: S.bigint,
      txHash: S.string,
      groupId: S.optional(S.string), // for FIFO queues
    },
    rateLimit: { calls: 100, per: "second" },
    mode: "unorderedAfterCommit",
  },
  async ({ input }) => {
    const { groupId, value, ...rest } = input;
    await sqs.send(
      new SendMessageCommand({
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify({ ...rest, value: value.toString() }),
        MessageGroupId: groupId,
      })
    );
  }
);
```

### Call it from a handler

The rindexer config…

```yaml
streams:
  sns:
    topics:
      - topic_arn: "arn:aws:sns:us-east-1:664643779377:test"
        events:
          - event_name: Transfer
            conditions:
              - "value": ">=2000000000000000000 && value <=4000000000000000000"
              - "from": "0x0338ce5020c447f7e668dc2ef778025ce3982662"
```

…becomes:

```typescript title="src/handlers/RocketPoolETH.ts"
import { indexer } from "envio";
import { publishTransferSns } from "../effects/sns";

const WHALE = "0x0338ce5020c447f7e668dc2ef778025ce3982662";
const MIN = 2_000_000_000_000_000_000n;
const MAX = 4_000_000_000_000_000_000n;

indexer.onEvent(
  { contract: "RocketPoolETH", event: "Transfer" },
  async ({ event, context }) => {
    const { from, to, value } = event.params;

    if (from.toLowerCase() === WHALE && value >= MIN && value <= MAX) {
      context.effect(publishTransferSns, {
        from,
        to,
        value,
        txHash: event.transaction.hash,
      });
    }
  },
);
```

For SQS FIFO queues, switch the effect to `orderedAfterCommit` and set a `groupId` (e.g. the contract address) — the runtime preserves handler order, and SQS preserves order per `MessageGroupId`. If your consumer is idempotent and you want the message out before the DB commit, use `mode: "unordered"` or `"ordered"` for lower latency.
