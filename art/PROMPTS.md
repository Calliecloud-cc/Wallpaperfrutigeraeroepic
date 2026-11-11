# Artwork prompts (GPT Image)

The wallpaper uses two kinds of artwork:

- **Plates:** four full backgrounds of the same scene, one each for dawn, day, sunset and night. They cross-fade through the day.
- **Sprites:** single subjects on a transparent background (dolphin, fish, turtle, globe) that the code moves around.

Everything that moves is animated by code, so the plates must leave the open water and the upper-left sky empty.

## File names and sizes

| File | Size | Background |
| --- | --- | --- |
| `plates/day.webp` | 1536 × 1024 | normal |
| `plates/dawn.webp` | 1536 × 1024 | normal (edit of day) |
| `plates/sunset.webp` | 1536 × 1024 | normal (edit of day) |
| `plates/night.webp` | 1536 × 1024 | normal (edit of day) |
| `sprites/globe.png` | 1024 × 1024 | transparent |
| `sprites/dolphin.png` | 1536 × 1024 | transparent |
| `sprites/clownfish.png`, `bluetang.png`, `yellowtang.png`, `angelfish.png` | 1536 × 1024 | transparent |
| `sprites/turtle.png` | 1536 × 1024 | transparent |

PNG files are fine for plates too. They get converted to WebP and trimmed before they go in.

## 1. Day plate (make this first)

> A photorealistic, ultra-glossy Frutiger Aero desktop wallpaper that looks like a 2007 stock photo, 3:2 landscape. A split-level "over-under" view: the calm water surface cuts straight across the whole image at 56% of the height, with the camera exactly at water level.
>
> ABOVE THE WATER (top 56%): a vivid clear blue sky with a few soft white cumulus clouds. Keep the upper-left quarter of the sky clear and empty. Along the far shore, low rolling bright-green glossy grass hills; the left third is open grassy hills with no buildings. On the right third, a clean futuristic eco-city of rounded white and pale-aqua glass towers with green rooftop gardens and lots of round trees, right at the water's edge. A thin strip of calm turquoise lagoon reflects the city. The sun is high, just out of frame at the top centre.
>
> BELOW THE WATER (bottom 44%): crystal-clear turquoise tropical water with bright sun rays slanting down, and a colourful coral reef along the bottom: pink, orange, purple and yellow coral, sea anemones, a few rocks and pale sand. Keep the open water between the surface and the reef empty: no fish, no dolphins, no turtles, no bubbles.
>
> No wind turbines, no rainbow, no planet or globe, no text, no logos, no people, no boats. Saturated, high clarity, glossy and optimistic, crisp detail everywhere.

## 2–4. Time-of-day plates (edits of the day plate)

Give the day plate as the input image each time.

**Dawn**
> Keep the exact same scene, composition and camera position. Change the time to sunrise: a soft pink, peach and lavender sky, the sun just rising on the far LEFT horizon behind the hills, warm golden light on the towers, pastel reflections on the water. Underwater light is softer and warmer. Change nothing else.

**Sunset**
> Keep the exact same scene, composition and camera position. Change the time to sunset: a deep orange and magenta sky, the sun setting on the far RIGHT horizon just behind the city, towers glowing gold, warm amber light rays underwater. Change nothing else.

**Night**
> Keep the exact same scene, composition and camera position. Change the time to night: a deep navy starry sky with a thin crescent moon high on the right, city windows glowing warm yellow and cyan, rooftop gardens softly lit, hills dark blue-green. Underwater is dark navy with soft bioluminescent glows on the coral. Calm and moody but still glossy. Change nothing else.

## 5. Sprites (transparent background)

**Globe**
> A glossy, translucent Earth globe in the Frutiger Aero style: bright blue oceans, vivid green continents, wispy white clouds, a soft glowing cyan atmosphere rim and a strong glassy highlight on the upper left. Centred and perfectly round, filling about 85% of the frame. Isolated on a transparent background. Photorealistic glossy render, no ring, no text.

**Dolphin**
> A photorealistic bottlenose dolphin mid-leap, exact side view facing right, body gently arched, wet glossy grey skin with bright highlights. Isolated on a transparent background: no water surface, no splash, no shadow.

**Fish**, one image each, using this template:
> A photorealistic [FISH], exact side profile facing right, fins spread, vivid glossy colours, sharp detail. Isolated on a transparent background, no shadow, nothing else in frame.

Fill in [FISH] with each of these:
- `clownfish.png`: clownfish
- `bluetang.png`: blue tang (palette surgeonfish)
- `yellowtang.png`: yellow tang
- `angelfish.png`: Moorish idol

**Turtle**
> A photorealistic green sea turtle swimming, side view facing right, front flippers extended, glossy shell with clear pattern. Isolated on a transparent background, no shadow, no water.
