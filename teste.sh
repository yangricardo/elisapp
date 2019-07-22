#!/usr/bin/env bash
while [[ "$(lsof -Pi :8080 -sTCP:LISTEN -t)" == "" ]] ; do
    echo "aguardando inicialização do corda node"
    sleep 10
done