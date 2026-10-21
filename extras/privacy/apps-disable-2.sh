#!/bin/sh
# Run through tools/tv-root.py (batch 2 of 3; batches stay small for the 45-second command limit).
# Disables, does not uninstall, optional components for the TV owner. Undo with apps-restore.sh.
set -eu
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.ghdaemon';")" = false
pkgcmd -D -t app -n com.samsung.tv.ghdaemon --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.ghdaemon';")" = true
echo 'Disabled com.samsung.tv.ghdaemon'
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.ghservice';")" = false
pkgcmd -D -t app -n com.samsung.tv.ghservice --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.ghservice';")" = true
echo 'Disabled com.samsung.tv.ghservice'
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='samsunghealth-service-tv';")" = false
pkgcmd -D -t app -n samsunghealth-service-tv --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='samsunghealth-service-tv';")" = true
echo 'Disabled samsunghealth-service-tv'
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.health-mde-service';")" = false
pkgcmd -D -t app -n com.samsung.tv.health-mde-service --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.health-mde-service';")" = true
echo 'Disabled com.samsung.tv.health-mde-service'
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.health-mde-service-view';")" = false
pkgcmd -D -t app -n com.samsung.tv.health-mde-service-view --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.health-mde-service-view';")" = true
echo 'Disabled com.samsung.tv.health-mde-service-view'
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.health-mde-setting';")" = false
pkgcmd -D -t app -n com.samsung.tv.health-mde-setting --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.health-mde-setting';")" = true
echo 'Disabled com.samsung.tv.health-mde-setting'
