#!/bin/bash

if [ "$CIRCLE_BRANCH" == "staging" ]; then
    export SERVER_URL="https://staging.sourcify.dev/server/"
fi

if [ "$CIRCLE_BRANCH" == "master" ]; then
    export SERVER_URL="https://sourcify.dev/server/"
fi

# Publishes sources to IPFS and deploys contracts to Goerli or Sepolia
# Account key and Infura project ID are Circle CI env variable settings.
npm run deploy:$CHAIN_NAME || exit 1

echo "Waiting 2 mins"
# Give monitor a chance to detect and save.
sleep 120
echo "Waited 2 mins"

# Script which verifies repository write
for i in `seq 1 20`
do
    # Give monitor a chance to detect and save.
    sleep 30
    # Script which verifies repository write
    echo "Trying ${i} times"
    if (scripts/monitor_e2e.js $CHAIN_ID $CHAIN_NAME); then
        echo "Test contract successfully verified!"
        exit 0
    fi
done

echo "Test contract not verified!"
exit 2
