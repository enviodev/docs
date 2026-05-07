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

```typescript title="src/effects/sns.ts"
import { PublishCommand } from "@aws-sdk/client-sns";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { createEffect, S } from "envio";
import { sns, sqs } from "../clients/aws";

export const publishToSns = createEffect(
  {
    name: "publishToSns",
    input: { topicArn: S.string, message: S.string },
    rateLimit: { calls: 100, per: "second" },
    mode: "unorderedAfterCommit",
  },
  async ({ input }) => {
    await sns.send(
      new PublishCommand({ TopicArn: input.topicArn, Message: input.message })
    );
  }
);

export const sendToSqs = createEffect(
  {
    name: "sendToSqs",
    input: {
      queueUrl: S.string,
      body: S.string,
      groupId: S.optional(S.string), // for FIFO queues
    },
    rateLimit: { calls: 100, per: "second" },
    mode: "unorderedAfterCommit",
  },
  async ({ input }) => {
    await sqs.send(
      new SendMessageCommand({
        QueueUrl: input.queueUrl,
        MessageBody: input.body,
        MessageGroupId: input.groupId,
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

```typescript title="src/EventHandlers.ts"
import { RocketPoolETH } from "generated";
import { publishToSns } from "./effects/sns";

const TOPIC = "arn:aws:sns:us-east-1:664643779377:test";
const WHALE = "0x0338ce5020c447f7e668dc2ef778025ce3982662";
const MIN = 2_000_000_000_000_000_000n;
const MAX = 4_000_000_000_000_000_000n;

RocketPoolETH.Transfer.handler(async ({ event, context }) => {
  const { from, to, value } = event.params;

  if (from.toLowerCase() === WHALE && value >= MIN && value <= MAX) {
    context.effect(publishToSns, {
      topicArn: TOPIC,
      message: JSON.stringify({
        from,
        to,
        value: value.toString(),
        txHash: event.transaction.hash,
      }),
    });
  }
});
```

For SQS FIFO queues, switch the effect to `orderedAfterCommit` and set a `groupId` (e.g. the contract address) — the runtime preserves handler order, and SQS preserves order per `MessageGroupId`.
