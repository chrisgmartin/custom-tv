#!/bin/bash
# Build the .NET helpers that run on the TV (only needed for docs/2-set-as-home.md and extras).
# Requires a .NET SDK that can target net6.0 (`dotnet --list-sdks`).
set -euo pipefail

TOOLS="$(cd "$(dirname "$0")" && pwd)"
VENDOR="$TOOLS/vendor/samsung-tv-root"

for project in "$VENDOR"/payload-source/*.csproj; do
  dotnet build "$project" --configuration Release --output "$VENDOR/samsung_tv_root/payloads/common"
done
dotnet build "$TOOLS/home-routing/HomeRouting.csproj" --configuration Release --output "$TOOLS/home-routing/out"
dotnet build "$TOOLS/notification-settings/NotificationSettings.csproj" --configuration Release --output "$TOOLS/notification-settings/out"
