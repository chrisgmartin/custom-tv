#!/bin/sh
# Run through tools/tv-root.py (batch 1 of 3; batches stay small for the 45-second command limit).
# Disables, does not uninstall, optional components for the TV owner. Undo with apps-restore.sh.
set -eu
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='adplatform.ADPlayer';")" = false
pkgcmd -D -t app -n adplatform.ADPlayer --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='adplatform.ADPlayer';")" = true
echo 'Disabled adplatform.ADPlayer'
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.adplayer';")" = false
pkgcmd -D -t app -n com.samsung.tv.adplayer --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.adplayer';")" = true
echo 'Disabled com.samsung.tv.adplayer'
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.ad-web-framework';")" = false
pkgcmd -D -t app -n com.samsung.tv.ad-web-framework --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.ad-web-framework';")" = true
echo 'Disabled com.samsung.tv.ad-web-framework'
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.coba.adagent';")" = false
pkgcmd -D -t app -n com.samsung.tv.coba.adagent --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.coba.adagent';")" = true
echo 'Disabled com.samsung.tv.coba.adagent'
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.contents-recognition-dbmgr';")" = false
pkgcmd -D -t app -n com.samsung.tv.contents-recognition-dbmgr --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.contents-recognition-dbmgr';")" = true
echo 'Disabled com.samsung.tv.contents-recognition-dbmgr'
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.gamehome';")" = false
pkgcmd -D -t app -n com.samsung.tv.gamehome --uid 5001
test "$(sqlite3 /opt/dbspace/.pkgmgr_parser.db "SELECT app_disable FROM package_app_info WHERE app_id='com.samsung.tv.gamehome';")" = true
echo 'Disabled com.samsung.tv.gamehome'
