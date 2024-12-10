---
id: benchmarking
title: Benchmarking
sidebar_label: Benchmarking
slug: /benchmarking
---

# Benchmarking

### Capturing the benchmark

You can run `pnpm envio start --bench` to capture some benchmarking data while your indexer is running. This should not be run in production, since it holds each benchmark data point in memory and adds some overhead in writing to a file.

### Printing the benchmark

Once you have run the indexer for any amount of time you can run `envio benchmark-summary` to print out the result of the benchmark.

```
Time breakdown
┌─────────────────────────────────────────┬─────────┐
│ (index)                                 │ seconds │
├─────────────────────────────────────────┼─────────┤
│ Total Runtime                           │ 45      │
│ Total Time Fetching Chain 1 Partition 0 │ 44      │
│ Total Time Processing                   │ 9       │
└─────────────────────────────────────────┴─────────┘
General
┌─────────────────────┬─────────┐
│ (index)             │ Values  │
├─────────────────────┼─────────┤
│ batch sizes sum     │ 158205  │
│ total runtime (sec) │ 45.801  │
│ events per second   │ 3454.18 │
└─────────────────────┴─────────┘
BlockRangeFetched Summary for Chain 1 Root Register
┌───────────────────────────┬────┬───────────┬────────────┬──────┬──────────┬──────────┐
│ (index)                   │ n  │ mean      │ std-dev    │ min  │ max      │ sum      │
├───────────────────────────┼────┼───────────┼────────────┼──────┼──────────┼──────────┤
│ Total Time Elapsed (ms)   │ 12 │ 3675.17   │ 1147.69    │ 2329 │ 5972     │ 44102    │
│ Parsing Time Elapsed (ms) │ 12 │ 142.17    │ 40.15      │ 80   │ 235      │ 1706     │
│ Page Fetch Time (ms)      │ 12 │ 3481.58   │ 1042.93    │ 2249 │ 5737     │ 41779    │
│ Num Events                │ 12 │ 13183.75  │ 3858.92    │ 7579 │ 22426    │ 158205   │
│ Block Range Size          │ 12 │ 906593.17 │ 3006127.15 │ 149  │ 10876789 │ 10879118 │
└───────────────────────────┴────┴───────────┴────────────┴──────┴──────────┴──────────┘
EventProcessing Summary
┌─────────────────────────────────┬────┬─────────┬─────────┬─────┬──────┬────────┐
│ (index)                         │ n  │ mean    │ std-dev │ min │ max  │ sum    │
├─────────────────────────────────┼────┼─────────┼─────────┼─────┼──────┼────────┤
│ Batch Size                      │ 38 │ 4163.29 │ 1424.85 │ 89  │ 5000 │ 158205 │
│ Contract Register Duration (ms) │ 38 │ 0.11    │ 0.38    │ 0   │ 2    │ 4      │
│ Load Duration (ms)              │ 38 │ 80.79   │ 32.58   │ 5   │ 149  │ 3070   │
│ Handler Duration (ms)           │ 38 │ 22.18   │ 9.07    │ 0   │ 47   │ 843    │
│ DB Write Duration (ms)          │ 38 │ 135.92  │ 52.09   │ 8   │ 220  │ 5165   │
│ Total Time Elapsed (ms)         │ 38 │ 239     │ 83.24   │ 13  │ 370  │ 9082   │
└─────────────────────────────────┴────┴─────────┴─────────┴─────┴──────┴────────┘
Handlers Per Event
┌─────────────────────────────┬────────┬────────┬─────────┬────────┬────────┬──────────┐
│ (index)                     │ n      │ mean   │ std-dev │ min    │ max    │ sum      │
├─────────────────────────────┼────────┼────────┼─────────┼────────┼────────┼──────────┤
│ ERC20 Transfer Handler (ms) │ 158205 │ 0.0021 │ 0.0364  │ 0.0007 │ 4.6752 │ 329.7264 │
└─────────────────────────────┴────────┴────────┴─────────┴────────┴────────┴──────────┘
Other
┌──────────────────────────┬────┬─────────┬─────────┬─────┬──────┬────────┐
│ (index)                  │ n  │ mean    │ std-dev │ min │ max  │ sum    │
├──────────────────────────┼────┼─────────┼─────────┼─────┼──────┼────────┤
│ Num partitions           │ 1  │ 1       │ 0       │ 1   │ 1    │ 1      │
│ Batch Creation Time (ms) │ 38 │ 0.66    │ 1.38    │ 0   │ 6    │ 25     │
│ Batch Size               │ 38 │ 4163.29 │ 1424.85 │ 89  │ 5000 │ 158205 │
└──────────────────────────┴────┴─────────┴─────────┴─────┴──────┴────────┘
```

### Interpreting the results

Most of these values are for internal improvements, but it can help determine where the most time is being spent during indexing. For instance in the example above most of the total runtime was being spent fetching the events from chain 1 and so any additional optimizations to handlers would not result in a performance improvement.

If the processing time is taking up most of the runtime, then it is likely that the handlers are not performing well. You can look at the `EventProcessing Summary` to see how long each handler/loader takes to run. If a handler is taking a lot of time it may be due to slow async operations. Or a large amount of data being loaded in from the database (In this case it is recommended to refactor your handlers to use [loaders](loaders)).
