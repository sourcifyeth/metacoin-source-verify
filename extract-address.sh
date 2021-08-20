CHAIN_NAME=$1
grep $CHAIN_NAME -A 2 | grep MetaCoinSalted | sed 's/^.*MetaCoinSalted: \(.*\).*$/\1/'