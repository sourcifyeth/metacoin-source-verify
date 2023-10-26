# Sourcify e2e verification and monitor tests

Simple repository to check the e2e verification and monitor tests for Sourcify.

Verification script deploys a contract on a test network with salt, to make sure it's unique, then pushes it to a Sourcify server and checks if it gets verified.

The monitor script deploys a duplicate contract (i.e. without salt), and checks if the contract gets automatically verified on the Sourcify server, through the monitor.

## Setup

Install dependencies:

```bash
npm install
```

## Usage

### Verification e2e

Change the `CHAIN_NAME=sepolia` and `CHAIN_ID=11155111` accordingly

```bash
CHAIN_NAME=goerli CHAIN_ID=5 bash scripts/verification_e2e.sh
```

### Monitor e2e

Change the `CHAIN_NAME=sepolia` and `CHAIN_ID=11155111` accordingly

```bash
CHAIN_NAME=goerli CHAIN_ID=5 bash scripts/monitor_e2e.sh
```
