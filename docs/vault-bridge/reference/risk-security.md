## **1\. Risk Management**

Assets deposited into Vault Bridge are placed in Morpho vaults curated by seasoned teams such as Steakhouse Financial and Gauntlet. Each vault carries an independent Credora Network credit rating—for example, the [Vault Bridge USDC Morpho Vault](https://app.morpho.org/ethereum/vault/0xBEefb9f61CC44895d8AEc381373555a64191A9c4/vault-bridge-usdc?subTab=risk)—so participants can monitor credit exposure continuously.

## **2\. Withdrawals**

Morpho maintains a buffer of liquid assets like USDC, allowing Vault Bridge to fulfill withdrawals quickly and with minimal gas overhead even during busy periods.

## **3\. Audits**

All Vault Bridge–specific contracts have passed through formal third-party audits. The full set of reports is available [in the public repository](https://github.com/agglayer/vault-bridge/tree/main/audits).

## **4\. Solvency**

Vault Bridge enforces a strict 1:1 relationship between each vbToken and its underlying asset. Minor fluctuations in readily available liquidity are typically absorbed by ongoing yield and remain invisible to users. Larger deviations—though rare—are controlled by a configurable slippage allowance (currently 1% across vbTokens). When that mechanism engages, redemptions still settle 1:1 because any shortfall within the threshold is covered by the vbToken contract operator.