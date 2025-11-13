---
title: Assets & Vaults
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Vault Bridge Assets & Vaults
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Reference hub for Vault Bridge production deployments, Layer&nbsp;Y integrations, and test networks.
  </p>
</div>

## Production Networks {#production-networks}

### Ethereum Mainnet

#### Vault Bridge Tokens

| Token | Underlying | Address | Vault |
|-------|-----------|---------|-------|
| **vbETH** | WETH (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2) | [0x31A5684983EeE865d943A696AAC155363bA024f9](https://etherscan.io/address/0x31A5684983EeE865d943A696AAC155363bA024f9) | [Morpho](https://app.morpho.org/ethereum/vault/0x31A5684983EeE865d943A696AAC155363bA024f9) |
| **vbUSDC** | USDC (0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48) | [0xBEefb9f61CC44895d8AEc381373555a64191A9c4](https://etherscan.io/address/0xBEefb9f61CC44895d8AEc381373555a64191A9c4) | [Morpho](https://app.morpho.org/ethereum/vault/0xBEefb9f61CC44895d8AEc381373555a64191A9c4/vault-bridge-usdc) |
| **vbUSDT** | USDT (0xdAC17F958D2ee523a2206206994597C13D831ec7) | [0xc54b4E08C1Dcc199fdd35c6b5Ab589ffD3428a8d](https://etherscan.io/address/0xc54b4E08C1Dcc199fdd35c6b5Ab589ffD3428a8d) | [Morpho](https://app.morpho.org/ethereum/vault/0xc54b4E08C1Dcc199fdd35c6b5Ab589ffD3428a8d/vault-bridge-usdt) |
| **vbWBTC** | WBTC (0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599) | [0x812B2C6Ab3f4471c0E43D4BB61098a9211017427](https://etherscan.io/address/0x812B2C6Ab3f4471c0E43D4BB61098a9211017427) | [Morpho](https://app.morpho.org/ethereum/vault/0x812B2C6Ab3f4471c0E43D4BB61098a9211017427/vault-bridge-wbtc) |
| **vbUSDS** | USDS (0xdC035D45d973E3EC169d2276DDab16f1e407384F) | [0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81](https://etherscan.io/address/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81) | [Yearn](https://yearn.fi/v3/1/0x0868076663Bbc6638ceDd27704cc8F0Fa53d5b81) |

## Layer&nbsp;Y Deployments {#layer-y-deployments}

### Katana

#### Bridged vbTokens

| Token | L1 Origin | Address |
|-------|-----------|---------|
| **Bridged vbETH** | vbETH (Ethereum) | [0x7aE35a8DE245aDc5E1dd4e543D52D32b5Bc85C86](https://katanascan.com/address/0x7aE35a8DE245aDc5E1dd4e543D52D32b5Bc85C86) |
| **Bridged vbUSDC** | vbUSDC (Ethereum) | [0xC912A1D5Cb260c1821B3c2f0049a87Fe2ab62fFF](https://katanascan.com/address/0xC912A1D5Cb260c1821B3c2f0049a87Fe2ab62fFF) |
| **Bridged vbUSDT** | vbUSDT (Ethereum) | [0x2DCa96907fde857dd3D816880A0df407eeB2D2F2](https://katanascan.com/address/0x2DCa96907fde857dd3D816880A0df407eeB2D2F2) |
| **Bridged vbWBTC** | vbWBTC (Ethereum) | [0x0913DA6Da4b42f538B445599b46Bb4622342Cf52](https://katanascan.com/address/0x0913DA6Da4b42f538B445599b46Bb4622342Cf52) |
| **Bridged vbUSDS** | vbUSDS (Ethereum) | [0x62D6A123E8D19d06d68cf0d2294F9A3A0362c6b3](https://katanascan.com/address/0x62D6A123E8D19d06d68cf0d2294F9A3A0362c6b3) |

#### Native Converter Contracts

| Token | Native Converter Address | Purpose |
|-------|------------------------|---------|
| **vbETH** | [0xa6b0db1293144ebe9478b6a84f75dd651e45914a](https://katanascan.com/address/0xa6b0db1293144ebe9478b6a84f75dd651e45914a) | Convert ETH ↔ vbETH on L2 |
| **vbUSDC** | [0x97a3500083348A147F419b8a65717909762c389f](https://katanascan.com/address/0x97a3500083348A147F419b8a65717909762c389f) | Convert USDC ↔ vbUSDC on L2 |
| **vbUSDT** | [0x053FA9b934b83E1E0ffc7e98a41aAdc3640bB462](https://katanascan.com/address/0x053FA9b934b83E1E0ffc7e98a41aAdc3640bB462) | Convert USDT ↔ vbUSDT on L2 |
| **vbWBTC** | [0xb00aa68b87256E2F22058fB2Ba3246EEc54A44fc](https://katanascan.com/address/0xb00aa68b87256E2F22058fB2Ba3246EEc54A44fc) | Convert WBTC ↔ vbWBTC on L2 |
| **vbUSDS** | [0x639f13D5f30B47c792b6851238c05D0b623C77DE](https://katanascan.com/address/0x639f13D5f30B47c792b6851238c05D0b623C77DE) | Convert USDS ↔ vbUSDS on L2 |

## Test Networks {#test-networks}

### Ethereum Sepolia

#### Vault Bridge Tokens

| Token | Underlying Token | Vault Bridge Token |
|-------|------------------|-------------------|
| **vbETH** | WETH: [0x04d08c8525B55c409201289C4ff5a204fa437d9f](https://sepolia.etherscan.io/address/0x04d08c8525B55c409201289C4ff5a204fa437d9f) | [0x188FFFc2562C67aCdB9a0CD0B819021DDfC82A6B](https://sepolia.etherscan.io/address/0x188FFFc2562C67aCdB9a0CD0B819021DDfC82A6B) |
| **vbUSDC** | USDC: [0xCea1D25a715eC34adFB2267ACe127e8D107778dd](https://sepolia.etherscan.io/address/0xCea1D25a715eC34adFB2267ACe127e8D107778dd) | [0xb62Ba0719527701309339a175dDe3CBF1770dd38](https://sepolia.etherscan.io/address/0xb62Ba0719527701309339a175dDe3CBF1770dd38) |
| **vbUSDT** | USDT: [0xDA9E6CAA9F85aE060BCcd6a789E0C7D39A33e24f](https://sepolia.etherscan.io/address/0xDA9E6CAA9F85aE060BCcd6a789E0C7D39A33e24f) | [0xdd9aCdD3D2AeC1C823C51f8389597C6be9779B28](https://sepolia.etherscan.io/address/0xdd9aCdD3D2AeC1C823C51f8389597C6be9779B28) |
| **vbWBTC** | WBTC: [0x8dbBbF4E801774265171D7e101a9f346Fa6f56bD](https://sepolia.etherscan.io/address/0x8dbBbF4E801774265171D7e101a9f346Fa6f56bD) | [0x2CE29070ee5e65C4191d5Efca8E85be181F34B6d](https://sepolia.etherscan.io/address/0x2CE29070ee5e65C4191d5Efca8E85be181F34B6d) |
| **vbUSDS** | USDS: [0x5956982345967Dbc9648cD133c2fECb1eF132AE6](https://sepolia.etherscan.io/address/0x5956982345967Dbc9648cD133c2fECb1eF132AE6) | [0x406F1A8D91956d8D340821Cf6744Aa74c666836C](https://sepolia.etherscan.io/address/0x406F1A8D91956d8D340821Cf6744Aa74c666836C) |
