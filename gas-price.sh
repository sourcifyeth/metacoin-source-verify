#!/bin/bash
if [ ! $CHAIN ] || [ ! $ALCHEMY_ID ]; then
    echo "Script requires variables CHAIN and ALCHEMY_ID"
    exit 1
fi

TMP=$(\
    curl -X POST https://eth-$CHAIN.alchemyapi.io/v2/$ALCHEMY_ID\
        --data '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":42}'\
    | tac | tac | sed -re 's/^.*"result": "0x(.*)".*$/\1/'\
)
echo $(( 16#$TMP ))
