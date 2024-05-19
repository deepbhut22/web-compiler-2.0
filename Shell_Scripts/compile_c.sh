#! bin/sh

CODE_FILE="$1"
OUTPUT_FILE="temp_output"

gcc $CODE_FILE -o $OUTPUT_FILE 2> compile_error.log

if [ -f $OUTPUT_FILE ]; then
    ./$OUTPUT_FILE
    EXIT_CODE=$?

    if [ $EXIT_CODE -ne 0 ]; then
        echo "execution failed with exit code $EXIT_CODE"
    fi
    rm -f $OUTPUT_FILE
else
    cat compile_error.log
fi

rm -f compile_error.log

