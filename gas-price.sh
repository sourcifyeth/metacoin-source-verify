#!/bin/bash
if [ ! $CHAIN ]; then
    echo "Script requires variables CHAIN"
    exit 1
fi

if [ $CHAIN == "sepolia" ]; then
    URL=https://rpc.sepolia.org
else
    if [ ! $ALCHEMY_ID ]; then
        echo "Script requires variables ALCHEMY_ID for rinkeby and goerli"
        exit 1
    fi
    URL=https://eth-$CHAIN.alchemyapi.io/v2/$ALCHEMY_ID
fi

TMP=$(\
    curl -X POST $URL\
        -H 'Content-Type: application/json'\
        --data '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":"sourcify"}'\
    | tac | tac | sed -re 's/^.*"result":"0x(.*)".*$/\1/'\
)

echo $(( 16#$TMP ))
