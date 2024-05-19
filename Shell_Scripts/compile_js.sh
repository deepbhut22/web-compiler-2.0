CODE_FILE=$1

node $CODE_FILE
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo "execution failed with error code $EXIT_CODE"
fi

rm -f $CODE_FILE