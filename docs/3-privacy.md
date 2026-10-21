# 3. Privacy extras

> [!WARNING]
> These scripts stop Samsung system services and disable built-in apps through the root session from [level 2](2-set-as-home.md). The service and app names come from the test TV's firmware. Each script checks its preconditions and stops at the first mismatch, but it hasn't been tested on any other TV. Take the backup from level 2 first.

All of this is optional and separate from the launcher. Everything is reversible: nothing is uninstalled and no user data is cleared.

Run each script through the root session from the repo folder, with `TV_IP` set as in level 2:

```bash
tools/tv-root.py --command "$(cat extras/privacy/services-apply.sh)"
```

## Services

| Script | What it does | How long it lasts |
| --- | --- | --- |
| `services-apply.sh` | Stops and runtime-masks 10 units: the ad agent, content analysis (`canalysis`), PISA, content recognition (ACR), SP-KPI, key logging and media analytics. It also writes the two startup markers that the TV's own unit files check (`ConditionPathExists`) for PISA and `canalysis`. | Markers survive a reboot. Masks last until the next reboot. |
| `services-reapply-after-reboot.sh` | Re-applies the 10 runtime masks after a reboot. | Until the next reboot |
| `services-restore.sh` | Removes the markers and masks and starts the services again. It refuses to delete a file it didn't create. | |
| `services-restore-runtime.sh` | Removes only the runtime masks. | |

Before changing anything, `services-apply.sh` checks that every unit exists in `/usr/lib/systemd/system/`, so it fails safely on firmware where the names differ. On the test TV, `systemctl daemon-reload` sometimes timed out while still finishing. The scripts check the resulting state instead of trusting the exit code.

## Built-in apps

`apps-disable-1.sh`, `apps-disable-2.sh` and `apps-disable-3.sh` disable 18 optional components for the TV owner with `pkgcmd -D --uid 5001`. Each app must be enabled first, and the scripts confirm every change:

- **Ad playback and ad frameworks:** `adplatform.ADPlayer`, `com.samsung.tv.adplayer`, `com.samsung.tv.ad-web-framework`, `com.samsung.tv.coba.adagent`, `com.samsung.tv.adagent-service`
- **Content recognition and analytics:** `com.samsung.tv.contents-recognition-dbmgr`, `com.samsung.tv.pisa-service`, `org.tizen.pisa-control-service`, `com.samsung.tv.canalysis-service`
- **Gaming Hub:** `com.samsung.tv.gamehome`, `com.samsung.tv.ghdaemon`, `com.samsung.tv.ghservice`
- **Samsung Health and Life+:** `samsunghealth-service-tv`, `com.samsung.tv.health-mde-*` (4 apps), `com.samsung.tv.lifeplus`

**Gaming Hub, Health and Life+ stop working after this.** Remove their lines from the scripts if you use them. The batches are kept small because each root command has a 45-second limit. `apps-restore.sh` re-enables all 18.

On the test TV, two more apps were disabled by hand:

```bash
tools/tv-root.py --command 'pkgcmd -D -t app -n com.samsung.tizen.samsung-analytics --uid 5001'
```

```bash
tools/tv-root.py --command 'pkgcmd -D -t app -n com.samsung.tv.targeted-ad-service --uid 5001'
```

Use `-A` instead of `-D` to enable them again. Some components have a supervisor that restarts them despite the disable flag. On the test TV that happened to the targeted-ad service and Samsung Health. Both were then paused with `kill -STOP` for the current boot, which a reboot or `kill -CONT` undoes.

## Software Update popups

```bash
tools/notification-settings.py --set quiet
```

This turns off popup notifications for the two Software Update apps through the TV's native notification-settings API, then reads the setting back. Updates themselves aren't blocked. Run it without `--set` to read the current values, and with `--set restore` to turn the popups back on.

## Limits

- This disables known components. It **doesn't prove** that the TV sends no telemetry, and it doesn't affect third-party apps.
- Persistence across reboots was not fully tested. Expect to re-run `services-reapply-after-reboot.sh` after a power cut.
- Samsung's supported opt-out for content recognition (ACR) is **Viewing Information Services** in the TV's privacy settings. Use that as well: [Samsung ACR guidance](https://www.samsung.com/us/support/answer/ANS10010616/).
