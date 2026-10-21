# Landscape assets

Generated using the built-in image-generation tool on 20 October 2026. These are illustrative, photorealistic scenes inspired by northern Portugal, not photographs of a verified location or live camera feeds. All seven PNG files are bundled in css/landscapes/ for offline display.

The launcher selects a scene using current Open-Meteo conditions. Rain, drizzle and storms use rainy-day or rainy-night according to the time of day. Cloudy skies, fog and cloud cover above 72% use overcast by day and cloudy-night at night. Clear nights use night. Snow keeps its snow image, darkened at night. Dedicated night images are shown without additional darkening. Dawn and dusk apply a warmer, dimmer treatment to the daytime weather image. Animated rain/snow effects remain optional; rain in the photographic backgrounds remains visible.

## Final prompts

Each prompt is the following common text plus the asset-specific text below:

Use case: photorealistic-natural. Asset type: full-screen 16:9 Samsung TV home background, landscape photograph, 1920x1080 or wider. Wide tranquil view over a real-looking northern Portuguese mountain valley, pine and oak woodland, granite slopes, a narrow winding river far below, horizon at upper middle. Natural photographic texture, believable geology, subtle atmospheric perspective. Quiet composition suitable behind white UI text; broad uncluttered sky in the upper left, more landscape detail toward bottom and right. No buildings, people, text, UI, logos, borders or watermarks. Not an illustration, not CGI, no exaggerated HDR. 

### css/landscapes/clear.png

Bright clear daytime, soft blue sky with a few delicate small clouds, natural sunlit olive-green woodland, subtle warm sunlight.

### css/landscapes/overcast.png

Rainy overcast afternoon, layered low grey clouds, visible mist drifting between dark green ridges, rain-softened distant hills, wet dark granite, lush realistic foliage. No sunbeams or blue sky.

### css/landscapes/night.png

Realistic moonlit night, muted deep blue sky with just a few faint stars, dark pine woodland and mountain silhouettes with gently visible natural texture, soft silver reflection along a distant river. No huge moon, no glowing fantasy objects, no vivid Milky Way.

### css/landscapes/snow.png

Winter snowfall, low overcast sky, snow-covered granite ridges and pine boughs, sparse delicate falling snow, natural subdued grey-white light, visible texture in fresh snow. No blue sky or sunlight.
## Additional weather scenes (20 October 2026)

Generated with the built-in image-generation tool using `css/landscapes/clear.png` as the edit target. Saved in the project as `css/landscapes/cloudy-night.png`, `css/landscapes/rainy-night.png`, and `css/landscapes/rainy-day.png`.

Each final prompt is the common prompt below followed by its specific variant:

Use case: lighting-weather. Asset type: photorealistic 16:9 landscape background for a Samsung TV launcher. Edit target: the attached clear.png landscape. Preserve the exact mountain ridges, river course, granite foreground, woodland, camera angle and framing; change only weather, lighting and atmosphere. Realistic northern Portuguese valley, natural photographic texture. Keep detail legible in shadows, restrained contrast, calm unobtrusive upper-left sky behind white interface text. No text, UI, people, buildings, logos, watermark, borders, fantasy glow or exaggerated HDR. Return a single full-bleed wide landscape image.

### css/landscapes/cloudy-night.png

Transform into a cloudy night. Dense layered charcoal-blue overcast clouds fill the sky, faint diffuse moonlight filtered through clouds, no visible moon disk, no stars, no sunlight. Deep blue-grey woodland and granite with gently readable natural texture, subdued silver-grey river reflections. No falling rain; clearly night, not daytime with a grey filter.

### css/landscapes/rainy-night.png

Transform into a rainy night. Opaque low dark storm clouds, fine natural diagonal rainfall visible against the dark hills, drifting rain mist between ridges, wet granite with subtle reflections, deep blue-grey forest, muted river under diffuse night sky light. No visible moon or stars, no sunlight, no lightning bolt, no artificial lamps, no lens droplets or bokeh. Clearly nighttime rain, preserve enough shadow detail to see the valley.

### css/landscapes/rainy-day.png

Transform into a rainy daytime afternoon. Broad low layered grey rain clouds, natural diffuse daylight without sunshine, fine visible diagonal rain across the valley, drifting rain curtains and mist softening distant ridges, wet dark granite and saturated natural green pine and oak foliage, softly rippled river. No blue sky, no sunbeams, no moon, no lightning bolt, no lens droplets. Clearly daytime and brighter than night scenes, photographic and restrained.

