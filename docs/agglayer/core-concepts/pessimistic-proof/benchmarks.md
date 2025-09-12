---
title: Benchmarks
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Benchmarks
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Experimental performance analysis and benchmarks across different zkVM implementations
  </p>
</div>

## Overview

For experimental research and performance analysis of Pessimistic Proof across different zkVM implementations, comprehensive benchmarks have been conducted comparing SP1, RiscZero, Pico, OpenVM, and other zkVMs.

**Note**: These benchmarks are for research purposes only. **Production Agglayer uses SP1 and Succinct's Prover Network exclusively.**

## Benchmark Repository

For detailed performance analysis, benchmark results, and implementation comparisons across different zkVMs, visit the dedicated benchmark repository:

**[Agglayer Pessimistic Proof Benchmarks](https://github.com/BrianSeong99/Agglayer_PessimisticProof_Benchmark/)**

## What You'll Find

The benchmark repository includes:

- **Performance Comparisons**: Cycle counts and execution times across zkVMs
- **Implementation Details**: How Pessimistic Proof runs on different zkVMs  
- **Benchmark Results**: Comprehensive data tables and performance graphs
- **Setup Instructions**: How to run benchmarks locally
- **Technical Analysis**: Detailed breakdown of computation profiles

## Key Insights

Based on the benchmark research:

- **Keccak Dominance**: 75%+ of computation involves Keccak hash functions
- **Performance Variation**: Significant differences between zkVM implementations
- **Hardware Impact**: GPU acceleration and CPU optimizations affect performance
- **Production Choice**: SP1 chosen for optimal GPU performance and reliability
