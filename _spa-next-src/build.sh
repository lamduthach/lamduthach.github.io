#!/usr/bin/env bash
# Build the Next.js test site and publish it to ../spa-next/ (served by
# GitHub Pages at /spa-next/). Safe to run from any directory.
set -euo pipefail

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$SRC_DIR/../spa-next"

cd "$SRC_DIR"
npm ci
npm run build
rm -rf "$OUT_DIR"
cp -r out "$OUT_DIR"
echo "published to $OUT_DIR"
