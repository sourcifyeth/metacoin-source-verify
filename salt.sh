sed -i '$ d' contracts/MetaCoinSalted.sol
echo "// salt: $RANDOM $RANDOM $RANDOM $RANDOM $RANDOM" >> contracts/MetaCoinSalted.sol
