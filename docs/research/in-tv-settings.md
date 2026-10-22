# Samsung TV (Tizen) on-TV privacy, data-sharing and background-activity settings, 2016-2026

Research date: 2026-10-15. About 23 tool calls. Samsung's US support site has no single page that lists privacy menu paths by model year, so most per-year privacy paths come from third-party guides. Per-year paths for Start Screen / Autorun come from Samsung's own support pages. Sources disagree on labels; those conflicts are noted.

## What each privacy setting is, and where it lives by model year

### Takeaway
Samsung's ACR is called "Viewing Information Services" (VIS). It sits with "Interest-Based Advertisement(s)" and other consents under Terms & Privacy, which became "Privacy Choices" on newer sets. Before 2022 the path is Settings > Support > Terms & Privacy (or Terms & Policy). From 2022 it is Settings > All Settings > General & Privacy > Terms & Privacy / Privacy Choices. Samsung itself publishes no per-year privacy menu table; it says only "Settings menu".

### Cited Findings
**Viewing Information Services (ACR)**
- Samsung's official ACR FAQ (US) says ACR "generates signatures" covering viewing history (programs viewed, time spent), Smart TV identifiers including the Personalized Service ID (PSID), and IP address. It says Samsung "does not record or watch any of the content displayed". ACR runs only if the user opted in to the Viewing Information Services notice at setup or later turned it on in Settings. The FAQ gives no menu path, only "Settings menu". It also contradicts itself on scope: ACR is on "certain Samsung Smart TVs" in one answer and "All Smart TVs manufactured by Samsung" in another — [Samsung US support ANS10010616](https://www.samsung.com/us/support/answer/ANS10010616/)
- Samsung Ads notice (Australia, effective 1 April 2021): Samsung collects viewing history (networks, channels, websites visited, programs, time spent) only if the user agreed to BOTH "Interest-Based Advertisement Services" and "Viewing Information Services". It "may use automatic content recognition ('ACR') and other technologies". Users can opt out "by accessing the Privacy Choices app or the Settings menu" — [Samsung AU Ads privacy](https://www.samsung.com/au/info/ads-privacy)
- In the IMC 2024 paper, the Samsung toggles the researchers used were: "I consent to viewing information services on this device", "I consent to interest-Based advertisements", "Customization Service", "Do not track" (enable), "Improve personalized ads", and "Get news and special offer". VIS was the toggle that specifically disabled ACR — [Anselmi et al., arXiv 2409.06203](https://arxiv.org/html/2409.06203v1)

**Menu paths reported by year (privacy consents)**
- Path 1: Home > Settings > Support > Terms & Privacy > Privacy Choices. Path 2: Home > Settings > All Settings > General & Privacy > Terms & Privacy / Privacy Choices. Under these, turn off Viewing Information Services, Interest-Based Advertising and Voice Recognition Services. Menu names "may vary by model and year" — [Malwarebytes, March 2026](https://www.malwarebytes.com/blog/news/2026/03/samsung-tvs-stop-spying-on-viewers-in-texas-heres-how-to-disable-acr-anywhere)
- Pocket-lint (June 2026), as quoted in search results: Home > Settings > All Settings > General & Privacy > Privacy Choices ("on older sets, this may be labeled Terms & Privacy instead") > Viewing Information Services > Off > OK — via [Techwalla / search summary](https://www.techwalla.com/13780231/how-to-disable-acr-on-your-tv-samsung-sony-more). This is secondary; I did not fetch Pocket-lint's original.
- Older layout: Settings > Support > Terms & Policy (or Terms & Privacy) > Viewing Information Services; uncheck it, then uncheck "Interest-Based Advertisements Services U.S. Privacy Notice" below it and confirm with OK. This matches Consumer Reports' 2020-era step-by-step guide — [TechXplore / CR reprint 2020](https://techxplore.com/news/2020-01-smart-tv-spying-step-by-step.html); [Hackernoon](https://hackernoon.com/how-to-stop-your-tv-from-watching-you)
- Labels differ on 2025-2026 sets: one guide has "Privacy Choices" in the left sidebar with "Terms & Conditions, Privacy Policy" as a sub-item; another mentions "Consent State". The privacy screen can also look different if initial setup or the region setting was never completed — search summary of [Tom's Guide](https://www.tomsguide.com/tvs/your-samsung-tv-is-watching-you-how-to-turn-off-data-collection) and others. The Tom's Guide page came back truncated when fetched, so this is unverified.

**Interest-Based Ads / PSID / Customization Service**
- Smart TVs use a resettable ad ID called the PSID, which "you can reset… at any time through the Settings menu". The privacy notices also mention an "Opt out of Ads Personalization" choice — [Samsung Ads privacy (US)](https://www.samsung.com/us/account/privacy-policy/samsungads); [Samsung AU Ads privacy](https://www.samsung.com/au/info/ads-privacy)
- After "Reset PSID", viewing history and usage data are no longer linked to the old PSID or its TIFA (Tizen Identifier for Advertising). After opting out of Customised Ads, you still get non-customised ads based on general location and inferred data — [Samsung AU Ads privacy](https://www.samsung.com/au/info/ads-privacy)
- The current US Privacy Policy (effective 20 July 2026) lists "Personalized Service ID and Tizen Identifier for Advertising" as TV identifiers and mentions "feature-specific choices" such as voice recognition. It gives no TV menu paths — [Samsung US Privacy Policy](https://www.samsung.com/us/account/privacy-policy/SamsungAds)
- The Customization Service is a Samsung Account-level service, so its ad-use opt-out lives in Samsung Account settings, not only on the TV — [Customization Service US Privacy Notice](https://terms.account.samsung.com/contents/legal/us/en/customizedservicecontent.html); [Samsung Account customization page](https://www.samsung.com/us/account/customization-service)
- In the US, opting out of Personalized Ads "may not prevent the delivery of all advertisements from Samsung" — search summary of Samsung Ads US notice ([link](https://www.samsung.com/us/account/privacy-policy/SamsungAds))

**Voice Recognition / Bixby**
- Voice Recognition Services is a separate consent under Privacy Choices / Terms & Privacy — [Malwarebytes](https://www.malwarebytes.com/blog/news/2026/03/samsung-tvs-stop-spying-on-viewers-in-texas-heres-how-to-disable-acr-anywhere)
- On a 2022-era set (UK), pressing the voice button without having agreed prompts: "You need to agree to the Terms and Conditions before using voice interaction" — [Samsung EU community thread](https://eu.community.samsung.com/t5/tv/smart-tv-ads-on-the-menu-bar/m-p/5762520/highlight/true)

**Smart Hub auto-run / Start with Smart Hub / Autorun Last App (Samsung official, Australian page)**
| Model year | Path |
|---|---|
| 2025 | Settings > All Settings > Advanced Features > Start Screen Options |
| 2023-2024 | Settings > All Settings > General & Privacy > Start Screen Options |
| 2022 | Menu > Settings > All Settings > General & Privacy > Start Screen Options |
| 2017-2021 | Settings > General > Smart Features |
| 2016 | Settings > System > Expert Settings > Autorun Last App / Smart Hub |
| 2015 | Menu > Smart Hub > Auto-start Settings |
Options: "Start with Smart Hub Home" (off shows the last source at power-on), "Autorun Last App" (may not work with every app), "Autorun Multi View Mirroring", "Autorun Multi View Casting" — [Samsung AU support](https://www.samsung.com/au/support/tv-audio-video/use-autorun-start-screen-options-on-your-samsung-tv/); same content at [Samsung AE](https://www.samsung.com/ae/support/tv-audio-video/use-autorun-start-screen-options-on-your-samsung-tv/)
- Turning off Autorun Smart Hub shows the current input banner at power-on instead of Smart Hub, and takes effect after a power cycle — search summary of [Samsung AE Smart Hub on/off page](https://www.samsung.com/ae/support/tv-audio-video/how-to-activate-or-deactivate-the-smart-hub/)

**Power On with Mobile (network standby)**
- Settings > All Settings > Connections > Network > Expert Settings > Power On with Mobile. It lets SmartThings-registered phones on the same network wake the TV. With it off, the app cannot power the TV on. Applies to select smart TVs from 2017 — [Samsung AU support](https://www.samsung.com/au/support/tv-audio-video/power-on-tv-smartthings-app/)
- Samsung's troubleshooting page says stray "power on" signals over the network can wake the TV through this function. Auto Power Off is under Settings > All Settings > General & Privacy > Power and Energy Saving — [Samsung AU support](https://www.samsung.com/au/support/tv-audio-video/tv-powers-on-off-automatically)

### Inferences
- Model-year mapping: "Support > Terms & Privacy/Terms & Policy" appears to be the 2016-2021 layout, and "All Settings > General & Privacy" the 2022+ layout. The Start Screen table above shows the same 2021/2022 break (General > Smart Features moving to General & Privacy) and a 2025 move to "Advanced Features". Expect privacy items to have moved on 2025-2026 One UI Tizen sets too. Guides note "Support > Terms & Privacy" still works as a second route.
- VIS and Interest-Based Ads must both be turned off: per Samsung's notice, both consents are needed for viewing-history collection, while ads personalization also draws on other data.
- The PSID reset is probably next to the ad consents (Privacy Choices / Terms & Privacy). No source gave an exact path.

### Gaps
- No official Samsung page gives privacy menu paths per model year. Samsung's ACR FAQ says only "Settings menu".
- No source found for exact locations of: Usage/diagnostic data ("Improve" or "Smart Hub data" consents), Promotional content, "Do not track", the Bixby-specific toggle, Samsung TV Plus settings, SmartThings/IoT Hub toggles, or auto software update (Samsung documents the manual path Settings > All Settings > Support > Software Update > Update Now; auto-update sits in the same submenu on most sets, but I have no source for that).
- "Instant On" / Quick Start: no official Samsung page found. One German community post claims Instant On can no longer be turned off on current sets. Unverified.
- Consumer Reports' current Samsung section could not be retrieved.

## Setup consents, declining Smart Hub terms, withdrawing consent later

### Takeaway
VIS, Interest-Based Ads and voice are separate optional consents at setup and can be withdrawn later in Settings. Declining the main Smart Hub Terms leaves a working TV for antenna and HDMI, but anecdotal reports say streaming apps and voice stop working. The Texas settlement (Feb 2026) forced explicit-consent prompts for Texans only.

### Cited Findings
- Customised ads are offered during installation and you "can choose not to provide your consent" — [Samsung AU Ads privacy](https://www.samsung.com/au/info/ads-privacy)
- ACR runs only after opt-in at setup or later in Settings; you are not required to turn it on — [Samsung ANS10010616](https://www.samsung.com/us/support/answer/ANS10010616/)
- UK user (2022): after rejecting the terms, apps such as iPlayer, ITVhub and Prime "stop working after a week or two". Voice needs the T&Cs. Another user kept the TV offline, used a streaming stick, and found menus and channel changes faster — [Samsung EU community](https://eu.community.samsung.com/t5/tv/smart-tv-ads-on-the-menu-bar/m-p/5762520/highlight/true) (anecdotal)
- In the EU, Samsung uses IAB-style consent purposes. Per a Samsung statement, removing consent for "Store and/or access information on a device" and "Personalised ads, ad measurement, audience insights and product development" removes consent for all listed vendors — search summary ([inkl](https://inkl.com/a/nvEPYatBLoE))
- Texas: AG Paxton sued Samsung (and Sony, LG, Hisense, TCL in late 2025) over ACR. Samsung settled in late February 2026. It agreed to stop collecting ACR data from Texans without "explicit, informed consent" and to rewrite on-screen privacy prompts. The deal does not ban ACR. Samsung denied breaking the law — [Malwarebytes](https://www.malwarebytes.com/blog/news/2026/03/samsung-tvs-stop-spying-on-viewers-in-texas-heres-how-to-disable-acr-anywhere); [Fox 7 Austin](https://www.fox7austin.com/news/samsung-updates-tv-data-consent-settings-after-texas-sues-over-spying); [Android Authority](https://www.androidauthority.com/samsung-tv-data-collection-settlement-3645703/) (403 on fetch)
- Reset Smart Hub (Settings > Support > Device Care > Self Diagnosis > Reset Smart Hub, PIN needed) erases Smart Hub settings, downloaded apps and stored accounts — [Samsung CA Device Care](https://www.samsung.com/ca/support/tv-audio-video/how-to-use-the-device-care-on-my-samsung-smart-tv/)

### Inferences
- Reset Smart Hub probably brings back the terms/consent screens and so is one way to re-decline everything. Not confirmed.
- Antenna and HDMI should work without Smart Hub terms. The only source is old forum posts.

### Gaps
- No current (2024-2026) official Samsung text on which features need which consent, or on what works with Smart Hub Terms declined.
- No primary text of the Texas settlement. Whether the new prompts also reached non-Texas firmware is unknown.
- EU/UK GDPR consent screen wording on 2024-2026 sets not found.

## Menu changes across years and whether OS upgrades reset settings

### Takeaway
The menus moved twice: Support/General (2016-2021) to "General & Privacy" (2022-2024), then "Advanced Features" for some items on 2025 One UI Tizen. Samsung promises up to 7 years of One UI Tizen upgrades for 2023+ models. No source says whether upgrades re-enable privacy settings.

### Cited Findings
- Start Screen Options path history (2015 through 2025) is in the table above — [Samsung AU](https://www.samsung.com/au/support/tv-audio-video/use-autorun-start-screen-options-on-your-samsung-tv/)
- Samsung promises free One UI Tizen upgrades "for up to 7 years from the product launch year" for TVs from 2023 on, and features "may vary depending on model, region, product launch year" — [Samsung UK One UI Tizen](https://www.samsung.com/uk/tvs/smart-tv/apps/); [ChannelNews](https://www.channelnews.com.au/samsung-upgrade-2023-tvs-ahead-of-one-ui-os-roll-out-next-year/)
- Manual update path: Settings > All Settings > Support > Software Update > Update Now — Samsung support (search summary)

### Gaps
- No evidence either way on whether OS upgrades or the Texas-driven prompt changes reset or re-ask privacy consents. Recheck Privacy Choices after every major update.

## Background activity and RAM: what to turn off; Device Care

### Takeaway
Samsung's only built-in "memory cleanup" is Device Care (Settings > Support > Device Care; called Self Diagnosis on 2018-2019 sets, per one guide). Its scan clears cached memory and closes unused background apps. The settings that cut background start-up work are Start with Smart Hub Home, Autorun Last App, the Multi View autoruns and Power On with Mobile. I found no measurements of RAM saved by any setting.

### Cited Findings
- Device Care: Settings > Support > Device Care > Start Device Care. After the scan it "clears the cached memory… and closes unused background apps". Also offers Manage Storage (per-app data/cache clear and delete; default apps cannot be deleted) and Self Diagnosis (picture/sound tests, HDMI troubleshooting, signal info, Smart Hub Connection Test, Reset Smart Hub). Page updated 24 Aug 2026 — [Samsung CA](https://www.samsung.com/ca/support/tv-audio-video/how-to-use-the-device-care-on-my-samsung-smart-tv/); also [Samsung IN](https://www.samsung.com/in/support/tv-audio-video/how-to-use-the-device-care-on-my-samsung-smart-tv/)
- A "Memory Boost > Clean Now" option clears the cache of all apps. On 2018-2019 models the tool may be called Self Diagnosis — [Guiding Tech](https://www.guidingtech.com/how-to-clear-cache-on-samsung-tv)
- One user kept the TV offline (Smart Hub terms declined) and found menus faster — [Samsung EU community](https://eu.community.samsung.com/t5/tv/smart-tv-ads-on-the-menu-bar/m-p/5762520/highlight/true) (anecdotal)

### Inferences
- Device Care's memory clean is a one-off flush (cache plus idle apps). Apps and services reload as you use them, so expect no lasting effect.
- Turning off Start with Smart Hub Home and Autorun Last App avoids loading Smart Hub/app content at power-on. This is the most likely RAM/start-up win among documented settings.

### Gaps
- No sources found on the RAM or background cost of Ambient Mode, Art Store, Gaming Hub, Samsung Health, SmartThings/IoT Hub, or Samsung TV Plus, or how to disable them.
- No official source on Instant On (see above).

## Do the settings actually stop traffic? Independent measurements

### Takeaway
Yes for ACR. The IMC 2024 study (UCL/UC Davis/Universidad Carlos III) found that after the Samsung opt-outs, the TV sent no traffic to any ACR domain, in the UK and the US. Opting out did not stop other Samsung or partner traffic. The 2019 Mon(IoT)r study found Samsung TVs talking to third parties such as Netflix.

### Cited Findings
- Paper: "Watching TV with the Second-Party: A First Look at Automatic Content Recognition Tracking in Smart TVs", Anselmi et al., ACM IMC 2024. The paper does not name the Samsung model or firmware — [arXiv 2409.06203](https://arxiv.org/html/2409.06203v1); [UCL](https://www.ucl.ac.uk/iccs/publications/2024/nov/watching-tv-second-party-first-look-automatic-content-recognition-tracking)
- Samsung ACR domains: UK acr-eu-prd.samsungcloud.tv (London), acr0.samsungcloudsolution.com (Amsterdam), log-config.samsungacr.com (New York), log-ingestion-eu.samsungacr.com (London). US: acr-us-prd.samsungcloud.tv, log-config.samsungacr.com, log-ingestion.samsungacr.com — [arXiv](https://arxiv.org/html/2409.06203v1)
- Fingerprint domain traffic comes about once a minute, with larger peaks every ~5 minutes. The authors infer Samsung captures frames every 500 ms (per Samsung docs) and sends them in batches. Samsung sent "up to 2X more data at a higher frequency than LG" — [arXiv](https://arxiv.org/html/2409.06203v1)
- ACR runs on HDMI input too ("dumb display" use). UK, logged in, opted in: acr-eu-prd KB = Antenna 440.9, HDMI 204.8, Screen Cast 30.3, FAST 8.5, OTT 8.6. In the US, FAST (Samsung TV Plus-type) traffic matched linear (176.6 vs 184.4 KB), and the platform's own streaming app also triggered ACR, unlike the UK — [arXiv](https://arxiv.org/html/2409.06203v1)
- Logging into or out of the Samsung account made no material difference to ACR — [arXiv](https://arxiv.org/html/2409.06203v1)
- With opt-out applied (logged in or out), the TV made "no communication with any previously identified ACR domain" and no new ACR domains appeared — [arXiv](https://arxiv.org/html/2409.06203v1)
- Mon(IoT)r (Ren et al., IMC 2019, Northeastern + Imperial): 81 devices, 34,586 experiments. 71 of 81 devices sent user information to third parties (per press summary). Press reports say Samsung and LG TVs contacted Netflix even with no Netflix account. The Samsung detail comes from press coverage, not the paper's tables — [Mon(IoT)r lab](https://moniotrlab.khoury.northeastern.edu/publications/imc19/); [Gigazine](https://www.gigazine.net/gsc_news/en/20190919-smart-tv-send-private-data)
- Some guides say limited diagnostic data may still flow after opt-out — search summary of [Tom's Guide](https://www.tomsguide.com/tvs/your-tv-is-watching-you-how-to-turn-off-data-collection-on-lg-samsung-roku-and-more) (unverified)

### Inferences
- Turning off VIS is the one setting with independent proof that it works. The study's opt-out bundled six toggles, so it did not isolate VIS alone; the authors still attribute ACR shutdown to VIS.
- Logging out of the Samsung account is not a privacy measure for ACR.

### Gaps
- No independent before/after measurements for Interest-Based Ads, voice, the diagnostics consents, Smart Hub autorun or Samsung TV Plus.
- No measurements on 2025-2026 One UI Tizen firmware or after the Texas changes.
- Consumer Reports' own traffic tests (if any) on Samsung not found.
