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

# Format bash array as JSON array: https://stackoverflow.com/a/26809318/7651928
containers_json=$(for f in "${containers[@]}"; do printf '%s' "$f" | jq -R -s .; done | jq -s .)

echo "matrix='[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]'" >> %GITHUB_OUTPUT
