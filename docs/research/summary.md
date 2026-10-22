# Turn off ACR, then keep the TV offline

**Short answer.** The most effective thing a Samsung TV owner can do takes about ten minutes. Open Privacy Choices (or Terms & Privacy on older sets) and turn off **Viewing Information Services** and **Interest-Based Advertisements**. An independent academic study found that once those were off, the TV sent **no traffic at all to Samsung's ACR servers**, in the UK and the US ([Anselmi et al., IMC 2024](https://arxiv.org/html/2409.06203v1)). That opt-out does not stop the rest of the TV's traffic (ads, logs, app store, updates). The only way to stop all of it is to keep the TV off the internet for good and stream from an external box. Watch out for this: **ACR also fingerprints what comes in over HDMI**, so adding a streaming box does nothing for privacy unless the TV is also offline or has ACR turned off ([IMC 2024](https://arxiv.org/html/2409.06203v1)). DNS blocking with Pi-hole, AdGuard Home or NextDNS sits in between. It works for the known ACR and ad domains, but it leaks unless the router forces all DNS through the blocker, and broad blocks break apps, Samsung TV Plus and the clock. For RAM, an owner cannot see or kill processes on a retail TV. Developer Mode does not open a shell, and preinstalled apps cannot be removed. The levers that remain are turning off Smart Hub autostart, running Device Care, and cold-booting the set. Firmware updates fix real security holes but also bring larger home-screen ads, so the sensible path is to keep updating and recheck privacy settings after each update. Legally, Samsung settled with Texas in February 2026 and agreed to ask for express consent, but that applies **only to Texans**. Everyone else relies on the TV settings plus Samsung's US privacy-rights portal.

Tags used below: *(single source)* means one source only; *(forum report)* means user posts, not tested; *(search summary)* means the original page was not read in full; *(inference)* means reasoning from the evidence, not a cited fact.

## Two toggles do the real work, and the menu moved in 2022

Samsung calls its ACR (automatic content recognition) "**Viewing Information Services**" (VIS). Its US FAQ says ACR "generates signatures" of what is on screen and collects viewing history, the TV's Personalized Service ID (PSID) and the IP address. It runs only if the owner opted in at setup or later in Settings. Samsung gives no menu path beyond "Settings menu" ([Samsung US ACR FAQ](https://www.samsung.com/us/support/answer/ANS10010616/)). Samsung's Australian ads notice says viewing history feeds ads only when **both** VIS and Interest-Based Advertisement Services are on ([Samsung AU Ads privacy](https://www.samsung.com/au/info/ads-privacy)). So turn off both. The Texas petition complains that opting out takes "approximately 15+ clicks" across "four or more separate menus" ([Texas petition](https://www.texasattorneygeneral.gov/sites/default/files/images/press/Samsung%20TV%20Petition%20Filed.pdf)), so expect to hunt.

Samsung publishes no table of privacy menus by year. The paths below come from third-party guides for privacy items and from Samsung's own pages for start-up items. Labels vary by region and firmware.

| Model years (letter) | Privacy consents (VIS, Interest-Based Ads, Voice) | Smart Hub autostart ("Start Screen Options") |
|---|---|---|
| 2016 (K) | Settings > Support > Terms & Policy / Terms & Privacy | Settings > System > Expert Settings > Autorun Last App / Smart Hub |
| 2017–2021 (M, N, R, T, A) | Settings > Support > Terms & Privacy (older layout) | Settings > General > Smart Features |
| 2022 (B) | Settings > All Settings > General & Privacy > Terms & Privacy / Privacy Choices | Settings > All Settings > General & Privacy > Start Screen Options |
| 2023–2024 (C, D) | Same as 2022; "Support > Terms & Privacy" also reported as a second route | Settings > All Settings > General & Privacy > Start Screen Options |
| 2025 (F) and later | "Privacy Choices" in the sidebar; some guides mention "Consent State" *(search summary)* | Settings > All Settings > Advanced Features > Start Screen Options |

Sources for the privacy column: [Malwarebytes, March 2026](https://www.malwarebytes.com/blog/news/2026/03/samsung-tvs-stop-spying-on-viewers-in-texas-heres-how-to-disable-acr-anywhere) for both current paths; [Consumer Reports via TechXplore, 2020](https://techxplore.com/news/2020-01-smart-tv-spying-step-by-step.html) for the older one; Pocket-lint and [Tom's Guide](https://www.tomsguide.com/tvs/your-samsung-tv-is-watching-you-how-to-turn-off-data-collection) for 2025 labels *(search summary)*. The year split in the privacy column is *(inference)*, made by matching the year breaks in Samsung's own start-up table ([Samsung AU Start Screen Options](https://www.samsung.com/au/support/tv-audio-video/use-autorun-start-screen-options-on-your-samsung-tv/)).

In the same privacy screen, also turn off **Voice Recognition Services** ([Malwarebytes](https://www.malwarebytes.com/blog/news/2026/03/samsung-tvs-stop-spying-on-viewers-in-texas-heres-how-to-disable-acr-anywhere)). The IMC 2024 researchers also changed four more toggles ([IMC 2024](https://arxiv.org/html/2409.06203v1)). Copy them where they appear: turn **"Do not track" on**, and turn "Customization Service", "Improve personalized ads" and "Get news and special offer" off. **Reset the PSID** (the TV's ad ID) so past viewing data is no longer linked to it. Samsung says this is in the Settings menu ([Samsung AU Ads privacy](https://www.samsung.com/au/info/ads-privacy)), but no source gives the exact path. Customization Service is an account-level setting, so also opt out in your Samsung Account settings ([Samsung Account customization](https://www.samsung.com/us/account/customization-service)). Even after opting out of personalised ads, you still see ads; they are just not targeted at you ([Samsung AU Ads privacy](https://www.samsung.com/au/info/ads-privacy)).

**Power On with Mobile** (Settings > All Settings > Connections > Network > Expert Settings) lets SmartThings phones wake the TV over the network. Turn it off if you do not need that ([Samsung AU support](https://www.samsung.com/au/support/tv-audio-video/power-on-tv-smartthings-app/)). **Logging out of the Samsung account changes nothing for ACR**: the IMC study saw the same ACR traffic logged in or out ([IMC 2024](https://arxiv.org/html/2409.06203v1)).

You can decline the Smart Hub terms at setup. UK owners report that antenna and HDMI then keep working, but streaming apps stop "after a week or two" and voice needs the terms ([Samsung EU community](https://eu.community.samsung.com/t5/tv/smart-tv-ads-on-the-menu-bar/m-p/5762520/highlight/true)) *(forum report)*. Reset Smart Hub (Settings > Support > Device Care > Self Diagnosis > Reset Smart Hub) wipes apps and accounts ([Samsung CA Device Care](https://www.samsung.com/ca/support/tv-audio-video/how-to-use-the-device-care-on-my-samsung-smart-tv/)). It probably brings back the consent screens so you can decline everything again *(inference)*.

No source found confirms exact paths for diagnostics or "usage data" consents, Samsung TV Plus settings, SmartThings toggles, Instant On, or auto-update. Work from the table above and check every item under Privacy Choices.

## The opt-out stops ACR traffic but not everything else

The IMC 2024 paper (UCL, UC Davis and Universidad Carlos III) is the only independent test. With the opt-outs applied, the Samsung TV made "no communication with any previously identified ACR domain", and no new ACR domains appeared ([IMC 2024](https://arxiv.org/html/2409.06203v1)). Two limits apply. The paper does not name the TV model or firmware. And it turned off six toggles together, so it does not prove VIS alone is enough. No one has tested 2025–2026 One UI Tizen firmware, or the consent screens Samsung changed after the Texas deal.

With ACR on, the scale is clear. The TV contacts its ACR host about **once a minute**, with larger bursts every five minutes. One hour of UK antenna TV sent about **441 KB** to the main ACR host, and HDMI input sent about 205 KB. Samsung sent "up to 2X more data at a higher frequency than LG" ([IMC 2024](https://arxiv.org/html/2409.06203v1)). Three different intervals appear in the press. They measure different things:

- **500 ms** is how often the TV is alleged to *capture* frames. This comes from Samsung documentation cited by the researchers, and from the Texas petition ([Texas petition](https://www.texasattorneygeneral.gov/sites/default/files/images/press/Samsung%20TV%20Petition%20Filed.pdf)).
- **About once a minute** is how often Samsung *uploads* ([UC3M release](https://e3.eurekalert.org/news-releases/1067715)).
- **"Every 15 seconds"** comes from Italian coverage ([money.it](https://www.money.it/la-smart-tv-spia-lg-samsung-condividono-screenshot-del-schermo-ogni-15-secondi)). It matches LG's interval in the university release, so it is probably misreported *(inference)*.

The 2019 Mon(IoT)r study found Samsung TVs contacting Netflix even with no Netflix account ([Gigazine summary](https://www.gigazine.net/gsc_news/en/20190919-smart-tv-send-private-data)) *(single source, press summary of an old study)*. So expect background traffic to continue after the opt-out.

## DNS blocking works for ACR and ads, and breaks things if you block too much

These are the measured ACR hosts:

- **US:** `acr-us-prd.samsungcloud.tv`, `log-config.samsungacr.com` and `log-ingestion.samsungacr.com`.
- **UK:** the same set, with `acr-eu-prd.samsungcloud.tv` and `log-ingestion-eu.samsungacr.com` in place of the US hosts, plus `acr0.samsungcloudsolution.com` ([IMC 2024](https://arxiv.org/html/2409.06203v1)).

The researchers found these by looking for "acr" in DNS names, so a host without "acr" in its name could have been missed. HaGeZi's Samsung list (version 2026.1002, the only list in this set kept up to date in 2026) covers all regional `acr-*-prd` hosts. It also blocks the whole of `samsungacr.com`, `samsungads.com`, `samsungadhub.com` and `samsungtvads.com`, plus log and error-dump hosts ([HaGeZi native.samsung](https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/native.samsung-onlydomains.txt)).

| Tier | Domains | What happens |
|---|---|---|
| Block (safe) | `samsungacr.com`; `acr-*-prd.samsungcloud.tv`; `acr0.samsungcloudsolution.com`; `samsungads.com`; `samsungadhub.com`; `samsungtvads.com`; `devicelog.samsungcloudsolution.net`; `prderrordump*` | Stops ACR, ad and log traffic. No breakage reported *(inference from list contents and IMC)* |
| Leave open unless you accept loss | `time.samsungcloudsolution.com` | Clock drifts; Plex, YouTube and Prime Video stopped on some sets ([hkamran80 gist](https://gist.github.com/hkamran80/779019103fcd306979411d44c8d38459)) *(search summary)* |
| Leave open unless you accept loss | `otnprd*.samsungcloudsolution.net`, `samsungotn.net` | Firmware updates over the internet stop; USB updates still work ([Perflyst](https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt); [Samsung USB update](https://www.samsung.com/lb/support/tv-audio-video/how-to-update-the-samsung-tvs-firmware-using-a-usb-drive/)) |
| Leave open unless you accept loss | `osb-apps-v2.samsungqbe.com`, `auth.samsungosp.com` | App store and sign-in ([marq24](https://raw.githubusercontent.com/marq24/pihole-blocklist/master/samsung-smart-tv.txt)) |
| Do not block | Whole `samsungcloudsolution.com/.net`; whole `samsungcloud.tv` | Broke Samsung apps, TV Plus and SmartThings ([wassname gist](https://gist.github.com/wassname/b594c63222f9e4c83ea23c818440901b)) *(search summary)*; TV Plus logos sit on `samsungcloud.tv` *(inference)* |

Perflyst's list dates from July 2023, and it marks the "leave open" hosts as risky by commenting them out. The marq24 list is undated and blocks them anyway, with a warning that updates and services may stop ([Perflyst](https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt); [marq24](https://raw.githubusercontent.com/marq24/pihole-blocklist/master/samsung-smart-tv.txt)). Breakage is not always visible in the logs. In one Pi-hole thread, apps would not open even though nothing showed as blocked ([Pi-hole Discourse](https://discourse.pi-hole.net/t/samsung-tv-apps-wont-open-with-pihole-on/29621)).

**NextDNS users note:** its built-in "Samsung" native-tracking option holds only four domains and has not changed since 2022. They are phone and Knox analytics hosts, not the TV's ACR hosts ([nextdns/native-tracking-domains](https://raw.githubusercontent.com/nextdns/native-tracking-domains/main/domains/samsung)). Add HaGeZi's Samsung list or your own deny entries instead.

**DNS blocking only sees queries sent to it.** A device hard-coded to 8.8.8.8 bypasses the blocker while the log looks clean. A router rule that redirects all port-53 traffic to the blocker fixes plain DNS. It does not stop DNS-over-HTTPS, and blocking that takes firewall rules that can break smart features ([How-To Geek, Sept 2026](https://www.howtogeek.com/pi-hole-wont-stop-your-smart-tv-from-spying-heres-what-actually-works/)). Samsung TVs specifically using 8.8.8.8 rests on one guide ([edwardangert.com](https://edwardangert.com/docs/pi-hole/network-level-blocking/)) *(single source)*. No capture shows a current Samsung TV using DoH. Add the port-53 redirect and block outbound port 853 anyway; it costs nothing. The IMC authors cite earlier work that found DNS blocklists weak against smart-TV tracking ([IMC 2024](https://arxiv.org/html/2409.06203v1)). Treat DNS blocking as a second layer behind the settings, not a replacement for them.

## Offline plus an external box is the only full stop

How-To Geek ranks keeping the TV offline as the "easiest full solution". The author uses an external streamer and treats the TV as a plain display ([How-To Geek](https://www.howtogeek.com/pi-hole-wont-stop-your-smart-tv-from-spying-heres-what-actually-works/)). Three rules make it work. First, **the TV must stay offline**. ACR runs on HDMI input, and HDMI produced some of the highest ACR volumes in the study ([IMC 2024](https://arxiv.org/html/2409.06203v1)). Second, **offline must be permanent**. There are reports that a TV uploads stored data when it reconnects, but those concern LG ([How-To Geek](https://www.howtogeek.com/pi-hole-wont-stop-your-smart-tv-from-spying-heres-what-actually-works/)) *(single source, not Samsung)*. So turn VIS off first anyway, in case the TV is ever reconnected. To go offline, forget the Wi-Fi network and unplug Ethernet. Blocking the TV at the router also works. No source tested whether a Samsung TV joins open Wi-Fi networks by itself. Third, **the box brings its own tracking**. Roku, Google, Amazon and Apple each collect data on their platform, and the 2019 Mon(IoT)r work found streamers contacting Netflix, Google and Amazon without accounts ([APNIC on IMC 2019](https://blog.apnic.net/2019/11/22/how-consumer-iot-devices-expose-information/)) *(old, 2019)*.

An owner who kept the TV offline found the menus and channel changes faster ([Samsung EU community](https://eu.community.samsung.com/t5/tv/smart-tv-ads-on-the-menu-bar/m-p/5762520/highlight/true)) *(forum report)*. Offline, the TV shows as offline in SmartThings ([Samsung CA](https://www.samsung.com/ca/support/tv-audio-video/samsung-tv-is-offline-in-the-smartthings-app/)). You lose SmartThings control, casting to the TV, voice and the TV's own apps. HDMI-CEC, eARC, Game Mode and ALLM run over HDMI and should keep working, but no source confirms this *(inference)*. For updates, download the firmware from Samsung's support site and install it from USB ([Samsung USB update](https://www.samsung.com/lb/support/tv-audio-video/how-to-update-the-samsung-tvs-firmware-using-a-usb-drive/)).

A middle path is to put the TV on its own VLAN or guest network with internet blocked. Casting and SmartThings then work only if the router passes mDNS/SSDP between networks, or if the phone joins the same network *(inference)*. No source has tested this on a Samsung set.

## Owners cannot see or kill processes; three things help RAM

**Samsung publishes no RAM figures.** The usual numbers come from a 2021 forum moderator and a low-quality guide, not from spec sheets *(single source each)*:

- 1.5 GB on a 2020 Crystal UHD ([Samsung Community TR](https://r2.community.samsung.com/t5/TV/UE55TU7000UXTK-TV-BELLEK-SORUNU/td-p/6633832)).
- 2 GB on 2021 QN60A–QN75A and 3 GB on the QN80A ([automatelife.net](https://automatelife.net/how-to-add-memory-to-samsung-smart-tv/)).

The RAM is soldered to the board. Samsung itself blames slowness on memory: running several apps "consumes memory", and cache build-up slows menus ([Samsung AE performance page](https://www.samsung.com/ae/support/tv-audio-video/how-to-enhance-the-performance-on-your-samsung-tv)). No one has measured how much RAM Smart Hub, TV Plus, ACR, Bixby, SmartThings or Ambient uses. Treat any figure you see as made up.

**Developer Mode is not a task manager.** You turn it on by entering 12345 in Apps, switching Developer mode on, entering your PC's IP address and rebooting. It lets you install and debug your own signed apps from Tizen Studio ([Samsung Developers](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html)). On retail firmware, developers report that `sdb shell` returns "closed", `sdb root on` is denied, and the capability output shows `sdbd_rootperm:disabled` ([Samsung Developers forum](https://forum.developer.samsung.com/t/samsung-tizen-smart-tv-command-smart-development-bridge-sdb-shell-command-returns-status-is-closed-how-to-enable-it/19987)) *(forum report, search summary)*. A 2023 QN90 owner could not connect over sdb at all ([forum](https://forum.developer.samsung.com/t/unable-to-connect-via-sdb-on-qn65qn90dafxza-with-developer-mode-enable/39639)) *(forum report)*. The menu has no switch to turn it off again ([forum](https://forum.developer.samsung.com/t/how-do-i-disable-developer-mode/25104)) *(forum report)*, and it opens an extra network port ([Champlain summary of F-Secure work](https://leahycenterblog.champlain.edu/?p=739)). Use it only to run an app you built yourself.

**Preinstalled apps cannot be deleted** ([Samsung UK Device Care](https://www.samsung.com/uk/support/tv-audio-video/how-to-device-care)). From the Home screen you can hide them, and you can disable Samsung TV Plus there. Disabling it removes its channels and viewing history, and adding any TV Plus channel back brings it back ([Pointerclicker](https://pointerclicker.com/remove-samsung-tv-app/)) *(single source)*. The code stays installed.

Three steps help, all documented by Samsung:

1. **Turn off Smart Hub autostart.** Switch off "Start with Smart Hub Home", "Autorun Last App" and the Multi View autoruns, using the paths in the first table ([Samsung AU](https://www.samsung.com/au/support/tv-audio-video/use-autorun-start-screen-options-on-your-samsung-tv/)). The TV then opens to its input instead of loading Smart Hub at power-on. This is the most likely lasting gain *(inference)*.
2. **Run Device Care.** Go to Settings > Support > Device Care > Start Device Care. The scan "clears the cached memory… and closes unused background apps". Manage Storage clears the cache of any single app ([Samsung CA](https://www.samsung.com/ca/support/tv-audio-video/how-to-use-the-device-care-on-my-samsung-smart-tv/)).
3. **Cold boot.** Hold the remote's Power button until the TV restarts, or unplug it for 30 seconds ([Samsung US](https://www.samsung.com/us/support/answer/ANS00062957)). On The Frame and some 2025 models, holding Power switches to Art mode instead, so unplug those sets ([Technobezz](https://www.technobezz.com/how-to-restart-a-samsung-tv)).

Steps 2 and 3 only last until services reload. Instant On keeps the TV suspended rather than off, so turning it off would make every start a cold boot, but no Samsung page documents this *(inference)*.

## Service menus and rooting cost more than they give

The factory service menu, opened from standby with key sequences such as Info, Menu, Mute, Power, is meant for technicians. It sets panel, board and region options. It has no controls for processes, memory or privacy. Wrong changes can brick the set or spoil the panel calibration, and Samsung warns that using it may void the warranty ([Logicity](https://logicity.in/en/blog/5-things-samsung-tv-s-secret-service-menu-can-actually-do); [SamyGO](https://forum.samygo.tv/viewtopic.php?p=109549)) *(secondary sources)*. Hotel (Hospitality) mode locks guests out of settings. It does not add privacy or speed ([Travel Season](https://travelseason.com/hotels/unlock-hotel-tv-hospitality-mode/)).

No public root method works on current sets. SamyGO's working methods cover roughly 2010–2014 series, plus an effort on the 2016 K series. For R-series and newer sets there is only research ([SamyGO](https://forum.samygo.tv/viewtopic.php?p=23188); [SamyGO R-series](https://forum.samygo.tv/viewtopic.php?p=109913)). CALIF's April 2026 write-up rooted an older KantS2-platform set through a world-writable driver. It started from code execution they already had in the browser ([CALIF](https://blog.calif.io/i/194088814/the-goal)). That shows how weak the old kernels are, which is an argument for installing updates, not for rooting.

## Firmware updates trade security for more ads

In August 2024 Samsung promised seven years of Tizen upgrades, including security fixes. The promise covers models from 2024 and some 2023 models, and Samsung has published no full model list ([Android Authority](https://androidauthority.com/samsung-tizen-seven-years-3475592); [TechRadar](https://www.techradar.com/televisions/samsung-promises-free-updates-for-its-tvs-for-7-years-fixing-one-of-their-biggest-issues)). Updates also change the home screen:

- Tizen 9.0 enlarged the ad banner ([Techbook](https://www.techbook.de/home-entertainment/tv-geraete/samsung-tvs-tizen-9-0)).
- A 2025 Q6F owner found no way to turn off promotional previews ([Samsung US Community](https://us.community.samsung.com/t5/QLED-and-The-Frame-TVs/2025-Samsung-Q6F-No-Option-to-Disable-Home-Screen-Promotional/td-p/3417316)) *(forum report)*.
- Samsung is ending the Ambient service after 1 August 2026 and moving its content to the paid Art Store ([Canaltech](https://canaltech.com.br/tv/tvs-da-samsung-vao-perder-modo-ambiente-veja-o-que-muda-na-sua)) *(single source)*.

Screensaver ads are an LG practice; no source found Samsung doing it. Turning off auto-update does not remove home-screen ads, because they come from Samsung's servers *(inference)*.

The choice depends on how the TV connects. **An online TV should take updates**, because its old kernels, drivers and browser engine face the network. Recheck Privacy Choices after each update. No source proves that updates reset privacy settings, but nothing rules it out. **A permanently offline TV** can skip updates, because the risk updates fix arrives over the network *(inference)*.

## Texas got a consent rule; everyone else gets a portal

Texas sued Samsung in December 2025 under its consumer-protection law (DTPA). The petition alleges capture of screen and audio "every 500 milliseconds", a one-click opt-in, and a 15-plus-click opt-out ([Texas petition](https://www.texasattorneygeneral.gov/sites/default/files/images/press/Samsung%20TV%20Petition%20Filed.pdf)). On **26 February 2026** Samsung agreed to "halt any collection or processing of ACR viewing data without obtaining Texas consumers' express consent" and to ship clear consent screens. The press release states no fine ([Texas AG](https://www.texasattorneygeneral.gov/news/releases/attorney-general-paxton-secures-major-agreement-samsung-ensure-texans-are-protected-smart-tvs)). The deal covers **Texans only** ([Privacy Guides](https://www.privacyguides.org/news/2026/03/02/samsung-forced-to-halt-data-collection-in-tvs-in-texas-without-express-consent/)). Samsung says its TVs "do not spy on customers" ([The Record](https://therecord.media/samsung-updates-acr-privacy-practices-texas)). LG settled on 11 May 2026 on similar terms. The cases against Sony, Hisense and TCL were still open at last report ([Texas AG on LG](https://www.texasattorneygeneral.gov/news/releases/attorney-general-ken-paxton-secures-major-agreement-lg-protect-texans-privacy-and-stop-data-being)).

Two private class actions are pending, and neither has a ruling yet:

- **DiGiacinto v. Samsung**, S.D.N.Y., filed January 2026 ([CourtListener](https://www.courtlistener.com/docket/72125777/digiacinto-v-samsung-electronics-america-inc/)).
- **Tillery v. Samsung**, N.D. Cal., filed 6 October 2026 ([ClaimDepot](https://www.claimdepot.com/cases/samsung-smart-tv-lawsuit-alleges-secret-acr-surveillance-of-73-million-viewers)).

The federal benchmark is still the FTC's 2017 order against Vizio: $2.2 million, plus affirmative express consent for ACR ([FTC](https://www.ftc.gov/node/45163)). Samsung's voice data went to a third party, Nuance, in 2015. Samsung says voice is collected only when you press the mic button ([Samsung newsroom](https://news.samsung.com/us/?p=290)).

Owners in the roughly 20 US states with privacy laws can use Samsung's **US Privacy Rights Portal** ([samsung.com/us/privacy/rights](https://www.samsung.com/us/privacy/rights/)) or call 1-800-SAMSUNG. Through it they can opt out of sale, sharing and targeted ads, and ask for access to or deletion of their data. Samsung's own policy says sharing through automated tools "may be considered a 'sale'" ([Samsung US Privacy Policy](https://www.samsung.com/us/account/privacy-policy/)). Global Privacy Control applies only to Samsung.com in a browser, not to the TV. Expect thin answers: UCL researchers found Samsung's GDPR access responses vague ([UCL](https://www.ucl.ac.uk/news/2024/nov/smart-tv-tracking-raises-privacy-concerns/)). Whether the portal links a request to a specific TV is unconfirmed.

## Prove it with a before-and-after capture

DNS logs alone prove nothing, because a TV that bypasses the blocker leaves a clean log ([How-To Geek](https://www.howtogeek.com/pi-hole-wont-stop-your-smart-tv-from-spying-heres-what-actually-works/)). This test follows the IMC method and is adapted for home use *(inference)*:

1. Give the TV a fixed IP address.
2. Watch an HDMI input or antenna for 30 minutes with ACR still on. In the Pi-hole or AdGuard Home log for that IP, note queries to `samsungacr.com`, `samsungcloud.tv` and `samsungads.com`. With ACR on, some queries should appear. Expect fewer than one a minute, because the blocker logs a query only when its cached answer expires.
3. Turn off the settings and add the blocks, then repeat step 2.
4. Capture at packet level on the router (`tcpdump -i br-lan host <TV-IP>` on OpenWrt) or through a Mac's Internet Sharing bridge in Wireshark. Check three things: DNS going anywhere except your blocker, traffic on port 853, and TLS server names containing "acr". With ACR on, the TV connects to its ACR host about once a minute ([IMC 2024](https://arxiv.org/html/2409.06203v1)), so a 10-minute capture shows the difference.

Success means no TLS sessions to `acr-*-prd.samsungcloud.tv` and no DNS to outside resolvers. Do not try to decrypt the traffic. The IMC team did not, and it is not needed to see the destinations.

## Decision guide

1. **Everyone, today (about 10 minutes):** turn off VIS, Interest-Based Ads, Voice Recognition and the other Privacy Choices items. Reset the PSID. Turn off Customization Service in your Samsung Account. Turn off Start with Smart Hub Home and Autorun Last App. Run Device Care.
2. **You use the TV's own apps and own a Pi-hole, AdGuard Home or a capable router:** add the "Block (safe)" tier and the port-53 redirect, then run the capture test. Keep updates on.
3. **You already use a streaming box and want the most privacy:** do step 1 first, then take the TV offline for good. Update by USB once or twice a year, or not at all. Accept losing SmartThings, casting and voice.
4. **You need SmartThings or casting but want less tracking:** use step 2, or an isolated VLAN with mDNS passed through. Expect some trial and error.
5. **US resident in a state with a privacy law:** also file an opt-out of sale and sharing through samsung.com/us/privacy/rights.
6. **Skip these:** the service menu, rooting, Hospitality mode, Developer Mode for "cleanup", and blocking the whole `samsungcloudsolution` domain.

## What we need to know about your TV

- **Model code.** It is on the sticker on the back, and in the menu under Settings > All Settings > Support > About This TV ([Samsung AU](https://www.samsung.com/au/support/tv-audio-video/what-model-year-is-your-samsung-tv); [Samsung US](https://www.samsung.com/us/support/answer/ANS10006944/)). Send the full code, for example QN65Q80CAFXZA or UN55TU7000FXZA.
- **Year letter.** Find it with Samsung's tables ([Samsung AU](https://www.samsung.com/au/support/tv-audio-video/what-model-year-is-your-samsung-tv); [Samsung US](https://www.samsung.com/us/support/answer/ANS10006944/)).
  - The letter follows the series number: QN90**D**, Q80**C**, S90**F**.
  - On Crystal UHD models up to 2024 it comes before "U": **T**U7000, **C**U8000, **D**U7000. From 2025 it follows the number on every line: U8500**F**, U8000**H**.
  - The letters, newest first: 2026 H, 2025 F, 2024 D, 2023 C, 2022 B, 2021 A, 2020 T, 2019 R, 2018 N, 2017 M, 2016 K, 2015 J. The 2026 letter comes only from Samsung's Australian page; the US page stops at 2021 *(single source)*.
  - **Some letters repeat.** H also meant 2014, and F, D and C meant 2013, 2011 and 2010. Those old codes put the letter at the front (UA**F**8000, UA**H**U9000), so where the letter sits tells you the year.
  - The ending tells the region: **FXZA** for US (the F marks the US/Canada tuner), **XU** for UK/EU.
- **Software version and OS.** Settings > Support > Software Update, or About This TV. Note whether it says Tizen 9 or One UI Tizen.
- **Where you live.** State or country decides whether the Texas consent screens apply and which privacy-law rights you have.
- **How you watch.** Built-in apps, or an external box (which one)?
- **What you need to keep.** SmartThings, voice, AirPlay or casting, Samsung TV Plus, Art mode? Is it a Frame?
- **Your network.** Do you have a Pi-hole, AdGuard Home or NextDNS? Can your router redirect port 53 or run a separate VLAN (OpenWrt, UniFi, GL.iNet, Eero)?
