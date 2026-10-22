# Blocking Samsung TV (Tizen) data at the network level, and checking that it worked

Research date: 2026-10-15. 15 tool calls. The blocklists were fetched live; their dates appear inline. Older data is marked.

## 1. Which domains do Samsung TVs contact, by function?

### Takeaway
The best measured ACR domains are `acr-<region>-prd.samsungcloud.tv` (fingerprints), `log-config.samsungacr.com` and `log-ingestion[-eu].samsungacr.com`, plus `acr0.samsungcloudsolution.com` in the UK. An academic study (IMC 2024) confirmed these, and HaGeZi's Samsung list, updated 2 Oct 2026, carries them. Ads sit on `samsungads.com`, `samsungadhub.com` and `samsungtvads.com`. The rest of `samsungcloudsolution.com/.net` mixes telemetry with services the TV needs (time, auth, app store, notices), so blocking the whole parent domain breaks things.

### Cited Findings
**ACR (measured)**
- Samsung ACR domains seen in the UK: `acr-eu-prd.samsungcloud.tv`, `acr0.samsungcloudsolution.com`, `log-config.samsungacr.com`, `log-ingestion-eu.samsungacr.com`. In the US: `acr-us-prd.samsungcloud.tv`, `log-config.samsungacr.com`, `log-ingestion.samsungacr.com` (no acr0). The authors say `acr-*-prd` probably carries fingerprints and the others logging or keep-alives. — [Anselmi et al., IMC 2024, arXiv 2409.06203](https://arxiv.org/html/2409.06203v1)
- The authors found ACR domains by capturing DNS in the first seconds after power-on and filtering for the string "acr". Domains without "acr" in the name could therefore be missed. — [IMC 2024](https://arxiv.org/html/2409.06203v1)
- HaGeZi's list also carries regional ACR hosts `acr-{au,br,ca,eu,in,kr,mx,nz,us}-prd.samsungcloud.tv`, plus `acr0.samsungcloudsolution.com`. — [HaGeZi native.samsung (v2026.1002, 200 entries)](https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/native.samsung-onlydomains.txt)
- Samba TV (a separate ACR company) domains `api/events/platform/preferences.cid.samba.tv` appear in Perflyst's list under Sony and Toshiba, not Samsung. Samba TV is not tied to Samsung sets in any source found. — [Perflyst SmartTV.txt](https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt)

**Ads**
- HaGeZi blocks the whole domains `samsungads.com`, `samsungadhub.com`, `samsungtvads.com`, `samsungacr.com`, `samsungrm.com`, plus `samsungtv-d.openx.net` and `samsungads.adsmeasurement.com`. — [HaGeZi native.samsung](https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/native.samsung-onlydomains.txt)
- Perflyst lists `ads.samsungads.com`, `ad.samsungadhub.com`, `rd.samsungadhub.com`, `samsungads.com`, `samsungadhub.com`, `tvx.adgrx.com`, `ads.aimitv.com`, and the configuration host `targeted-config-test.samsungacr.com`. — [Perflyst SmartTV.txt (version 13July2023v1, so over three years old)](https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt)

**Telemetry, logs, error dumps**
- HaGeZi: `devicelog.samsungcloudsolution.net`, `prderrordumphsm.samsungcloudsolution.com`, `prderrordumpssm.samsungcloudsolution.net`, `{a,b,c,d,k,u,x,y,z}pu.samsungelectronics.com`, `osb.samsungqbe.com`, `osb-krsvc.samsungqbe.com`, `diagmon-*.samsungdm.com`, `report.gras.samsungdm.com`, `sca.samsung.com`, `nmetrics.samsung.com`. Many other entries cover Samsung's websites and phones (Adobe `demdex`/`omtrdc`, Knox, Samsung Health), not TVs. — [HaGeZi native.samsung](https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/native.samsung-onlydomains.txt)
- Perflyst also blocks `log-1/2/3.samsungacr.com`, `samsungcloudsolution.com`, `samsungcloudsolution.net`, `samsungqbe.com`, `samsungelectronics.com`, `fkp.*`, `prov.*`, `sas.*`, `musicid.*`, `notice*.samsungcloudsolution.com`, `oempprd.*`, `amauthprd`/`abtauthprd`, `vdterms.samsungcloudsolution.com`, `pavv.co.kr`, `pipeaota.com`, and a few CloudFront/S3 hosts. — [Perflyst SmartTV.txt](https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt)
- Perflyst comments out (does not block) these entries, which marks them as breakage-prone or uncertain: `acr0.samsungcloudsolution.com`, `configprd.samsungcloudsolution.net`, `lcprd1.samsungcloudsolution.net`, `otnprd8-11.samsungcloudsolution.net`, `samsungotn.net`/`www.samsungotn.net`, `time.samsungcloudsolution.com`, `auth.samsungosp.com`, `samsungosp.com`, `cdn.samsungcloudsolution.com`, `osb-ussvc.samsungqbe.com`, `otn.samsungcloudcdn.com`, `gpm.samsungqbe.com`, `multiscreen.samsung.com`, `samsungrm.net`. — [Perflyst SmartTV.txt](https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt)
- The marq24 Samsung list (undated) blocks these same entries outright, including `time.samsungcloudsolution.com`, `otnprd*`, `lcprd1/2`, `samsungotn.net`, `auth.samsungosp.com`, `configprd`, and a SmartThings host (`ocfconnect-shard-eu02-euwest1.samsungiotcloud.com`). It warns: "It could be that the TV does not receive any more updates or other services no longer work." — [marq24 samsung-smart-tv.txt](https://raw.githubusercontent.com/marq24/pihole-blocklist/master/samsung-smart-tv.txt)

**Firmware updates, app store, time, SmartThings (inferred from what lists comment out)**
- Updates: `samsungotn.net` and `otnprd*.samsungcloudsolution.net` ("OTN" is Samsung's term for over-the-network updates; Samsung documents OTN and USB as its two update methods). — [Perflyst](https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt); [Samsung support: update by USB](https://www.samsung.com/lb/support/tv-audio-video/how-to-update-the-samsung-tvs-firmware-using-a-usb-drive/)
- Time: `time.samsungcloudsolution.com`. — [Perflyst](https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt)
- App store and account: `osb-apps-v2.samsungqbe.com`, `auth.samsungosp.com`. — [marq24](https://raw.githubusercontent.com/marq24/pihole-blocklist/master/samsung-smart-tv.txt)

**NextDNS "Samsung" native tracking protection**
- The public source list for NextDNS's Samsung native-tracking option holds only 4 domains: `nmetrics.samsung.com`, `insights.samsung.com`, `analytics.samsungknox.com`, `bigdata.ssp.samsung.com`. Its last change was 2022-11-30. These read as phone/Knox analytics, and none are the TV ACR domains above. — [nextdns/native-tracking-domains: domains/samsung](https://raw.githubusercontent.com/nextdns/native-tracking-domains/main/domains/samsung)

### Inferences
- Turning on NextDNS's "Samsung" toggle alone would probably not stop TV ACR. NextDNS users should add HaGeZi's Samsung list or custom deny entries for `samsungacr.com`, `samsungcloud.tv` ACR hosts and `samsungads.com`.
- Of the lists reviewed, HaGeZi's is the only one maintained in 2026. Perflyst (2023) and marq24 (undated) are older and more aggressive.
- Blocking the whole of `samsungacr.com` (which HaGeZi does) covers both log hosts. Blocking the whole of `samsungcloud.tv` is untested in any source found; the TV Plus logo host `tvpnlogopeu.samsungcloud.tv` (in marq24) sits on the same parent domain, so blocking the parent could break Samsung TV Plus.

### Gaps
- No source maps every domain to its function with packet-level proof. Labels other than the ACR ones come from list maintainers' comments and the hostnames themselves.
- I found no 2025–2026 capture from a current Tizen model (for example a 2025 or 2026 model) listing its full domain set. The IMC paper does not name TV models or firmware versions.
- No connectivity-check (captive-portal) host for Tizen was confirmed in any source.

## 2. What breaks when each group is blocked? Hardcoded DNS, DoH, IP fallbacks?

### Takeaway
Blocking the ACR and ad domains appears safe. Blocking the whole of `samsungcloudsolution.com/.net` or the time host is what breaks apps, Samsung TV Plus, SmartThings and the clock. A DNS sinkhole only sees queries the TV sends to it. Some sources say Samsung TVs use 8.8.8.8 for some services, but that claim is thin, so a router rule that redirects port 53 is worth adding either way.

### Cited Findings
- One maintainer reports that blocking `time.samsungcloudsolution.com` lets the TV's clock drift and stopped Plex, YouTube and Amazon Video on some Samsung TVs. — [hkamran80 Pi-hole Smart TV gist (via search summary)](https://gist.github.com/hkamran80/779019103fcd306979411d44c8d38459)
- Comments on the wassname Samsung list report that adding the full list "completely broke Samsung Apps and Samsung TV Plus channels", and that blocking samsungcloudsolution causes problems with SmartThings connectivity. — [wassname gist (via search summary)](https://gist.github.com/wassname/b594c63222f9e4c83ea23c818440901b)
- In a Pi-hole forum thread, apps would not open with Pi-hole on, yet the query log showed no clearly blocked request, and allowing `samsungcloudsolution.com` did not fix it. — [Pi-hole Discourse: Samsung TV apps won't open](https://discourse.pi-hole.net/t/samsung-tv-apps-wont-open-with-pihole-on/29621)
- 2017 thread (old): one user says "it's better not to block samungcloudsolution.com, otherwise the TV get's crazy"; another blocked about 20 Samsung domains while allowing Netflix and Amazon, and said the TV "works fine". A 2022 question about which host serves firmware went unanswered. — [Pi-hole Discourse 2017](https://discourse.pi-hole.net/t/this-is-what-your-dashboard-looks-like-with-a-samsung-tv/3165)
- The IMC 2024 authors cite earlier work that found DNS blocklists ineffective against smart TV ad and tracking traffic. — [IMC 2024](https://arxiv.org/html/2409.06203v1)
- PoPETs 2020 (Varmarken et al.; old, tested Roku and Fire TV, not Samsung): even TV-specific blocklists missed ads and broke features. — [PoPETs 2020](https://petsymposium.org/popets/2020/popets-2020-0021.php)
- Hardcoded DNS: one guide says Samsung TVs may use 8.8.8.8 for some services even when given a different DNS server. — [edwardangert.com Pi-hole guide](https://edwardangert.com/docs/pi-hole/network-level-blocking/)
- How-To Geek (23 Sept 2026): Pi-hole and AdGuard Home only filter queries that reach them. A device hardcoded to 8.8.8.8 bypasses them while the log looks clean. A NAT redirect on port 53 fixes plain DNS but not DoH on 443, which needs extra firewall rules that can break smart features. — [How-To Geek](https://www.howtogeek.com/pi-hole-wont-stop-your-smart-tv-from-spying-heres-what-actually-works/)
- In the 2017 thread, the hardcoded 8.8.8.8/8.8.4.4 report concerns Roku and Fire TV, not Samsung. — [Pi-hole Discourse 2017](https://discourse.pi-hole.net/t/this-is-what-your-dashboard-looks-like-with-a-samsung-tv/3165)
- privacysmarthome.com publishes 2026 guides on redirecting port 53 and blocking DoH/DoT resolver IPs (TCP 443, TCP/UDP 853) for Samsung and LG. Its "original research" tables give no method, so treat their specifics with caution. — [privacysmarthome DoH matrix](https://www.privacysmarthome.com/guides/samsung-lg-smart-tv-doh-ip-domain-blocklist-matrix-2026/)

### Inferences
- Safe first tier: `samsungacr.com`, `acr-*-prd.samsungcloud.tv`, `acr0.samsungcloudsolution.com`, `samsungads.com`, `samsungadhub.com`, `samsungtvads.com`, `log-*`/`devicelog`/`prderrordump*`. Leave `time.*`, `otnprd*`/`samsungotn.net` (updates), `osb-apps*`/`auth.samsungosp.com` (store and login) and the parent `samsungcloudsolution.*` unblocked, unless you accept the breakage.
- Blocking update hosts stops security patches. Samsung's USB update route is the offline alternative. — [Samsung USB update](https://www.samsung.com/lb/support/tv-audio-video/how-to-update-the-samsung-tvs-firmware-using-a-usb-drive/)
- Router rule worth adding in any case: DNAT all LAN UDP/TCP 53 not addressed to the Pi-hole back to the Pi-hole, and block outbound 853.

### Gaps
- No primary capture shows a current Samsung TV using DoH or falling back to hard-coded IPs. The 8.8.8.8 claim rests on one secondary guide.
- No source says whether Netflix, YouTube or Disney+ on Tizen depend on any Samsung domain beyond time and auth.
- No source documents a "no internet" warning triggered by DNS blocking alone.

## 3. Options compared: Pi-hole, AdGuard Home, NextDNS, router rules, IoT VLAN, LAN-only, allowlist

### Takeaway
DNS blocking (Pi-hole, AdGuard Home, NextDNS) is easy but leaky, and needs a port 53 redirect to cover hardcoded DNS. A VLAN or per-device rule that blocks the internet entirely is the only option that stops all traffic. An allowlist for one streaming service is possible but fragile.

### Cited Findings
- How-To Geek ranks the options: a firewall redirect (needs a capable router or OpenWrt); opting out of ACR (helps but is not complete); keeping the TV offline (the "easiest full solution", but loses smart features and updates); and an external streamer with the TV used as a plain display. The author uses the last one. — [How-To Geek, Sept 2026](https://www.howtogeek.com/pi-hole-wont-stop-your-smart-tv-from-spying-heres-what-actually-works/)
- The IMC 2024 study found that opting out of "viewing information services" removed all traffic to the ACR domains and no new ACR domains appeared, so the opt-out works for ACR. — [IMC 2024](https://arxiv.org/html/2409.06203v1)
- How-To Geek, citing Gamers Nexus (LG-focused), says that opting out sends a final data snapshot and that telemetry continues with ACR off. These claims concern LG, and LG disputes some of them. — [How-To Geek](https://www.howtogeek.com/pi-hole-wont-stop-your-smart-tv-from-spying-heres-what-actually-works/)
- Context: Samsung settled with the Texas AG in Feb 2026 and agreed to stop collecting Texans' ACR data without express consent and to ship clearer consent screens. — [BleepingComputer](https://bleepingcomputer.com/news/security/samsung-tvs-to-stop-collecting-texans-data-without-express-consent); [Malwarebytes, Mar 2026](https://www.malwarebytes.com/blog/news/2026/03/samsung-tvs-stop-spying-on-viewers-in-texas-heres-how-to-disable-acr-anywhere)

### Inferences
- Pi-hole and AdGuard Home suit people with a spare box. NextDNS needs no hardware but its built-in Samsung toggle is weak (see section 1). All three fail open if the TV bypasses DNS.
- An IoT VLAN or guest network with internet blocked keeps AirPlay, casting and SmartThings working only if the router passes mDNS/SSDP across networks. Putting the phone on the same isolated network is simpler.
- An allowlist that permits only, say, Netflix CDNs is fragile because CDNs change IPs. No source tests it on Samsung.

### Gaps
- No head-to-head test of these options on a Samsung TV was found.
- No source covered keeping SmartThings local control working on a blocked TV.

## 4. Running fully offline, and other ways the TV could get online

### Takeaway
Fully offline is the strongest option, and an external streamer then carries the apps. No reliable source in this search covered offline nags, Game Mode/ALLM, or side channels (open Wi-Fi, Bluetooth via phones, Matter/Thread) for Samsung.

### Cited Findings
- How-To Geek says ACR runs even on HDMI input, so a "dumb display" setup still needs the TV kept offline or ACR switched off. It also reports (from Gamers Nexus, LG) that a TV may upload stored data when reconnected, so offline must be permanent. — [How-To Geek](https://www.howtogeek.com/pi-hole-wont-stop-your-smart-tv-from-spying-heres-what-actually-works/)
- IMC 2024 confirms ACR traffic during HDMI input (laptop or console) on Samsung, among the highest volumes of any scenario. — [IMC 2024](https://arxiv.org/html/2409.06203v1)
- When the TV is offline, the SmartThings app shows it as offline. — [Samsung Canada support](https://www.samsung.com/ca/support/tv-audio-video/samsung-tv-is-offline-in-the-smartthings-app/)
- Firmware can be installed by USB from Samsung's support site. — [Samsung support](https://www.samsung.com/lb/support/tv-audio-video/how-to-update-the-samsung-tvs-firmware-using-a-usb-drive/)

### Inferences
- HDMI, eARC, CEC, Game Mode and ALLM are HDMI-level features and should not need a network connection, but no source in this search confirms this.
- An external streamer moves tracking to that platform (Roku, Google, Amazon, Apple); the Mon(IoT)r IMC 2019 study found smart TVs and streamers contacting Netflix, Google and Amazon even without accounts. — [APNIC blog on IMC 2019](https://blog.apnic.net/2019/11/22/how-consumer-iot-devices-expose-information/) (old, 2019)

### Gaps
- No source found on: offline nag screens on Tizen; auto-joining open Wi-Fi; relaying data through nearby Samsung phones over Bluetooth; Matter/Thread on Samsung TVs as a path out; Samsung's terms and the features lost when declining them. These need another search or the on-TV-settings researcher.

## 5. How to check it worked

### Takeaway
Capture the TV's traffic before and after. Look for the ACR domains in DNS logs, then confirm at packet level (Wireshark or a router capture) that no connections go to those hosts or to outside DNS servers. A Samsung TV with ACR on talks to its ACR host about once a minute, so a 10-minute capture while watching an HDMI input is enough to show a difference.

### Cited Findings
- IMC 2024 setup: TV on a dedicated Wi-Fi access point (a server with a wired uplink), traffic captured with Mon(IoT)r, smart plugs to power-cycle, one-hour runs, encrypted traffic not decrypted. ACR domains were found from DNS in the seconds after power-on. — [IMC 2024](https://arxiv.org/html/2409.06203v1)
- Baseline: Samsung's `acr-eu-prd` host is contacted about once a minute, with peaks every ~5 minutes on linear TV and HDMI. One hour of UK linear TV sent about 441 KB to Samsung's ACR host (LG: ~4,760 KB). Vendor docs cited say Samsung captures a frame every 500 ms. — [IMC 2024](https://arxiv.org/html/2409.06203v1)
- The UC3M press release puts it as Samsung sending data every minute, LG every 15 seconds. — [EurekAlert / UC3M release](https://e3.eurekalert.org/news-releases/1067715)
- A Pi-hole log can look clean while a TV with hardcoded DNS still reaches the internet, so DNS logs alone do not prove blocking. — [How-To Geek](https://www.howtogeek.com/pi-hole-wont-stop-your-smart-tv-from-spying-heres-what-actually-works/)

### Inferences
- Practical test: (1) in Pi-hole or AdGuard Home, filter the query log by the TV's IP and note queries to `samsungacr.com`, `samsungcloud.tv` and `samsungads.com` over 30 minutes of HDMI use; (2) apply blocks; (3) repeat and check those show as blocked; (4) on OpenWrt or GL.iNet run `tcpdump -i br-lan host <TV-IP>` (or bridge the TV through macOS Internet Sharing and capture the bridge interface in Wireshark) and filter `dns && ip.dst != <pihole>`, `tcp.port==853` and TLS SNI containing "acr" to catch bypasses.
- Expected success: zero TLS sessions to `acr-*-prd.samsungcloud.tv` with no "acr" SNI, and no DNS to outside resolvers.
- MITM decryption is unlikely to work, because Tizen apps should reject a user-installed CA. No source confirms this either way.

### Gaps
- No published byte count for a Samsung TV's total traffic per day (ACR plus everything else) was found. The 441 KB/hour figure covers only the ACR host in the UK study.
