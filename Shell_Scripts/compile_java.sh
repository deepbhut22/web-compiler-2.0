#!/bin/sh

# Get the file name without the extension
BASENAME=$(basename "$1" .java)

# Compile the Java file and specify the output directory
javac -d . "$1" 2> compile_error.log

# Check if the compilation was successful
if [ -f "${BASENAME}.class" ]; then
    java "$BASENAME"
    EXIT_CODE=$?
    if [ $EXIT_CODE -ne 0 ]; then
        echo "Execution error with exit code $EXIT_CODE"
    fi
    rm -f "${BASENAME}.class"
else
    cat compile_error.log
fi

rm -f compile_error.log
