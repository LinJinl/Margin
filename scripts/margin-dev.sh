#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
export MARGIN_DEVTOOLS=1
exec npm run dev:debug
