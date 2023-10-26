#!/bin/bash
if [ "$CIRCLE_BRANCH" == "staging" ]; then
    export SERVER_URL="https://staging.sourcify.dev/server/"
fi

if [ "$CIRCLE_BRANCH" == "master" ]; then
    export SERVER_URL="https://sourcify.dev/server/"
fi

# Test WITH providing address and chain
npm run deploy-with-salt:$CHAIN_NAME || exit 3
echo "Waiting 60 secs"
sleep 60 # Leave some buffer for blocks to propogate
echo "Waited 60 secs"

node scripts/verification_e2e.js $CHAIN_ID || exit 4
