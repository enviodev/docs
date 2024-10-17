---
id: benchmarking
title: Benchmarking
sidebar_label: Benchmarking
slug: /benchmarking
---

# Benchmarking

### Capturing the benchmark

You can run `envio start --bench` to capture some benchmarking data while your indexer is running. This should not be run in production, since it holds each benchmark data point in memory and adds some overhead in writing to a file.

### Printing the benchmark

Once you have run the indexer for any amount of time you can run `envio benchmark-summar` to print out the result of the benchmark.

```
Time breakdown
┌─────────────────────────────────────────┬─────────┐
│ (index)                                 │ seconds │
├─────────────────────────────────────────┼─────────┤
│ Total Runtime                           │ 14      │
│ Total Time Fetching Chain 1 Partition 0 │ 13      │
│ Total Time Processing                   │ 2       │
└─────────────────────────────────────────┴─────────┘
General
┌─────────────────────┬─────────┐
│ (index)             │ Values  │
├─────────────────────┼─────────┤
│ batch sizes sum     │ 50030   │
│ total runtime (sec) │ 14.986  │
│ events per second   │ 3338.45 │
└─────────────────────┴─────────┘
BlockRangeFetched Summary for Chain 1 Root Register
┌───────────────────────────┬───┬─────────┬─────────┬──────┬───────┬───────┬───────┐
│ (index)                   │ n │ mean    │ std-dev │ min  │ max   │ last  │ total │
├───────────────────────────┼───┼─────────┼─────────┼──────┼───────┼───────┼───────┤
│ Total Time Elapsed (ms)   │ 4 │ 3332.25 │ 731.84  │ 2304 │ 4305  │ 3622  │ 13329 │
│ Parsing Time Elapsed (ms) │ 4 │ 134     │ 26.42   │ 98   │ 164   │ 164   │ 536   │
│ Page Fetch Time (ms)      │ 4 │ 3198    │ 708.23  │ 2206 │ 4150  │ 3458  │ 12792 │
│ Num Events                │ 4 │ 12507.5 │ 2571    │ 8770 │ 15147 │ 15147 │ 50030 │
│ Block Range Size          │ 4 │ 1830.5  │ 2862.94 │ 149  │ 6789  │ 225   │ 7322  │
└───────────────────────────┴───┴─────────┴─────────┴──────┴───────┴───────┴───────┘
EventProcessing Summary
┌─────────────────────────────────┬────┬─────────┬─────────┬─────┬──────┬──────┬───────┐
│ (index)                         │ n  │ mean    │ std-dev │ min │ max  │ last │ total │
├─────────────────────────────────┼────┼─────────┼─────────┼─────┼──────┼──────┼───────┤
│ Batch Size                      │ 12 │ 4169.17 │ 1560.9  │ 147 │ 5000 │ 147  │ 50030 │
│ Contract Register Duration (ms) │ 12 │ 0.08    │ 0.28    │ 0   │ 1    │ 0    │ 1     │
│ Load Duration (ms)              │ 12 │ 61.33   │ 26.65   │ 7   │ 111  │ 7    │ 736   │
│ Handler Duration (ms)           │ 12 │ 17.58   │ 8.16    │ 0   │ 33   │ 0    │ 211   │
│ DB Write Duration (ms)          │ 12 │ 98.33   │ 35.79   │ 11  │ 132  │ 11   │ 1180  │
│ Total Time Elapsed (ms)         │ 12 │ 177.33  │ 66      │ 18  │ 253  │ 18   │ 2128  │
└─────────────────────────────────┴────┴─────────┴─────────┴─────┴──────┴──────┴───────┘
Other
┌──────────────────────────┬────┬─────────┬─────────┬─────┬──────┬──────┬───────┐
│ (index)                  │ n  │ mean    │ std-dev │ min │ max  │ last │ total │
├──────────────────────────┼────┼─────────┼─────────┼─────┼──────┼──────┼───────┤
│ Num partitions           │ 1  │ 1       │ 0       │ 1   │ 1    │ 1    │ 1     │
│ Batch Creation Time (ms) │ 12 │ 2.33    │ 4.13    │ 0   │ 12   │ 0    │ 28    │
│ Batch Size               │ 12 │ 4169.17 │ 1560.9  │ 147 │ 5000 │ 147  │ 50030 │
└──────────────────────────┴────┴─────────┴─────────┴─────┴──────┴──────┴───────┘
```

### Interpreting the results

Most of these values are for internal improvements, but it can help determine where the most time is being spent during indexing. For instance in the example above most of the total runtime was being spent fetching the events from chain 1 and so any additional optimizations to handlers would not result in a performance improvement.

If the processing time is taking up most of the runtime, then it is likely that the handlers are not performing well. You can look at the `EventProcessing Summary` to see how long each handler/loader takes to run. If a handler is taking a lot of time it may be due to slow async operations. Or a large amount of data being loaded in from the database (In this case it is recommended to refactor your handlers to use [loaders](loaders)).
