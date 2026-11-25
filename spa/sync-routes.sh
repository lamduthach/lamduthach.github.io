#!/usr/bin/env bash
# Copy spa/index.html to every route folder so deep links return HTTP 200
# on GitHub Pages (which cannot rewrite URLs). Safe to run from any directory.
set -euo pipefail

SPA_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROUTES=(products contact)

for route in "${ROUTES[@]}"; do
  mkdir -p "$SPA_DIR/$route"
  cp "$SPA_DIR/index.html" "$SPA_DIR/$route/index.html"
  echo "synced $route/index.html"
done
