#!/bin/bash
# Back up the live launcher wgt and the Home-selector vconf keys before any install.
# Pulls a tarball of /opt/usr/apps/TvHomeLnch/res/wgt/ and the key home_appid /
# startup_appid values to ./.local/snapshots/<name>/ (gitignored).
#
# Requires an authenticated-root path to the TV. Set ROOT_RUNNER to a command
# that takes a single shell string and runs it as root on the TV. Defaults to
# the tv-root.py helper pattern used elsewhere in this repo.
#
# Usage: tools/snapshot.sh <tv-ip> <snapshot-name>
set -euo pipefail

TV="${1:-}"
NAME="${2:-pre-install-$(date -u +%Y%m%dT%H%M%SZ)}"
if [ -z "$TV" ]; then
  echo "Usage: tools/snapshot.sh <tv-ip> [snapshot-name]" >&2
  exit 2
fi
case "$NAME" in ''|*[!A-Za-z0-9_.-]*)
  echo "Snapshot name must be [A-Za-z0-9_.-]+" >&2
  exit 2;;
esac

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/.local/snapshots/$NAME"
if [ -e "$OUT" ]; then
  echo "Snapshot already exists at $OUT. Pick a new name." >&2
  exit 1
fi
mkdir -p "$OUT"
chmod 700 "$OUT"

RUNNER="${ROOT_RUNNER:-python3 $ROOT/tools/tv-root.py --host $TV}"

# Each $RUNNER invocation takes one shell string. Keep each phase short.
echo "Reading Home selectors..."
$RUNNER 'vconftool get db/appfw/home_appid; vconftool get db/appfw/startup_appid' \
  > "$OUT/home-selectors.txt"

echo "Capturing wgt tarball (base64 over stdout)..."
$RUNNER 'cd /opt/usr/apps/TvHomeLnch/res && tar -czf - wgt/ | base64' \
  | base64 -d > "$OUT/wgt.tgz"
test -s "$OUT/wgt.tgz" || { echo "Empty wgt tarball" >&2; exit 1; }

echo "Recording live file hashes..."
$RUNNER 'find /opt/usr/apps/TvHomeLnch/res/wgt -type f -print0 | xargs -0 sha256sum' \
  > "$OUT/sha256.txt"

cat > "$OUT/README.txt" <<EOF
Snapshot: $NAME
TV:        $TV
Captured:  $(date -u +%Y-%m-%dT%H:%M:%SZ)
Contents:
  wgt.tgz             – the live /opt/usr/apps/TvHomeLnch/res/wgt/ tree
  home-selectors.txt  – db/appfw/home_appid and startup_appid before changes
  sha256.txt          – hash of every file in the live wgt
To restore the wgt tree, base64-pipe wgt.tgz back and extract in place.
EOF

echo "Snapshot written to $OUT"
