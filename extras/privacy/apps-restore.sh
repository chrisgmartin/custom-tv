#!/bin/sh
# Run through tools/tv-root.py. Re-enables every app that apps-disable-1/2/3.sh disable.
set -eu
pkgcmd -A -t app -n adplatform.ADPlayer --uid 5001
pkgcmd -A -t app -n com.samsung.tv.adplayer --uid 5001
pkgcmd -A -t app -n com.samsung.tv.ad-web-framework --uid 5001
pkgcmd -A -t app -n com.samsung.tv.coba.adagent --uid 5001
pkgcmd -A -t app -n com.samsung.tv.contents-recognition-dbmgr --uid 5001
pkgcmd -A -t app -n com.samsung.tv.gamehome --uid 5001
pkgcmd -A -t app -n com.samsung.tv.ghdaemon --uid 5001
pkgcmd -A -t app -n com.samsung.tv.ghservice --uid 5001
pkgcmd -A -t app -n samsunghealth-service-tv --uid 5001
pkgcmd -A -t app -n com.samsung.tv.health-mde-service --uid 5001
pkgcmd -A -t app -n com.samsung.tv.health-mde-service-view --uid 5001
pkgcmd -A -t app -n com.samsung.tv.health-mde-setting --uid 5001
pkgcmd -A -t app -n com.samsung.tv.health-mde-workout-tracker --uid 5001
pkgcmd -A -t app -n com.samsung.tv.lifeplus --uid 5001
pkgcmd -A -t app -n com.samsung.tv.pisa-service --uid 5001
pkgcmd -A -t app -n com.samsung.tv.adagent-service --uid 5001
pkgcmd -A -t app -n org.tizen.pisa-control-service --uid 5001
pkgcmd -A -t app -n com.samsung.tv.canalysis-service --uid 5001
