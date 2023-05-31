#!/bin/bash
# Given a value N, generates a JSON list with numbers from 1 to N.
# Intended to be used as a dyanimc way to set the number of parallel
# containers for the Cypress GitHub Action.
# About: https://github.com/cypress-io/github-action#parallel
set -e

container_count=${1:-30}

containers=()
for ((i=1; i<=$container_count; i++)); do
  containers+=($i);
done

# Format bash array as JSON array: https://stackoverflow.com/a/67489301
containers_json=$(jq --compact-output --null-input '$ARGS.positional' --args -- "${containers[@]}")

echo "containers=$containers_json" >> $GITHUB_OUTPUT
