#!/usr/bin/env node

/**
 * Part of E2E Monitor test run for staging and master builds
 * Script queries the repository to discover whether a contract
 * published to {chainID} in CI has been picked up and saved by the
 * monitor.
 */

require("dotenv").config();
const assert = require("assert");
const util = require("util");
const log = console.log;

const chainID = parseInt(process.argv[2]);
const chainName = process.argv[3];
if (!chainID || !chainName) {
  log("Expected arguments: <chainID> <chainName>");
  process.exit(1);
}

const artifact = require("../MetaCoin.json");
const address = artifact.networks[chainID].address;

async function main() {
  const baseUrl = process.env.SERVER_URL.replace(/\/+$/, "");
  const url = `${baseUrl}/v2/contract/${chainID}/${address}?fields=metadata`;

  log();
  log(`>>>>>>>>>>>>>>>>>>>>`);
  log(`Fetching: ${url}    `);
  log(`>>>>>>>>>>>>>>>>>>>>`);
  log();

  const res = await fetch(url);
  const text = await res.text();

  // The v2 API returns 404 (with an error body) until the monitor has picked
  // up and verified the contract.
  if (!res.ok) {
    throw new Error(`Contract not verified yet (HTTP ${res.status}): ${text}`);
  }

  let contract;
  try {
    contract = JSON.parse(text);
  } catch (err) {
    throw new Error("Could not parse contract response from server...");
  }

  const metadata = contract.metadata;
  if (!metadata) {
    throw new Error("Metadata not found in response...");
  }

  assert(metadata.compiler.version !== undefined);
  assert(metadata.language === "Solidity");

  log();
  log(`>>>>>>>>`);
  log(`Metadata`);
  log(`>>>>>>>>`);
  log();

  log(util.inspect(metadata));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    log(err);
    process.exit(1);
  });
