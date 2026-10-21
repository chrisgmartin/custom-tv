#!/bin/sh
# Run through tools/tv-root.py (batch 3 of 3; batches stay small for the 45-second command limit).
# Disables, does not uninstall, optional components for the TV owner. Undo with apps-restore.sh.
set -eu
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.health-mde-workout-tracker';")" = false
pkgcmd -D -t app -n com.samsung.tv.health-mde-workout-tracker --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.health-mde-workout-tracker';")" = true
echo 'Disabled com.samsung.tv.health-mde-workout-tracker'
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.lifeplus';")" = false
pkgcmd -D -t app -n com.samsung.tv.lifeplus --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.lifeplus';")" = true
echo 'Disabled com.samsung.tv.lifeplus'
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.pisa-service';")" = false
pkgcmd -D -t app -n com.samsung.tv.pisa-service --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.pisa-service';")" = true
echo 'Disabled com.samsung.tv.pisa-service'
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.adagent-service';")" = false
pkgcmd -D -t app -n com.samsung.tv.adagent-service --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.adagent-service';")" = true
echo 'Disabled com.samsung.tv.adagent-service'
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='org.tizen.pisa-control-service';")" = false
pkgcmd -D -t app -n org.tizen.pisa-control-service --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='org.tizen.pisa-control-service';")" = true
echo 'Disabled org.tizen.pisa-control-service'
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.canalysis-service';")" = false
pkgcmd -D -t app -n com.samsung.tv.canalysis-service --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.canalysis-service';")" = true
echo 'Disabled com.samsung.tv.canalysis-service'
