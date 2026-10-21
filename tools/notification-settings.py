#!/usr/bin/env python3
"""Read or change only Software Update popup notification preferences."""
import argparse
import asyncio
import json
import os
import shlex
import sys
import uuid
from pathlib import Path, PurePosixPath

TOOLS = Path(__file__).resolve().parent
sys.path.insert(0, str(TOOLS / "vendor/samsung-tv-root"))
from samsung_tv_root.archive_root import probe
from samsung_tv_root.sdb import SdbClient, find_sdb

MODES = ("quiet", "restore")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tv", default=os.environ.get("TV_IP"), help="TV IP address (default: $TV_IP)")
    parser.add_argument("--set", choices=MODES, dest="target")
    args = parser.parse_args()
    if not args.tv:
        parser.error("pass --tv <ip> or set TV_IP")
    files = [TOOLS / "notification-settings/out" / name for name in (
        "NotificationSettings.dll", "NotificationSettings.deps.json", "NotificationSettings.runtimeconfig.json"
    )]
    if any(not path.is_file() for path in files):
        parser.error("Compiled helper missing; run tools/build-helpers.sh first.")
    remote = PurePosixPath("/home/owner/share/tmp/sdk_tools") / ("tvhome-notification-" + uuid.uuid4().hex)
    client = SdbClient(find_sdb(), args.tv)
    client.connect()
    client.require_device()
    created = client.capture("mkdir -m 777 " + str(remote), timeout=20)
    if "[exit:0]" not in created.output:
        raise RuntimeError("Could not create temporary helper directory: " + created.output)
    try:
        for path in files:
            client.push(path, remote / path.name)
        command = "set -eu; chmod 755 " + str(remote) + "; /usr/bin/dotnet " + str(remote / "NotificationSettings.dll")
        if args.target:
            command += " " + shlex.quote(args.target)
        report = asyncio.run(probe(args.tv, commands=(command,)))
        print(json.dumps(report, indent=2))
        return int(
            not report.get("system_files_unchanged")
            or not report.get("staging_cleaned")
            or any(c["exit_code"] != 0 or c["timed_out"] for c in report["commands"])
        )
    finally:
        cleanup = client.capture("rm -rf " + str(remote), timeout=20)
        if "[exit:0]" not in cleanup.output:
            raise RuntimeError("Temporary helper cleanup failed: " + cleanup.output)


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
