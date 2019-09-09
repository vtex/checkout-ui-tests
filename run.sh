#!/usr/bin/env bash

function run {
    node ./src/index.js
    echo "Waiting 1 min..."
    sleep 60
}

while [ 1 ]; do run; test $? -gt 128 && break; done
