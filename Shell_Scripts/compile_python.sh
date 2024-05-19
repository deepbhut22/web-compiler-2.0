#! bin/sh

python $1
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo "execution failed with error code $EXIT_CODE"
fi