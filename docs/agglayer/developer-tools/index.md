---
title: Developer Tools
---

<!-- Page Header Component -->
<h1 style="text-align: left; font-size: 38px; font-weight: 700; font-family: 'Inter Tight', sans-serif;">
  Developer Tools
</h1>

<div style="text-align: left; margin: 0.5rem 0;">
  <p style="font-size: 18px; color: #666; max-width: 600px; margin: 0;">
    Comprehensive tools and SDKs for building, testing, and deploying cross-chain applications with Agglayer
  </p>
</div>

## Build with Confidence

Agglayer provides a complete suite of developer tools designed to streamline your cross-chain development experience. From local testing environments to production SDKs, everything you need to build robust cross-chain applications.

### Your Development Workflow

**Start Local**: Use AggSandbox to test your cross-chain logic in a controlled environment with instant feedback and comprehensive debugging tools.

**Integrate Seamlessly**: Leverage the Agglayer SDK to connect your applications to the unified bridge with minimal code and maximum reliability.

**Deploy with Confidence**: Move from local testing to production with tools that maintain consistency across environments.

### What You Can Build

Our developer tools enable you to create sophisticated cross-chain applications:

- **Cross-Chain DeFi Protocols**: Build lending, trading, and yield farming applications that work across multiple chains
- **Unified Gaming Experiences**: Create games where assets and progress seamlessly move between different blockchain networks
- **Multi-Chain Infrastructure**: Develop tools and services that operate across the entire Agglayer ecosystem
- **Enterprise Solutions**: Build scalable applications that leverage the best features of multiple blockchain networks

## Developer Tools

Choose the right tool for your development needs:

<div style="display: flex; flex-direction: column; gap: 1rem; max-width: 800px; margin: 1rem 0;">

  <!-- AggSandbox Card -->
  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem 1rem; margin: 0.25rem 0;">
    <h3 style="color: #0071F7; margin: 0 0 0.5rem 0; font-size: 18px; font-weight: 600;">
      AggSandbox
    </h3>
    <p style="color: #666; margin-bottom: 0.75rem; line-height: 1.4; font-size: 14px;">
      Complete local testing environment with pre-configured networks, contracts, and bridge services. Perfect for development and testing.
    </p>
    <a href="/agglayer/developer-tools/aggsandbox/introduction" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">
      Learn more →
    </a>
  </div>

  <!-- Agglayer SDK Card
  <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 1rem 1rem; margin: 0.25rem 0;">
    <h3 style="color: #0071F7; margin: 0 0 0.5rem 0; font-size: 18px; font-weight: 600;">
      Agglayer SDK
    </h3>
    <p style="color: #666; margin-bottom: 0.75rem; line-height: 1.4; font-size: 14px;">
      Production-ready SDK for integrating cross-chain functionality into your applications with simple, intuitive APIs.
    </p>
    <a href="/agglayer/developer-tools/agglayer-sdk/" style="color: #0071F7; text-decoration: none; font-weight: 500; font-size: 14px;">
      Learn more →
    </a>
  </div> -->

</div>

## Getting Started

### For New Developers

If you're new to cross-chain development or Agglayer:

1. **Start with AggSandbox**: Set up your local development environment and run your first cross-chain transaction
2. **Explore Examples**: Try the sample applications and bridge operations to understand the concepts
3. **Build Your First App**: Create a simple cross-chain application using the patterns you've learned

### For Experienced Developers

If you're already familiar with blockchain development:

1. **Review Architecture**: Understand how Agglayer's unified bridge differs from traditional bridge solutions
2. **Integrate the SDK**: Add cross-chain functionality to your existing applications
3. **Optimize for Production**: Learn about security considerations and best practices

### Development Environment Setup

**Prerequisites:**

- Node.js 18+
- Docker and Docker Compose
- Basic understanding of blockchain development

**Quick Setup:**
```bash
# Install AggSandbox
git clone https://github.com/agglayer/aggsandbox
cd aggsandbox
make install

# Start your development environment
aggsandbox start --detach

# Verify everything is working
aggsandbox status
```

