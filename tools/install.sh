#!/bin/bash
# Package, install and launch the Home app on the TV.
# Usage: tools/install.sh <tv-ip>   (or set TV_IP)
# Signs with the Tizen Studio certificate profile named in TVHOME_PROFILE (default: tv-home).
set -euo pipefail

TV="${1:-${TV_IP:-}}"
if [ -z "$TV" ]; then
  echo "Usage: tools/install.sh <tv-ip>   (or set TV_IP)" >&2
  exit 2
fi
PROFILE="${TVHOME_PROFILE:-tv-home}"
APP_ID="TvHomeLnch.Home"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TIZEN="$HOME/tizen-studio/tools/ide/bin/tizen"
SDB="$HOME/tizen-studio/tools/sdb"
BUILD="$ROOT/build"
export PATH="$HOME/tizen-studio/jdk/Contents/Home/bin:$PATH"

rm -rf "$BUILD"
mkdir -p "$BUILD/src"
cp -R "$ROOT/config.xml" "$ROOT/index.html" "$ROOT/icon.png" "$ROOT/css" "$ROOT/js" "$BUILD/src/"

"$TIZEN" cli-config "profiles.path=$HOME/tizen-studio-data/profile/profiles.xml" >/dev/null
"$TIZEN" package -t wgt -s "$PROFILE" -o "$BUILD" -- "$BUILD/src"
WGT="$(ls "$BUILD"/*.wgt)"

"$SDB" connect "$TV" >/dev/null
SERIAL="$TV:26101"
"$TIZEN" install -n "$(basename "$WGT")" -s "$SERIAL" -- "$BUILD"
"$TIZEN" run -p "$APP_ID" -s "$SERIAL"
