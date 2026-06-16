const assert = require("assert");
require("dotenv").config();

const deploymentChain = process.argv[2];
assert(deploymentChain, "No chain provided");
const artifact = require("../MetaCoinSalted.json");
const deploymentAddress = artifact.networks[deploymentChain].address;
const buildInfoFilename = artifact.networks[deploymentChain].buildInfoFilename;

assert(
  deploymentAddress,
  `No address found - has the contract been deployed to chain ${deploymentChain}?`
);

// Automatically set on CircleCI depending on the sourcify repo branch. Otherwise set manually.
const serverUrl = process.env.SERVER_URL;
console.log("server:", serverUrl);
if (!serverUrl) {
  console.log("No server URL found. Exiting.");
  process.exit(1);
}
// Normalize away any trailing slash so we can safely append the v2 path.
const baseUrl = serverUrl.replace(/\/+$/, "");

// The contract we deploy in 2_deploy_salted.js.
const CONTRACT_IDENTIFIER = "contracts/MetaCoinSalted.sol:MetaCoinSalted";
// The salted source is unique per deployment, so we expect a full ("exact") match.
const EXPECTED_MATCH = "exact_match";

// Poll the verification job until it completes (or we time out).
const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  // The Hardhat build-info file already contains the Standard JSON input and
  // the exact compiler version, which is everything the v2 API needs.
  const buildInfo = require(`../artifacts/build-info/${buildInfoFilename}`);

  const body = {
    stdJsonInput: buildInfo.input,
    compilerVersion: `v${buildInfo.solcLongVersion}`,
    contractIdentifier: CONTRACT_IDENTIFIER,
  };

  const verifyUrl = `${baseUrl}/v2/verify/${deploymentChain}/${deploymentAddress}`;
  console.log(`Submitting verification job to: ${verifyUrl}`);

  const verifyRes = await fetch(verifyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const verifyText = await verifyRes.text();
  console.log("Raw output:");
  console.log(verifyText);

  let verifyJson;
  try {
    verifyJson = JSON.parse(verifyText);
  } catch (err) {
    throw new Error(`Failed to parse the verify response: ${err.message}`);
  }

  // 202 Accepted -> job queued. Anything else is an error from the server.
  assert(
    verifyRes.status === 202,
    `Verification request failed (HTTP ${verifyRes.status}): ${JSON.stringify(
      verifyJson
    )}`
  );

  const { verificationId } = verifyJson;
  assert(verificationId, "No `verificationId` in response");
  console.log(`Verification job started: ${verificationId}`);

  // Poll the job status until it finishes.
  const jobUrl = `${baseUrl}/v2/verify/${verificationId}`;
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let job;
  while (true) {
    await sleep(POLL_INTERVAL_MS);

    const jobRes = await fetch(jobUrl);
    const jobText = await jobRes.text();
    try {
      job = JSON.parse(jobText);
    } catch (err) {
      console.log("Could not parse job status, retrying...");
      console.log(jobText);
      if (Date.now() > deadline) {
        throw new Error("Timed out waiting for verification job to complete");
      }
      continue;
    }

    if (job.isJobCompleted) break;

    console.log("Job not completed yet, waiting...");
    if (Date.now() > deadline) {
      throw new Error("Timed out waiting for verification job to complete");
    }
  }

  console.log(JSON.stringify(job, null, 2));

  assert(!job.error, `Verification failed: ${JSON.stringify(job.error)}`);

  const contract = job.contract;
  assert(contract, "No `contract` in completed job");

  assert(
    contract.address.toLowerCase() === deploymentAddress.toLowerCase(),
    `Address should be ${deploymentAddress}. Actual: ${contract.address}`
  );

  assert(
    contract.match === EXPECTED_MATCH,
    `Match should be ${EXPECTED_MATCH}. Actual: ${contract.match}`
  );

  console.log(`Verified contract ${deploymentAddress} on chain ${deploymentChain}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
