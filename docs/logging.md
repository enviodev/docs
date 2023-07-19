---
id: logging
title: Logging
sidebar_label: Logging
slug: /logging
---

# Logging

Logging is an important part of the indexer. It is used to track the progress of the indexer and to debug any issues that may arise. The indexer uses the [pino](https://github.com/pinojs/pino/). Additionally these logs can be plugged into a tool such as kibana to generate metrics and other insights.

- [Users - logging for your event handlers](#users)
- [Metrics, Debugging, and Troubleshooting - how to use logs as a power tool](#metrics-debugging-and-troubleshooting)
- [Developer Logging - how to utilize logs within the envio codebase](#developer-logging)

## Users

Users should use the functions provided in their context for logging. These are as follows:

- `<context>.log.debug`
- `<context>.log.info`
- `<context>.log.warn`
- `<context>.log.error`

Note: for rescript and typescript, these functions always are typed to take in strings, so if you want to log complex objects please use the below functions where you can use :

<!-- TODO: turn this into a mdx file and give different views for rescript, javascript and typescript -->

```rescript
  // inside your handler
  context.log->Logs.debug({
    "msg": "We are processing the event",
    "type": "debug"
  })
  context.log->Logs.info({
    "msg": "We are processing the event",
    "type": "info",
  })
  context.log->Logs.warn({
    "msg": "We are processing the event",
    "type": "warn",
  })
  context.log->Logs.error({
    "msg": "We are processing the event",
    "type": "error",
  })
```

<!-- TODO: if we move away from gentype we will be able to make the log argument be an `any` type in typescript - this section will be irrelevant then -->

We have an open issue in our repo to make this unnecessary for the typescript bindings, but complex logging is done like this:

```typescript
import Logs from "generated/src/Logs.bs.js";

// inside your handler
Logs.debug(context.log, complexObjectYouWantToLog);
Logs.info(context.log, complexObjectYouWantToLog);
Logs.warn(context.log, complexObjectYouWantToLog);
Logs.error(context.log, complexObjectYouWantToLog);
```

## Metrics, Debugging, and Troubleshooting

There are many ways to gather insights into our logs. We use the [pino](https://github.com/pinojs/pino/) logging library for javascript which is highly optimized for performance. It also outputs clear and easy to read logs for users via [pino-pretty](https://github.com/pinojs/pino-pretty).

It is able to output logs in a json/machine readable format for tracing, debugging, or generating metrics via tools such as kibana.

The default autput format is pino-pretty. But please feel free to use the following environment veriables to modify output formats:

```bash
LOG_STRATEGY="console-pretty" # this is the default format - it logs to the terminal directly with colours for log levels in a human readable format.
LOG_STRATEGY="ecs-file" # this logs to a file specidied at `LOG_FILE` with the ECS log format which is the standard output format for the EKS stack
LOG_STRATEGY="ecs-console" # this logs to the console in the raw ECS format
LOG_STRATEGY="file-only" # this logs to file in default pino format. This is a more efficient logger performance wise.
LOG_STRATEGY="console-raw" # This logs directly to console in pino format.
LOG_STRATEGY="both-prettyconsole" # This pretty prints to console, and logs to file at `LOG_FILE` with default pino format
LOG_FILE="<path-to-log-file>"
```

**View the logs in hosting dashboard** - this feature is a WIP - follow us on [twitter](https://twitter.com/envio_indexer) for product updates.

If there are specific dashboards you'd like to have to improve your experience in development or production please [let us know](https://discord.gg/DhfFhzuJQh). We are working on some Kibana dashboards for self hosting and UI dasboards into our hosting solution too.

## Developer Logging

The indexer supports the following log levels (in ascending order):

```
- trace
- debug
- info
- udebug
- uinfo
- uwarn
- uerror
- warn
- error
- fatal
```

The log levels prefixed with `u` are user level logs. These are logs emitted from the context for a handler or a loader.

You can set the log levels with the following environment variables:

```
LOG_LEVEL - the log level used for logs going to the console (default: "info")
FILE_LOG_LEVEL - the log level used for logs going to file (default: "trace")
BASE_LOG_LEVEL - this is an override log level. If it is lower than `LOG_LEVEL` or `FILE_LOG_LEVEL` it does nothing. However if it is higher than either or both it will override that level. (default: "trace" , ie it does nothing by default)
```

---
