# Frutiger Aero live wallpaper

A glossy, mid-2000s style live wallpaper for Windows and Mac. Above the water: blue sky, rolling green hills, wind turbines, a white glass eco-city, a rainbow and a glossy globe. Below it: a coral reef with tropical fish, a turtle, jellyfish and bubbles. Dolphins leap across the surface every so often.

- **Time of day:** follows Sydney time on a fixed schedule (first light 05:20, sunrise 05:47, sunset 19:32, last light 20:00), whatever time zone the computer is in.
- **Weather:** live Sydney weather from [Open-Meteo](https://open-meteo.com) (free, no account), checked every 15 minutes. Cloud, fog, rain, drops on the glass and thunderstorms all show up in the scene, and the rainbow gets brighter after a shower.
- **Artwork:** four AI-generated backgrounds (dawn, day, sunset, night) that cross-fade through the day, plus cut-outs of the globe, dolphin, fish and turtle, all made with GPT Image. `ART_BRIEF.md` is how they were made and `art/MANIFEST.md` records the details. If an image is ever missing, the wallpaper paints a stand-in for that part instead.

The wallpaper is a single web page, hosted with GitHub Pages:

**https://calliecloud-cc.github.io/Wallpaperfrutigeraeroepic/**

## Put it on your desktop

### Windows (Lively Wallpaper)

1. Install **Lively Wallpaper** from the Microsoft Store or from [github.com/rocksdanister/lively](https://github.com/rocksdanister/lively).
2. In Lively, click **+** (Add Wallpaper), paste the link above and confirm. Then set it as your wallpaper.
3. For two monitors, open Lively's settings and set the wallpaper arrangement to **Duplicate** (same picture on both screens).
4. In Lively's settings, turn on **Start with Windows**. Lively pauses the wallpaper by itself while a game or other app is fullscreen.
5. Optional: right-click the desktop → **View** → untick **Show desktop icons** for a clean view.

### Mac (Plash)

1. Install **Plash** from the Mac App Store (needs macOS 26) or from [sindresorhus.com/plash](https://sindresorhus.com/plash).
2. Click the Plash icon in the menu bar → **Add Website**, paste the link above.
3. In Plash's settings, turn on **Launch at login** and **Deactivate while on battery**.

## Try it in a browser

Open the link with options on the end:

| Option | What it does |
| --- | --- |
| `?debug` | shows the clock, the current look and the weather in a corner (or press **D**) |
| `?speed=720` | time-lapse: a whole day in 2 minutes |
| `?hour=19.4` | freezes the clock at 7:24 pm |
| `?weather=storm` | forces the weather: `clear`, `partly`, `cloudy`, `fog`, `drizzle`, `showers`, `rain`, `storm` |
| `?fps=60` | changes the frame rate (default 30) |
| `?noart` | ignores the artwork files and shows the painted stand-in |

Combine them with `&`, for example `?speed=720&weather=showers&debug`. Press **J** to make the dolphins jump.

## Settings

Everything adjustable lives in `config.js`: the schedule, the weather location, the frame rate, and where things sit in the picture (the waterline, the globe, the rainbow, the turbines).

## How it's built

| File | Job |
| --- | --- |
| `index.html` | the page |
| `config.js` | settings |
| `js/time.js` | Sydney clock and the colours for each time of day |
| `js/weather.js` | live weather, eased so changes fade in |
| `js/scene.js` | painted stand-in background (used until the artwork plates exist) |
| `js/actors.js` | everything that moves: stars, rainbow, globe, clouds, birds, turbines, fish, turtle, jellyfish, bubbles, dolphins |
| `js/effects.js` | overcast, fog, rain, drops on the glass, lightning, lens flare |
| `js/main.js` | sizing, frame rate, layer order |

Everything is drawn on a 1536 × 1024 (3:2) picture that's scaled to cover the screen, so the artwork and the animation always line up.
