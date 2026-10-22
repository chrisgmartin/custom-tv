# Catalog intersection — QN55LS03BAFXZA (2022 Frame TV, Tizen 6.5)

Intersected `un75u8000ffxza-tizen9-2025.json` against the live `pkginfo
--listpkg` output on 2026-10-22. 30 of the 54 catalog entries are present on
this TV; the rest are either 2025 additions, named differently in Tizen 6.5,
or not shipped at all.

> This file is a research inventory, not a command script. Disabling any of
> these needs a snapshot-first flow (`tools/snapshot.sh`) and should be done
> one group at a time with a restart in between to catch anything that stops
> cleanly on boot. The light-shell group in particular can affect how the
> Home button routes — test the launcher survives before applying.

## By group

### advertising — 5 of 10 present

| Package | Role (per quiet-tizen) |
| --- | --- |
| `com.samsung.tizen.samsung-analytics` | Samsung telemetry |
| `com.samsung.tv.canalysis-service` | Content analysis |
| `com.samsung.tv.contents-recognition-dbmgr` | ACR fingerprint DB |
| `com.samsung.tv.pisa-service` | PISA ad agent |
| `com.samsung.tv.targeted-ad-service` | Targeted-ad delivery |

Missing on this TV: `com.samsung.tv.acr`, `com.samsung.tv.adagent-service`,
`org.tizen.pisa-control-service`, `yL49PNFmjW.PromotionApp`,
`yL49PNFmjW.service`. Several of these are 2025 package names; equivalents
on this TV are the five present above.

### voice — 13 of 17 present

Full Bixby + Alexa + voice-\* stack is installed:
`com.samsung.tv.alexa-client`, `com.samsung.tv.bixby-context-client`,
`com.samsung.tv.bixby-prov`, `com.samsung.tv.bixbycapsuleviewer`,
`com.samsung.tv.mybixby`, `com.samsung.tv.ondevice-voice`,
`com.samsung.tv.voice-instant-app`, `com.samsung.tv.voiceassistant-music`,
`com.samsung.tv.wakeup-engine-alexa`, `com.samsung.tv.wakeup-engine-bixby`,
`org.tizen.voice-app`, `org.tizen.voice-client`, `org.tizen.voice-onboarding`.

Missing: the 2025 `alexa-fullscreen-app`, `utterance-recommender-*`,
`org.tizen.voice-app-service`.

### context — 4 of 13 present

Only `com.samsung.tv.context-aware-agent`,
`com.samsung.tv.context-aware-service`, `com.samsung.tv.vif`,
`content-grab-service`. The AICompanion\* family and
`ai-discovery-*` are 2025 additions not on this TV.

### smart-extras — 7 of 11 present

| Package | Role |
| --- | --- |
| `com.samsung.tizen.smartthings-client` | SmartThings integration |
| `com.samsung.tv.adplayer` | Promotion player (also appears in ads list on other models) |
| `com.samsung.tv.aov-dashboard` | Always-on-voice dashboard |
| `com.samsung.tv.ghdaemon` | Gaming Hub daemon |
| `com.samsung.tv.ghservice` | Gaming Hub service |
| `com.samsung.tv.smartthingsfind-daemon` | SmartThings Find |
| `samsunghealth-service-tv` | Samsung Health hooks |

Leaving these on is harmless if you use SmartThings or Gaming Hub; otherwise
they are strong disable candidates.

### light-shell — 1 of 2 present

Only `com.samsung.tv.home.sidebar`. The Samsung browser (`org.tizen.browser`)
isn't shipped on this TV — the "Internet" tile launches
`com.samsung.tv.knox-browser` instead, which is a different package.

**Do not disable `com.samsung.tv.home.sidebar` without confirming the Home
button still reaches `TvHomeLnch.Home` on this build.** The quiet-tizen
guide warns the sidebar can be load-bearing for Home routing on some
firmware.

### tv-plus — 0 of 1

`HEPsqFNie0.tvplusstandalone` is not installed on this TV. The pinned
"Samsung TV" tile launches `com.samsung.tv.tvPlusDeeplinker` instead, which
is a lightweight deep-link app and should not be disabled.

## Suggested order of operations

1. **advertising** first — these five are the lowest-risk group and most
   directly privacy-relevant. Snapshot `pkgmgr_parser.db` with
   `tools/snapshot.sh`, disable one at a time, cold-boot the TV, make sure
   the launcher still runs.
2. **context** second — four packages, low risk, can clear the
   `content-grab-service` concern.
3. **smart-extras** third — only if you don't use SmartThings / Gaming Hub.
4. **voice** last and only if you want Bixby and Alexa gone. Breaks voice
   remote features.
5. Skip **light-shell** on this TV until the Home routing path has been
   verified under a sidebar-off boot.

Each disable step is just: `pkginfo --disable-app <id>` from the root
session, followed by a reboot test. Reversal is `pkginfo --enable-app <id>`.
Nothing here flashes the firmware.
