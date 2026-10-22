# Samsung TV privacy package catalogs

Grouped lists of Samsung-signed Tizen packages that can be disabled to reduce
advertising, voice, and content-recognition activity. Each file names an exact
model and firmware the list was verified against. Copying a list onto a
different model is not safe without checking each package exists and has the
same role.

## un75u8000ffxza-tizen9-2025.json

Source: [jss8649/quiet-tizen](https://github.com/jss8649/quiet-tizen), MIT.
Target: UN75U8000FFXZA (2025 U8000F), firmware T-KSU2EFAKUC-0090-1300.9,
Tizen 9.0.

Groups:

- **advertising** — ACR, PISA, canalysis, samsung-analytics, targeted-ad,
  contents-recognition-dbmgr, promotion apps.
- **voice** — Bixby, Alexa, wake-word, utterance-recommender, voice onboarding.
- **context** — AICompanion*, context-aware-\*, content-grab-service,
  ai-discovery-\*.
- **smart-extras** — SmartThings, gaming hub daemons, health, ambience, AoV.
- **light-shell** — sidebar and Samsung browser (only after a replacement
  launcher is verified).
- **tv-plus** — Samsung TV Plus startup.

Each group also lists stop-markers and vconf keys to toggle.

### Applicability to this project's TV (QN55LS03BAFXZA, 2022 Frame, Tizen 6.5)

Treat the file as a candidate list, not a verified one. Many package IDs
overlap across Samsung firmware generations, but a 2025 model has three years
of added background services that a 2022 Frame TV does not run, and vice
versa.

Before using any name from this file against the 2022 Frame:

1. Enumerate installed packages on the live TV:
   `pkginfo --listpkg | sort > installed-2022.txt`
2. Intersect with each group's `app_ids` to see which are actually present.
3. For each present package, read its description via `pkginfo --pkg <id>`
   before disabling it. The name alone is not proof of role.
4. Keep `com.samsung.tv.tvPlusDeeplinker` enabled on the Frame — this project
   uses it as the "Samsung TV" tile.
5. Do not apply `light-shell` without verifying `TvHomeLnch` is still the
   active home. Removing the sidebar relies on a working replacement
   launcher.

### What this is not

- Not a traffic audit. Disabled flags do not prove zero outgoing traffic.
- Not a firmware mod. Nothing here flashes the OS or alters secure boot.
- Not reversible by itself. Pair any change with a `.pkgmgr_parser.db`
  snapshot (see `tools/snapshot.sh` in the parent repo) before you disable.
