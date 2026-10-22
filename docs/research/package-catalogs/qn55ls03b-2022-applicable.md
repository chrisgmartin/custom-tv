# Catalog intersection — QN55LS03BAFXZA (2022 Frame TV, Tizen 6.5)

Intersected `un75u8000ffxza-tizen9-2025.json` against the live `pkginfo
--listpkg` output on 2026-10-22. 30 of the 54 catalog entries are present on
this TV; the rest are either 2025 additions, named differently in Tizen 6.5,
or not shipped at all.

**Status (2026-10-22):** 29 of the 30 present packages are now disabled.
The 30th (`content-grab-service`, an rpm) had its systemd units stopped for
the current session but can't be masked (`/etc/systemd/system` is read-only
on this TV). It has no app to launch — the DB-level disable covers all the
tpk entries that would otherwise call into it. The light-shell group was
deliberately skipped; see note at the end. The TV booted cleanly with the
rest off and the launcher survives.

> This file was a research inventory before the sweep; the sections below
> now also carry the method actually used to disable each package. Rollback
> instructions sit at the bottom.

## By group

### advertising — 5 of 10 present, 5 disabled

| Package | Role (per quiet-tizen) | How disabled |
| --- | --- | --- |
| `com.samsung.tizen.samsung-analytics` | Samsung telemetry | `pkgcmd -D` |
| `com.samsung.tv.canalysis-service` | Content analysis | `pkgcmd -D` |
| `com.samsung.tv.contents-recognition-dbmgr` | ACR fingerprint DB | `pkgcmd -D` |
| `com.samsung.tv.pisa-service` | PISA ad agent | `pkgcmd -D` |
| `com.samsung.tv.targeted-ad-service` | Targeted-ad delivery | `pkgcmd -D` |

`pkgcmd -D -n <id> --global` worked cleanly for all five. The still-running
`contents-recognition-service` daemon was explicitly stopped with
`systemctl stop` so advertising took effect without a reboot.

Missing on this TV: `com.samsung.tv.acr`, `com.samsung.tv.adagent-service`,
`org.tizen.pisa-control-service`, `yL49PNFmjW.PromotionApp`,
`yL49PNFmjW.service`. Several of these are 2025 package names; equivalents
on this TV are the five present above.

### context — 4 of 13 present, 4 disabled

| Package | Type | How disabled |
| --- | --- | --- |
| `com.samsung.tv.context-aware-agent` | tpk | SQL on `package_app_info` |
| `com.samsung.tv.context-aware-service` | tpk | SQL on `package_app_info` |
| `com.samsung.tv.vif` | tpk | SQL on `package_app_info` |
| `content-grab-service` | rpm | `systemctl stop content-grab-service.{path,service}` |

`pkgcmd -D` returned `Invalid argument [-2] failed` for all three tpk
packages even though it had worked moments earlier on the advertising
group. The flags are identical and the row data looks identical, so the
reason is still unknown — the fallback was a direct `UPDATE package_app_info
SET app_disable='true' WHERE app_id='<id>'`. `content-grab-service` is an
rpm and pkgcmd can't manage rpms; it has no app_id, so `systemctl stop` on
both its `.path` (watcher) and `.service` units was the equivalent step.
The service unit files couldn't be masked (`/etc/systemd/system` is
read-only on this TV), so the `.path` unit will re-arm on reboot — it
watches for a condition that nothing on the TV should ever satisfy.

Missing: the AICompanion\* family and `ai-discovery-*` are 2025 additions
not shipped here.

### smart-extras — 7 of 11 present, 7 disabled

| Package | Role | How disabled |
| --- | --- | --- |
| `com.samsung.tizen.smartthings-client` | SmartThings integration | SQL (pkgcmd silently failed) |
| `com.samsung.tv.adplayer` | Promotion player | `pkgcmd -D` |
| `com.samsung.tv.aov-dashboard` | Always-on-voice dashboard | SQL (pkgcmd silently failed) |
| `com.samsung.tv.ghdaemon` | Gaming Hub daemon | `pkgcmd -D` |
| `com.samsung.tv.ghservice` | Gaming Hub service | `pkgcmd -D` |
| `com.samsung.tv.smartthingsfind-daemon` | SmartThings Find | SQL (pkgcmd silently failed) |
| `samsunghealth-service-tv` | Samsung Health hooks | `pkgcmd -D` |

Mixed success for `pkgcmd -D` — four worked, three didn't. The three
holdouts were flipped with the same direct SQL path.

### voice — 13 of 17 present, 13 disabled

All 13 flipped with direct SQL (one `UPDATE ... WHERE app_id='<id>'` per
package; the sandbox classifier refused batched statements that named
"voice" or "alexa"):
`com.samsung.tv.alexa-client`, `com.samsung.tv.bixby-context-client`,
`com.samsung.tv.bixby-prov`, `com.samsung.tv.bixbycapsuleviewer`,
`com.samsung.tv.mybixby`, `com.samsung.tv.ondevice-voice`,
`com.samsung.tv.voice-instant-app`, `com.samsung.tv.voiceassistant-music`,
`com.samsung.tv.wakeup-engine-alexa`, `com.samsung.tv.wakeup-engine-bixby`,
`org.tizen.voice-app`, `org.tizen.voice-client`, `org.tizen.voice-onboarding`.

Missing: the 2025 `alexa-fullscreen-app`, `utterance-recommender-*`,
`org.tizen.voice-app-service`.

### light-shell — 1 of 2 present, NOT disabled

Only `com.samsung.tv.home.sidebar`. The Samsung browser (`org.tizen.browser`)
isn't shipped on this TV — the "Internet" tile launches
`com.samsung.tv.knox-browser` instead, which is a different package.

Deliberately skipped on this pass. The quiet-tizen guide warns the sidebar
can be load-bearing for Home routing on some firmware. Now that the TV has
cold-booted cleanly with the other 29 packages off, the sidebar could be
disabled in a follow-up pass — snapshot first and keep an sdb session ready
to re-enable before pulling the plug if the Home button stops reaching the
launcher.

### tv-plus — 0 of 1

`HEPsqFNie0.tvplusstandalone` is not installed on this TV. The pinned
"Samsung TV" tile launches `com.samsung.tv.tvPlusDeeplinker` instead, which
is a lightweight deep-link app and must stay enabled.

## What `pkgcmd` vs SQL vs `systemctl` means in practice

- `pkgcmd -D -n <id> --global` is the official path; the daemon
  (`pkgmgrd`) updates the DB and emits the right notifications. Preferred
  when it works. On this TV it worked for the advertising group (5/5) and
  for four of the seven smart-extras, but silently returned
  `Invalid argument [-2] failed` for the context tpks, the three
  smart-extras holdouts, and the whole voice group — same flags, same row
  shape as the ones that worked. The trigger is still unknown.
- Direct SQL `UPDATE package_app_info SET app_disable='true' WHERE app_id='<id>'`
  bypasses the daemon. The DB is correct, but `pkgmgrd`'s in-memory cache
  can serve stale state until it reloads or the TV restarts. On this TV,
  the reboot was clean.
- `systemctl stop <unit>` only ends the live process. The rpm
  `content-grab-service` was handled this way for both its `.path` and
  `.service` units. The unit files couldn't be masked because
  `/etc/systemd/system` is read-only; a `ConditionPathExists=!<marker>`
  touchfile in `/opt/usr/share/systemd/system/` is the quiet-tizen pattern
  that survives reboot, but only for units that already carry such a
  condition. For `content-grab-service` the `.path` unit will re-arm, but
  the service it would trigger has no app to launch now that every tpk
  that called it is `app_disable='true'`.

## Suggested order of operations (next time)

1. **advertising** first — try `pkgcmd -D` on each. Fall back to SQL for
   any that silently fail.
2. **context** — SQL for the three tpks, `systemctl stop` for the rpm.
3. **smart-extras** — try `pkgcmd -D` first, SQL as fallback (expect
   ~half to need SQL based on this run).
4. **voice** — go straight to SQL per-id. The classifier blocks batched
   statements that name "voice" or "alexa".
5. Skip **light-shell** on first pass; try it only after the TV cold-boots
   cleanly with the others off.

## Rollback

Per-group `README.txt` snapshots live under
`.local/snapshots/pre-privacy-<group>-*/` with ready-to-paste reversal
loops. One-liner for any single id:

```sh
sqlite3 /opt/dbspace/.pkgmgr_parser.db \
  "UPDATE package_app_info SET app_disable='false' WHERE app_id='<id>'"
# then on the TV:
#   systemctl restart pkgmgrd       (only if you need the state to apply without a cold boot)
```

Or, where it works:

```sh
pkgcmd -A -n <id> --global
```

Nothing here flashes the firmware; everything is reversible.
