# Art brief: generate the wallpaper artwork

**For:** an AI coding agent (e.g. Codex) with access to GPT Image.
**Goal:** produce 11 images, process them, and push them to a new branch. The live wallpaper in this repo animates everything; the images are its backdrop and its moving cut-outs.

Read this whole file before starting. Do not change any code files (`*.js`, `*.html`, `config.js`).

---

## What you're making

The wallpaper is a split-level "over-under" picture: a calm water surface cuts straight across the frame. Above it are sky, green hills and a white glass eco-city. Below it is a coral reef. The style is **Frutiger Aero**: the glossy, optimistic, ultra-saturated look of mid-2000s stock photos and desktop wallpapers. Think clear turquoise water, bright green grass, glassy highlights and crisp detail.

Code draws all of these on top of the art, so **none of them may appear in the images**: fish, dolphins, turtles, bubbles, wind turbines, the rainbow and the globe.

You'll make:

| # | File | Size | Background | How |
| --- | --- | --- | --- | --- |
| 1 | `art/plates/day.webp` | 1536 × 1024 | opaque | generate |
| 2 | `art/plates/dawn.webp` | 1536 × 1024 | opaque | edit of #1 |
| 3 | `art/plates/sunset.webp` | 1536 × 1024 | opaque | edit of #1 |
| 4 | `art/plates/night.webp` | 1536 × 1024 | opaque | edit of #1 |
| 5 | `art/sprites/globe.png` | square | transparent | generate |
| 6 | `art/sprites/dolphin.png` | trimmed | transparent | generate |
| 7 | `art/sprites/clownfish.png` | trimmed | transparent | generate |
| 8 | `art/sprites/bluetang.png` | trimmed | transparent | generate |
| 9 | `art/sprites/yellowtang.png` | trimmed | transparent | generate |
| 10 | `art/sprites/angelfish.png` | trimmed | transparent | generate |
| 11 | `art/sprites/turtle.png` | trimmed | transparent | generate |

## How to generate

Use GPT Image: your built-in image tool, or the OpenAI Images API with the newest `gpt-image` model you have access to.

- Size **1536x1024** (landscape) for everything except the globe, which is **1024x1024**.
- Quality **high**.
- Sprites: request a **transparent background** with PNG output. With the API, that's `background: "transparent"` and `output_format: "png"`.
- Plates 2–4: use the **image edit** endpoint or tool, with the finished day plate as the input image. That keeps the composition identical, which matters because the plates cross-fade into each other.

## 1. Day plate (make and approve this first)

Prompt:

> A photorealistic, ultra-glossy Frutiger Aero desktop wallpaper that looks like a 2007 stock photo, 3:2 landscape. A split-level "over-under" view: the calm water surface cuts straight across the whole image at 56% of the height, perfectly level, with the camera exactly at water level.
>
> ABOVE THE WATER (top 56%): a vivid clear blue sky with a few soft white cumulus clouds. Keep the upper-left quarter of the sky clear and empty. Along the far shore, low rolling bright-green glossy grass hills; the left third of the image is open grassy hills with no buildings. On the right third, a clean futuristic eco-city of rounded white and pale-aqua glass towers with green rooftop gardens and lots of round trees, right at the water's edge. A thin strip of calm turquoise lagoon reflects the city. The sun is high, just out of frame at the top centre.
>
> BELOW THE WATER (bottom 44%): crystal-clear turquoise tropical water with bright sun rays slanting down, and a colourful coral reef along the bottom fifth of the image: pink, orange, purple and yellow coral, sea anemones, a few rocks and pale sand. Keep the open water between the surface and the reef completely empty: no fish, no dolphins, no turtles, no bubbles.
>
> No wind turbines, no rainbow, no planet or globe, no text, no logos, no people, no boats. Saturated, high clarity, glossy and optimistic, crisp detail everywhere.

**Check it before moving on.** Regenerate (up to 4 tries) if any of these fail:
- [ ] The water surface is one straight, level line across the full width, between 52% and 60% of the height (row 532–614).
- [ ] The open water has no fish, dolphins, turtles or bubbles.
- [ ] The upper-left quarter of the sky has no sun, large cloud or object (small wispy clouds are fine).
- [ ] The left third has hills only, no buildings.
- [ ] There are no turbines, rainbow, globe, text or watermark.
- [ ] The reef sits in roughly the bottom 20% and the colours are bright and saturated.

## 2–4. Dawn, sunset and night plates (edits of the day plate)

Use the approved day plate as the input image for each one.

**Dawn**
> Keep the exact same scene, composition and camera position. Change the time to sunrise: a soft pink, peach and lavender sky, the sun just rising on the far LEFT horizon behind the hills, warm golden light on the towers, pastel reflections on the water. Underwater light is softer and warmer. Change nothing else.

**Sunset**
> Keep the exact same scene, composition and camera position. Change the time to sunset: a deep orange and magenta sky, the sun setting on the far RIGHT horizon just behind the city, towers glowing gold, warm amber light rays underwater. Change nothing else.

**Night**
> Keep the exact same scene, composition and camera position. Change the time to night: a deep navy starry sky with a thin crescent moon high on the right, city windows glowing warm yellow and cyan, rooftop gardens softly lit, hills dark blue-green. Underwater is dark navy with soft bioluminescent glows on the coral. Calm and moody but still glossy. Change nothing else.

**Check each one:** the waterline, hills, city and reef must sit in the same places as on the day plate. Compare the waterline row: it should be within ±10 px of the day plate's. Regenerate (up to 4 tries) if the layout drifts or anything forbidden appears.

## 5–11. Sprites (transparent background)

**Globe** (1024x1024)
> A glossy, translucent Earth globe in the Frutiger Aero style: bright blue oceans, vivid green continents, wispy white clouds, a soft glowing cyan atmosphere rim and a strong glassy highlight on the upper left. Centred and perfectly round. Isolated on a transparent background. Photorealistic glossy render, no ring, no orbit, no text.

**Dolphin**
> A photorealistic bottlenose dolphin mid-leap, exact side view facing right, body gently arched, wet glossy grey skin with bright highlights. Isolated on a transparent background: no water surface, no splash, no droplets, no shadow.

**Fish**, one image each, using this template:
> A photorealistic [FISH], exact side profile facing right, fins spread, vivid glossy colours, sharp detail. Isolated on a transparent background, no shadow, nothing else in frame.

| File | [FISH] |
| --- | --- |
| `clownfish.png` | clownfish |
| `bluetang.png` | blue tang (palette surgeonfish) |
| `yellowtang.png` | yellow tang |
| `angelfish.png` | Moorish idol |

**Turtle**
> A photorealistic green sea turtle swimming, side view facing right, front flippers extended, glossy shell with a clear pattern. Isolated on a transparent background, no shadow, no water.

**Check each sprite.** Regenerate if any of these fail:
- [ ] The background is truly transparent: all four corners have alpha = 0. A grey-and-white checkerboard painted into the image is a **failure**, not transparency.
- [ ] The animal faces **right**. If it faces left, flip it horizontally. Don't regenerate just for that.
- [ ] It's a clean side view with the whole body in frame (no cropped tail or fins).
- [ ] There's no water, splash, shadow or second animal.

## Processing (Python + Pillow is fine)

**Plates**
1. If an image isn't exactly 1536 × 1024, resize it to 1536 × 1024. Don't crop off any of the scene.
2. Save as WebP at quality 88 to `art/plates/<name>.webp`.

**Sprites**
1. Trim to the bounding box of pixels with alpha > 8, plus 8 px of transparent padding on every side.
2. If the longest side is over 1024 px, scale down so it's 1024 px.
3. **Globe only:** don't trim it to a tight box. Keep it square, with the globe centred and its diameter about **87%** of the image width; pad or crop evenly to get there. The code draws the globe image 2.3× the globe's radius, so this ratio matters.
4. Save as PNG with alpha to `art/sprites/<name>.png`.

## Write `art/MANIFEST.md`

Include:
- the model and settings you used
- for each file: its final size, the prompt used (plus any wording you changed), and how many tries it took
- for each plate: the **row (in px, out of 1024) where the water surface line is**, measured at x = 25%, 50% and 75% of the width
- for the day plate: rough x ranges (as % of width) for the hills-only area and the city
- anything that didn't come out as asked

## Hand-off

1. Work on a branch named `art-v1`, created from `main`. If your environment names branches itself, any name is fine.
2. Commit only the 11 image files and `art/MANIFEST.md`. Leave the `.gitkeep` files alone, and don't touch code.
3. Push the branch, or let it become a pull request into `main`. **Don't merge it.** Claude will line the animation up with the art first, then merge.
4. Finish by summarising what you made and anything that needs a second look.

## If you get stuck

- **No image generation available:** say so plainly and stop. Don't substitute stock images, drawings or placeholders.
- **Pillow missing:** install it with `pip install pillow`.
- **Can't include binary files in the commit or pull request:** say so, and leave the finished files in the workspace under `art/` so they can be downloaded and uploaded by hand.
