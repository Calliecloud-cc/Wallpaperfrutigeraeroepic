# Art v1 manifest

The existing workspace generation record reports creation on 11 November 2026 using the built-in GPT Image image generation/edit tool (`image_gen.imagegen`). The tool does not expose the underlying model version, a quality selector or a numeric output-size parameter. Every prompt explicitly requested high quality and the brief’s dimensions. Transparent sprites used `transparent_background: true`; plates used `false`. No substitute image sources were used.

The completed assets and generation notes were already present when this hand-off session began. Final dimensions, alpha channels, sprite silhouettes and plate alignment were independently rechecked before committing; model, prompts, attempt counts and edit-input history below are preserved from those generation notes.

## Workflow and processing

The day plate was generated and visually checked before any lighting edit. Dawn, sunset and night each used the finished `art/plates/day.webp` as their explicit input image, independently of the other edits. All plate sources were 1536 × 1024. Pillow saved opaque RGB WebP files at quality 88, with no scene crop.

Animal sprites were cropped to the alpha > 8 bounding box, given 8 transparent pixels of padding per side, then proportionally reduced to a longest side of 1024. Padding therefore scales with the image. No horizontal flips were needed. PNG files retain alpha. The globe tool output was 1254 × 1254 despite the requested 1024 × 1024; its equal 1095 × 1095 alpha > 8 bounds were centred and resized to 891 × 891 on a 1024 × 1024 transparent square (87.0% diameter).

## Measurements and checks

Rows below are zero-based pixel coordinates in the final 1024-pixel-high WebP files. The surface has a narrow bright edge a few pixels thick. Measurements locate the strongest local vertical RGB transition in rows 580–604, using the mean absolute per-channel adjacent-row difference over seven columns centred at each requested x coordinate (the reported row is the upper row of the pair). This identifies the visible surface edge rather than the distant shoreline at about row 505. Allow about ±3 px for edge thickness and compression.

| Plate | x = 25% (384) | x = 50% (768) | x = 75% (1152) | Largest offset from day |
| --- | ---: | ---: | ---: | ---: |
| day | 593 | 591 | 588 | 0 px |
| dawn | 595 | 591 | 589 | 2 px |
| sunset | 589 | 590 | 588 | 4 px |
| night | 592 | 590 | 591 | 3 px |

The day surface is approximately 57.4–57.9% down the image, inside the required 52–60% range. All variants are within ±10 px of day at all three measurement positions. Visual comparison confirms matching hills, building silhouettes, trees and reef locations. Small changes to reflections and cloud texture accompany the lighting changes.

Day horizontal placement: hills-only shore approximately x = 0–46%; tree/shore transition approximately 46–59%; city architecture approximately 59–100%, concentrated on the right third. The left third contains no buildings. The upper-left quarter is empty blue sky; the central sunlight grazes the top edge. Bright coral begins around row 830 (bottom 19%). Open underwater space contains no animals or bubbles. No plate contains turbines, rainbow, globe, text, watermark, people or boats.

All seven final sprites were checked numerically: RGBA PNG, all four corner alpha values exactly 0, longest side at most 1024. They were also inspected over a bright magenta background: genuine cut-outs, no painted checkerboards, water, splashes, cast shadows or additional animals. All animals face right, with full silhouettes and fins/tails in frame. The globe is round and centred.

## Files and prompts

The following are the actual submitted prompts, including all additions to the brief. Each lighting edit received the day plate only.

### `art/plates/day.webp`

Final size: **1536 × 1024 px**. Attempts: **1**.

```text
Create one image at 1536x1024 landscape, high quality. A photorealistic, ultra-glossy Frutiger Aero desktop wallpaper that looks like a 2007 stock photo, 3:2 landscape. A split-level "over-under" view: the calm water surface cuts straight across the whole image at 56% of the height, perfectly level, with the camera exactly at water level.

ABOVE THE WATER (top 56%): a vivid clear blue sky with a few soft white cumulus clouds. Keep the upper-left quarter of the sky clear and empty. Along the far shore, low rolling bright-green glossy grass hills; the left third of the image is open grassy hills with no buildings. On the right third, a clean futuristic eco-city of rounded white and pale-aqua glass towers with green rooftop gardens and lots of round trees, right at the water's edge. A thin strip of calm turquoise lagoon reflects the city. The sun is high, just out of frame at the top centre.

BELOW THE WATER (bottom 44%): crystal-clear turquoise tropical water with bright sun rays slanting down, and a colourful coral reef along the bottom fifth of the image: pink, orange, purple and yellow coral, sea anemones, a few rocks and pale sand. Keep the open water between the surface and the reef completely empty: no fish, no dolphins, no turtles, no bubbles.

No wind turbines, no rainbow, no planet or globe, no text, no logos, no people, no boats. Saturated, high clarity, glossy and optimistic, crisp detail everywhere.
The waterline must be a perfectly straight horizontal boundary at row 573 of 1024 across the full width. Keep all reef structures confined to the bottom fifth.
```

### `art/plates/dawn.webp`

Final size: **1536 × 1024 px**. Attempts: **1**.

```text
Edit the supplied finished day plate, at 1536x1024, high quality. Keep the exact same scene, composition and camera position. Change the time to sunrise: a soft pink, peach and lavender sky, the sun just rising on the far LEFT horizon behind the hills, warm golden light on the towers, pastel reflections on the water. Underwater light is softer and warmer. Change nothing else.
Preserve pixel-aligned silhouettes of hills, every building, trees and reef; preserve the perfectly straight water surface boundary at row 593. No fish, dolphins, turtles, bubbles, turbines, rainbow, globe, text, logos, people or boats. This is only a lighting and colour edit, never a new composition.
```

### `art/plates/sunset.webp`

Final size: **1536 × 1024 px**. Attempts: **1**.

```text
Edit the supplied finished day plate, at 1536x1024, high quality. Keep the exact same scene, composition and camera position. Change the time to sunset: a deep orange and magenta sky, the sun setting on the far RIGHT horizon just behind the city, towers glowing gold, warm amber light rays underwater. Change nothing else.
Preserve pixel-aligned silhouettes of hills, every building, trees and reef; preserve the perfectly straight water surface boundary at row 593. No fish, dolphins, turtles, bubbles, turbines, rainbow, globe, text, logos, people or boats. This is only a lighting and colour edit, never a new composition.
```

### `art/plates/night.webp`

Final size: **1536 × 1024 px**. Attempts: **1**.

```text
Edit the supplied finished day plate, at 1536x1024, high quality. Keep the exact same scene, composition and camera position. Change the time to night: a deep navy starry sky with a thin crescent moon high on the right, city windows glowing warm yellow and cyan, rooftop gardens softly lit, hills dark blue-green. Underwater is dark navy with soft bioluminescent glows on the coral. Calm and moody but still glossy. Change nothing else.
Preserve pixel-aligned silhouettes of hills, every building, trees and reef; preserve the perfectly straight water surface boundary at row 593. No fish, dolphins, turtles, bubbles, turbines, rainbow, globe, text, logos, people or boats. This is only a lighting and colour edit, never a new composition.
```

### `art/sprites/globe.png`

Final size: **1024 × 1024 px**. Attempts: **1**.

```text
Create one image, 1024x1024 square, high quality, PNG with true alpha transparency. A glossy, translucent Earth globe in the Frutiger Aero style: bright blue oceans, vivid green continents, wispy white clouds, a soft glowing cyan atmosphere rim and a strong glassy highlight on the upper left. Centred and perfectly round. Isolated on a transparent background. Photorealistic glossy render, no ring, no orbit, no text. Globe diameter about 87% of image width, entirely in frame, empty transparent margins on every side.
```

### `art/sprites/dolphin.png`

Final size: **1024 × 631 px**. Attempts: **1**.

```text
Create one image, 1536x1024 landscape, high quality, PNG with true alpha transparency. A photorealistic bottlenose dolphin mid-leap, exact side view facing right, body gently arched, wet glossy grey skin with bright highlights. Isolated on a transparent background: no water surface, no splash, no droplets, no shadow. One animal only, whole body including all fins and tail fully in frame with generous transparent margin.
```

### `art/sprites/clownfish.png`

Final size: **1024 × 553 px**. Attempts: **1**.

```text
Create one image, 1536x1024 landscape, high quality, PNG with true alpha transparency. A photorealistic clownfish, exact side profile facing right, fins spread, vivid glossy colours, sharp detail. Isolated on a transparent background, no shadow, nothing else in frame. One animal only, whole body including all fins and tail fully in frame with generous transparent margin. No water, splash, droplets, bubbles or background objects.
```

### `art/sprites/bluetang.png`

Final size: **1024 × 550 px**. Attempts: **1**.

```text
Create one image, 1536x1024 landscape, high quality, PNG with true alpha transparency. A photorealistic blue tang (palette surgeonfish), exact side profile facing right, fins spread, vivid glossy colours, sharp detail. Isolated on a transparent background, no shadow, nothing else in frame. One animal only, whole body including all fins and tail fully in frame with generous transparent margin. No water, splash, droplets, bubbles or background objects.
```

### `art/sprites/yellowtang.png`

Final size: **1024 × 682 px**. Attempts: **1**.

```text
Create one image, 1536x1024 landscape, high quality, PNG with true alpha transparency. A photorealistic yellow tang, exact side profile facing right, fins spread, vivid glossy colours, sharp detail. Isolated on a transparent background, no shadow, nothing else in frame. One animal only, whole body including all fins and tail fully in frame with generous transparent margin. No water, splash, droplets, bubbles or background objects.
```

### `art/sprites/angelfish.png`

Final size: **1024 × 698 px**. Attempts: **1**.

```text
Create one image, 1536x1024 landscape, high quality, PNG with true alpha transparency. A photorealistic Moorish idol, exact side profile facing right, fins spread, vivid glossy colours, sharp detail. Isolated on a transparent background, no shadow, nothing else in frame. One animal only, whole body including its long dorsal streamer, all fins and tail fully in frame with generous transparent margin. No water, splash, droplets, bubbles or background objects.
```

### `art/sprites/turtle.png`

Final size: **1024 × 352 px**. Attempts: **2**.

First attempt rejected: the view was three-quarter rather than a clean side profile. First prompt:

```text
Create one image, 1536x1024 landscape, high quality, PNG with true alpha transparency. A photorealistic green sea turtle swimming, side view facing right, front flippers extended, glossy shell with a clear pattern. Isolated on a transparent background, no shadow, no water. One animal only, whole body including all flippers and tail fully in frame with generous transparent margin. No splash, droplets, bubbles or background objects.
```

Accepted second prompt:

```text
Create one image, 1536x1024 landscape, high quality, PNG with true alpha transparency. A photorealistic green sea turtle swimming, STRICT exact lateral side profile facing right, front flippers extended, glossy shell with a clear pattern. The camera is perpendicular to its side at body mid-height: show only one eye, a narrow side silhouette of the domed shell, beak pointing horizontally right. Do not use a three-quarter view or overhead view. Isolated on a transparent background, no shadow, no water. One animal only, whole body including all flippers and tail fully in frame with generous transparent margin. No splash, droplets, bubbles or background objects.
```

## Deviations and points for review

- Exact GPT Image model revision and enforced quality setting are unavailable through the built-in tool; high quality was requested in every prompt.
- The globe source resolution differed from the request and was processed to the required final 1024 × 1024 square.
- The day waterline is around row 590, slightly lower than the prompt’s target row 573, but within the brief’s accepted range. City buildings extend left to about 59% instead of being wholly confined to the right third; the required hills-only left third is clear.
- The sunset sun appears behind the city near x = 78%, partially obscured by buildings, rather than at the extreme right edge.
- Lighting edits preserve the layout closely, but generation is not a pixel-identical recolour: reflections, clouds and some fine surface detail differ. Cross-fade alignment should receive the planned animation review before merging.
- The accepted turtle is a lateral swimming view with the near flipper angled towards the viewer; the first, more oblique attempt was discarded.

Only the eleven deliverable image files and this manifest belong in the art-v1 commit. Code and .gitkeep files are unchanged.
