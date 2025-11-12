---
title: Integration Guides
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Integration Guides
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Step-by-step playbooks for bringing Vault Bridge to your chain or application
  </p>
</div>

## Overview

These guides walk through every stage of a Vault Bridge integration—from first deposit on Ethereum to native conversions on L2 and automated proof retrieval. They combine production-ready smart contracts, scripts, and testing patterns so you can move from prototype to mainnet with confidence.

## Choose Your Path

<div style="display: flex; flex-direction: column; gap: 1rem; max-width: 800px; margin: 1rem 0;">

  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem;">
    <h3 style="color: #0071F7; margin: 0 0 0.4rem; font-size: 18px; font-weight: 600;">Bridging vbTokens Overview</h3>
    <p style="color: #666; margin: 0 0 0.65rem; line-height: 1.45; font-size: 14px;">
      Understand the end-to-end flow for vbTokens, including directional differences (L1→L2 vs L2→L1), network IDs, and token mapping strategies.
    </p>
    <a href="bridging-vbtokens.md" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">Read the primer →</a>
  </div>

  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem;">
    <h3 style="color: #0071F7; margin: 0 0 0.4rem; font-size: 18px; font-weight: 600;">Ethereum → L2 Bridging</h3>
    <p style="color: #666; margin: 0 0 0.65rem; line-height: 1.45; font-size: 14px;">
      Integrate `depositAndBridge()` with production-ready smart contracts, JavaScript helpers, Sepolia walkthroughs, and gas optimization tips.
    </p>
    <a href="eth-to-l2.md" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">Implement L1→L2 →</a>
  </div>

  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem;">
    <h3 style="color: #0071F7; margin: 0 0 0.4rem; font-size: 18px; font-weight: 600;">L2 → Ethereum Bridging</h3>
    <p style="color: #666; margin: 0 0 0.65rem; line-height: 1.45; font-size: 14px;">
      Compare `claimAndRedeem()` with `claimAsset()` + `redeem()`, fetch proofs via the Bridge Service API, and automate redemption pipelines.
    </p>
    <a href="l2-to-eth.md" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">Implement L2→L1 →</a>
  </div>

  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem;">
    <h3 style="color: #0071F7; margin: 0 0 0.4rem; font-size: 18px; font-weight: 600;">Native Converter Integration</h3>
    <p style="color: #666; margin: 0 0 0.65rem; line-height: 1.45; font-size: 14px;">
      Deploy Custom Tokens and Native Converters on L2, manage migratable backing, and automate migration to L1 for yield generation.
    </p>
    <a href="native-converter-integration.md" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">Enable local conversions →</a>
  </div>

  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem;">
    <h3 style="color: #0071F7; margin: 0 0 0.4rem; font-size: 18px; font-weight: 600;">Testing Guide</h3>
    <p style="color: #666; margin: 0 0 0.65rem; line-height: 1.45; font-size: 14px;">
      Run Foundry unit tests, Sepolia integration tests, and CI pipelines to validate every facet of your Vault Bridge deployment.
    </p>
    <a href="testing-guide.md" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">Test your integration →</a>
  </div>

</div>

## Before You Start

1. **Understand Agglayer Basics** — Review the [Agglayer Unified Bridge](/agglayer/core-concepts/unified-bridge/) and [asset bridging concepts](/agglayer/core-concepts/unified-bridge/asset-bridging.md) to understand underlying security.
2. **Set Up Tooling** — Install [Foundry](https://book.getfoundry.sh/getting-started/installation), Node.js, and obtain Sepolia ETH for testing.
3. **Complete Onboarding** — Legal agreements are required. [Contact the Vault Bridge team](https://info.polygon.technology/vaultbridge-intake-form) to get started.
