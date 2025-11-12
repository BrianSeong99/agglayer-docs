To go live with Vault Bridge, every chain must complete the following steps:

## **1\. Onboard to Vault Bridge**
* [Contact our team to get started on the onboarding process.](https://info.polygon.technology/vaultbridge-intake-form) 
* Complete legal documentation and escrow agreement

## **2\. Integrate core contract functions**

### Required Integration

* **depositAndBridge()**: deposit an underlying asset on Ethereum, mint vbTokens, and bridge them to L2 via the Agglayer in one transaction.  
* **claimAndRedeem()**: claim vbTokens from the Agglayer and redeem them 1:1 for the underlying on Ethereum.

These two functions are sufficient for deposits, bridging, and redemptions of the base Vault Bridge assets.

**Implementation Guide:** See [Ethereum to L2 Bridging](../integration-guides/eth-to-l2.md) and [L2 to Ethereum Bridging](../integration-guides/l2-to-eth.md)

## **3\. Optional deployments**

### Native Converter (Recommended for Better UX)

* **Native Converter**: deploy on L2 if you want local conversion of assets into vbTokens without round-tripping to Ethereum.  
* **Custom Token**: upgrade vbTokens on L2 to use the Native Converter

**Implementation Guide:** See [Native Converter Integration](../integration-guides/native-converter-integration.md)