# Samsung TV DNS blocklist (vetted subset)

A curated list of hostnames to deny-list on the TV's upstream DNS resolver.
Covers ACR fingerprinting, Samsung ads, and vendor telemetry. Deliberately
omits domains that would break the clock, firmware updates, the app store,
Samsung account auth, or SmartThings — see "do not block" below for the
specific exclusions.

Sources, with full citations, in [`network-blocking.md`](network-blocking.md).
The ACR regional list and the ad hosts come from HaGeZi's `native.samsung`
list (updated 2026-10-02); the IMC 2024 paper confirms the ACR observations
on measured Samsung sets.

## Block

### ACR (Automatic Content Recognition) — 11 hosts
```
acr-au-prd.samsungcloud.tv
acr-br-prd.samsungcloud.tv
acr-ca-prd.samsungcloud.tv
acr-eu-prd.samsungcloud.tv
acr-in-prd.samsungcloud.tv
acr-kr-prd.samsungcloud.tv
acr-mx-prd.samsungcloud.tv
acr-nz-prd.samsungcloud.tv
acr-us-prd.samsungcloud.tv
acr0.samsungcloudsolution.com
samsungacr.com
```

Blocking the whole of `samsungacr.com` covers `log-config.samsungacr.com`,
`log-ingestion.samsungacr.com` and `log-ingestion-eu.samsungacr.com` — the
log endpoints the fingerprint pipeline posts to.

### Samsung ads — 4 hosts
```
samsungads.com
samsungadhub.com
samsungtvads.com
samsungads.adsmeasurement.com
```

### Vendor telemetry and diagnostics — 18 hosts
```
nmetrics.samsung.com
samsungrm.com
test.samsungrm.net
devicelog.samsungcloudsolution.net
prderrordumphsm.samsungcloudsolution.com
prderrordumpssm.samsungcloudsolution.net
diagmon-policy.samsungdm.com
diagmon-serviceapi.samsungdm.com
report.gras.samsungdm.com
us-report.gras.samsungdm.com
osb.samsungqbe.com
osb-krsvc.samsungqbe.com
apu.samsungelectronics.com
bpu.samsungelectronics.com
cpu.samsungelectronics.com
dpu.samsungelectronics.com
kpu.samsungelectronics.com
upu.samsungelectronics.com
xpu.samsungelectronics.com
ypu.samsungelectronics.com
zpu.samsungelectronics.com
```

The `?pu.samsungelectronics.com` set is Samsung's "SPU" vendor-telemetry
pipeline. All nine letters resolve.

**Total: 33 hostnames.** Save them to a file (one per line) called
`samsung-tv-blocklist.txt` on whichever resolver you use.

## Do NOT block

These sit on the same Samsung umbrella but break something the TV does
if denied. Pulled from the research in `network-blocking.md`.

```
time.samsungcloudsolution.com      # clock drift; also breaks Plex, YouTube and Amazon Video on some sets
auth.samsungosp.com                # Samsung account login (needed for app store sign-in)
samsungosp.com                     # parent of above
samsungotn.net                     # firmware updates (OTN = Over the Network)
otnprd8.samsungcloudsolution.net   # also updates
otnprd9.samsungcloudsolution.net
otnprd10.samsungcloudsolution.net
otnprd11.samsungcloudsolution.net
configprd.samsungcloudsolution.net # app and system configuration bundle
lcprd1.samsungcloudsolution.net    # same family
lcprd2.samsungcloudsolution.net
osb-apps-v2.samsungqbe.com         # Samsung app store
samsungiotcloud.com                # SmartThings (even if you disabled the package, don't blackhole DNS)
samsungcloud.tv                    # DO NOT block the parent — TV Plus logo host sits here (tvpnlogopeu.samsungcloud.tv)
samsungcloudsolution.com           # DO NOT block the whole parent — too many sub-domains the TV needs
samsungcloudsolution.net           # same
```

Keep this list beside the block list; some blocklist consumers (Pi-hole,
AdGuard Home) support explicit allow entries that override wildcards.

## How to apply

Pick the one that fits your network.

### Pi-hole or AdGuard Home
1. Paste the 33 hostnames into **Group Management → Domains → Blacklist**
   (or Filters → Custom Rules on AdGuard Home — one entry per line).
2. Add the "do not block" entries to the whitelist / allowlist to override
   any broad list you also run (HaGeZi full, Perflyst, etc.).
3. In your router, point the TV's DHCP-assigned DNS to the Pi-hole /
   AdGuard Home address. If the router supports it, also redirect outbound
   port 53 to the resolver so the TV can't use `8.8.8.8` directly —
   several guides warn Samsung sets occasionally bypass DHCP DNS.

### NextDNS
1. In the dashboard, go to **Denylist** and paste the 33 hostnames.
2. In **Allowlist**, add the "do not block" entries.
3. Enabling NextDNS's built-in "Samsung" native tracking toggle alone is
   not enough — that list only has 4 Knox / phone analytics hosts, none
   of them TV ACR.

### Router-level (any home router with hosts entries)
If the router supports "block hostname" rules per client, apply all 33 to
the TV's MAC address. Scoping to the TV avoids any surprise effect on
other devices (phones might use `nmetrics.samsung.com` for Samsung-phone
telemetry).

## Verify it's working

The IMC 2024 authors noted ACR traffic spikes in the first few seconds
after power-on, so most of what you need to see appears right after a
cold boot.

1. **DNS logs** — on Pi-hole / AdGuard Home / NextDNS, filter by the TV's
   IP (or hostname). After a cold boot you should see 10–30 queries to
   the ACR and SPU hosts, all blocked. If the acr-\*-prd queries never
   appear, the TV may be using DoH over 443 or a hardcoded resolver;
   see the DoH note in `network-blocking.md`.
2. **No ads in the Smart Hub launcher** (if you still visit it) — the
   banner slots served from `samsungads.com` should either be empty or
   fall back to a Samsung-first-party placeholder.
3. **Nothing visibly broken** — the clock stays accurate, Netflix /
   Prime / Hulu still launch, the firmware update prompt still comes
   through (OTN hosts are allowlisted), the "Samsung TV" tile still opens
   TV Plus. If any of these do break, something in the broader HaGeZi
   list is probably catching a parent domain — compare against the
   "do not block" list above.

## Why 33 and not the whole list

HaGeZi's full `native.samsung` list has about 200 entries, many of them
Samsung phone, Knox, Samsung Health, Adobe `demdex` etc. — unrelated to
the TV. The 33 above are the TV-relevant subset most sources agree on.
If you want more coverage, add HaGeZi's full list AND the explicit
allowlist above to override breakage.
