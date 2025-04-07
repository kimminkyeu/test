#!/bin/bash

# 
# This script is used to run the Python script in a virtual environment using pipenv.
# Ex. sh run.sh <argument>
#

if [ $# -ne 1 ]; then
  echo "Error: Invalid number of arguments" >&2
  echo "Usage: sh $0 <argument>" >&2
  exit 1
fi

pipenv install > /dev/null 2>&1 # no output
PYTHONUNBUFFERED=1 pipenv run python main.py "$1"