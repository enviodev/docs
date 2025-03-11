---
id: benchmarking
title: Benchmarking Your Indexer
sidebar_label: Benchmarking (Performance)
slug: /benchmarking
---

# Benchmarking Your Indexer Performance

## Why Benchmark Your Indexer?

Benchmarking is a critical tool for understanding and optimizing your indexer's performance. By collecting and analyzing performance metrics, you can:

- Identify bottlenecks in your indexing pipeline
- Determine if performance issues are due to data fetching, processing, or database operations
- Measure the impact of code optimizations
- Set realistic expectations for indexing speed
- Plan infrastructure requirements for production deployments

## Running Benchmarks

### Capturing Benchmark Data

To collect performance metrics while your indexer is running:

```bash
# Using NPM
npm run envio start -- --bench

# Using the Envio CLI directly
envio start --bench
```

> **Note:** Benchmarking adds some memory and processing overhead. It should not be enabled in production environments, as it holds benchmark data points in memory and periodically writes them to disk.

### Viewing Benchmark Results

After running your indexer with benchmarking enabled, you can generate a performance summary:

```bash
# Using NPM
npm run envio benchmark-summary

# Using the Envio CLI directly
envio benchmark-summary
```

This command processes the collected benchmark data and displays a comprehensive performance report.

## Understanding Benchmark Output

The benchmark output is divided into several sections, each providing insights into different aspects of your indexer's performance:

### Time Breakdown

```
Time breakdown
┌─────────────────────────────────────────┬─────────┐
│ (index)                                 │ seconds │
├─────────────────────────────────────────┼─────────┤
│ Total Runtime                           │ 45      │
│ Total Time Fetching Chain 1 Partition 0 │ 44      │
│ Total Time Processing                   │ 9       │
└─────────────────────────────────────────┴─────────┘
```

**What This Tells You:**

- **Total Runtime**: Overall time the indexer has been running
- **Total Time Fetching**: Time spent retrieving data from the blockchain
- **Total Time Processing**: Time spent in event handlers and database operations

**How to Interpret:**

- If fetching time dominates (as in this example), your bottleneck is data retrieval, not processing
- If processing time is high relative to fetching, your handlers may need optimization
- Note that fetching and processing can overlap, so the sum may exceed total runtime

### General Performance Metrics

```
General
┌─────────────────────┬─────────┐
│ (index)             │ Values  │
├─────────────────────┼─────────┤
│ batch sizes sum     │ 158205  │
│ total runtime (sec) │ 45.801  │
│ events per second   │ 3454.18 │
└─────────────────────┴─────────┘
```

**What This Tells You:**

- **Batch Sizes Sum**: Total number of events processed
- **Total Runtime**: Precise runtime in seconds
- **Events Per Second**: Overall processing throughput

**How to Interpret:**

- Events per second is your key performance indicator
- 1,000-5,000 events/second indicates good performance
- Under 500 events/second may indicate optimization opportunities
- Over 10,000 events/second represents excellent performance

### Block Fetching Performance

```
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
```

**What This Tells You:**

- **Total Time Elapsed**: Time spent fetching and parsing each batch of blocks
- **Parsing Time**: Time spent decoding and preparing event data
- **Page Fetch Time**: Time spent retrieving data from the blockchain
- **Num Events**: Number of events in each batch
- **Block Range Size**: Number of blocks in each fetch operation

**How to Interpret:**

- Compare Page Fetch Time to Total Time to see if data retrieval is your bottleneck
- Large standard deviations (std-dev) indicate inconsistent performance
- If Block Range Size varies significantly, your indexer may be adjusting batch sizes dynamically

### Event Processing Performance

```
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
```

**What This Tells You:**

- **Batch Size**: Number of events in each processing batch
- **Contract Register Duration**: Time spent preparing contract data
- **Load Duration**: Time spent loading entities from the database
- **Handler Duration**: Time spent executing your event handler logic
- **DB Write Duration**: Time spent writing updated entities to the database
- **Total Time Elapsed**: Overall time for the processing phase

**How to Interpret:**

- Compare Load, Handler, and DB Write durations to identify bottlenecks
- In this example, DB Write (135ms) and Load (80ms) operations dominate processing time
- If Load Duration is high, consider implementing [entity loaders](/docs/HyperIndex/loaders)
- If DB Write Duration is high, check if you're updating too many entities per event

### Per-Handler Performance

```
Handlers Per Event
┌─────────────────────────────┬────────┬────────┬─────────┬────────┬────────┬──────────┐
│ (index)                     │ n      │ mean   │ std-dev │ min    │ max    │ sum      │
├─────────────────────────────┼────────┼────────┼─────────┼────────┼────────┼──────────┤
│ ERC20 Transfer Handler (ms) │ 158205 │ 0.0021 │ 0.0364  │ 0.0007 │ 4.6752 │ 329.7264 │
└─────────────────────────────┴────────┴────────┴─────────┴────────┴────────┴──────────┘
```

**What This Tells You:**

- Detailed timing for each specific event handler
- Shows average and total execution time across all events

**How to Interpret:**

- Compare different handlers to identify which ones are most expensive
- Look for handlers with high maximum values (max column), which may indicate inconsistent performance
- Handlers averaging above 1ms per event may benefit from optimization

## Interpreting Results and Taking Action

### Identifying Your Bottleneck

Based on the benchmark data, determine your primary performance bottleneck:

1. **Data Fetching Bottleneck**

   - **Symptoms**: Most time spent in "Total Time Fetching"
   - **Solutions**:
     - Use [HyperSync](/docs/HyperIndex/hypersync) if available for your network
     - If using RPC, consider a more performant provider
     - Adjust block batch sizes in your configuration

2. **Data Loading Bottleneck**

   - **Symptoms**: High "Load Duration" in Event Processing
   - **Solutions**:
     - Implement [entity loaders](/docs/HyperIndex/loaders) to batch database operations
     - Add appropriate [database indices](/docs/HyperIndex/database-performance-optimization) for frequently queried fields
     - Optimize your entity relationships to reduce join complexity

3. **Handler Logic Bottleneck**

   - **Symptoms**: High "Handler Duration" relative to other metrics
   - **Solutions**:
     - Simplify complex calculations in your handlers
     - Move complex operations to a post-processing step
     - Consider caching frequently accessed values

4. **Database Write Bottleneck**
   - **Symptoms**: High "DB Write Duration"
   - **Solutions**:
     - Reduce the number of entities updated per event
     - Batch related updates where possible
     - Check if you're updating the same entity multiple times unnecessarily

### Benchmarking Best Practices

1. **Benchmark Before and After Optimizations**

   - Run benchmarks before making changes to establish a baseline
   - Run again after each optimization to measure impact

2. **Focus on the Largest Bottleneck First**

   - Prioritize optimizations based on where time is being spent
   - Small improvements to the critical path yield the greatest results

3. **Watch for Memory Usage**

   - Monitor memory consumption alongside performance metrics
   - High memory usage can lead to degraded performance over time

4. **Consider Real-World Conditions**
   - Test with realistic data volumes and event patterns
   - Include periods of high activity in your benchmark tests

## Advanced Performance Tuning

For cases where standard optimizations aren't sufficient:

1. **Custom Database Indices**

   - Create indices tailored to your specific query patterns
   - Add composite indices for multi-field filters

2. **Handler Specialization**

   - Create specialized handlers for high-volume events
   - Simplify logic for the most common paths

3. **Infrastructure Scaling**
   - Consider hardware upgrades for database-bound workloads
   - Evaluate network proximity to your data sources

By regularly benchmarking your indexer and methodically addressing performance bottlenecks, you can achieve significant improvements in indexing speed and efficiency.
