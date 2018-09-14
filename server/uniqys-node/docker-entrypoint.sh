#!/bin/bash
set -e

if [ ! -e "/app/config/genesis.json" ]; then
  yarn run init --unique "Hello, CryptOsushi World!"
fi

exec "$@"

