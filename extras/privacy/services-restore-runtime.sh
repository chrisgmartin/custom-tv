#!/bin/sh
# Run through tools/tv-root.py. Removes only the runtime masks and restarts the services
# that were running on the test TV. Persistent markers stay; use services-restore.sh for those.
set -eu
test "$(readlink /run/systemd/system/adagent-service.service)" = /dev/null
rm /run/systemd/system/adagent-service.service
test "$(readlink /run/systemd/system/canalysis-service.service)" = /dev/null
rm /run/systemd/system/canalysis-service.service
test "$(readlink /run/systemd/system/pisa-service.service)" = /dev/null
rm /run/systemd/system/pisa-service.service
test "$(readlink /run/systemd/system/contents-recognition-service.service)" = /dev/null
rm /run/systemd/system/contents-recognition-service.service
test "$(readlink /run/systemd/system/org.tizen.tv.sp-kpi.service)" = /dev/null
rm /run/systemd/system/org.tizen.tv.sp-kpi.service
test "$(readlink /run/systemd/system/kpi-logging.service)" = /dev/null
rm /run/systemd/system/kpi-logging.service
test "$(readlink /run/systemd/system/media-analytics-service.service)" = /dev/null
rm /run/systemd/system/media-analytics-service.service
test "$(readlink /run/systemd/system/pisa-service.path)" = /dev/null
rm /run/systemd/system/pisa-service.path
test "$(readlink /run/systemd/system/pisa-service.socket)" = /dev/null
rm /run/systemd/system/pisa-service.socket
test "$(readlink /run/systemd/system/org.tizen.tv.media.analytics.service.busname)" = /dev/null
rm /run/systemd/system/org.tizen.tv.media.analytics.service.busname
nsenter --target 1 --mount /bin/systemctl daemon-reload
nsenter --target 1 --mount /bin/systemctl start --no-block contents-recognition-service.service org.tizen.tv.sp-kpi.service kpi-logging.service
