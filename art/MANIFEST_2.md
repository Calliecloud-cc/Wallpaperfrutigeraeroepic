# Art v2 manifest

Created 11 November 2026 with the built-in GPT Image tool (`image_gen.imagegen`). The exact underlying model revision and enforceable quality/size parameters are not exposed by this tool. All requests specified high quality, PNG and the brief's source dimensions; every tool call used `transparent_background: true`. New artwork was generated with GPT Image; all visual/alpha corrections also used GPT Image edits. Pillow only trimmed, padded, resized and saved the deliverables. No existing source image or code file was changed.

## Processing and checks

Each selected RGBA source was trimmed to the bounding box of alpha > 8, with 8 px transparent padding added on all sides, then proportionally downscaled only when needed. Longest sides are at most 1024 px for clouds, 768 px for jellyfish and 512 px for sardine. Padding scales along with the image. The small round cloud needed no downscaling after trimming. No background was painted in and no alpha was flattened.

All seven final PNGs have four corner alpha values exactly `[0, 0, 0, 0]`. Composites over teal/blue and magenta were inspected: genuine cut-outs with no checkerboard, sky, water, bubbles, cast shadow or extra subject. All subjects are complete. Clouds have four distinct shapes (broad flat base, tall rounded tower, compact round puff, long low bank), soft alpha edges and visually neutral white/grey colour. The sardine is a complete right-facing lateral profile with silver sides and a blue-green back.

Both jellyfish are upright with bells at the top and arms/tentacles descending beneath their rims. True intermediate alpha occurs inside the bell tissue and the hanging arms, not only on the outer contour. On a central bell sample spanning x=30–70% and y=5–20% of each final canvas, the moon's median alpha is 140/255 and the pink jellyfish's is 51/255. Approximately 98.5% and 99.6% of visible pixels in those respective sample regions have alpha below 247. Narrow reflective highlights remain brighter and more opaque. These are genuinely see-through PNGs.

## Final files and bell fractions

Bell measurements use zero-based rows of the final image. The rim is curved and has a raised front lip and a lower rear lip, so a single row cannot follow every scallop. The suggested split below is the lower envelope of the bell, keeping the whole bell above the cut. Visual measurement uncertainty is about ±4 px. Claude should confirm the split in the animated scene before merging.

| File | Final size | Tries | Bell rim row / final height | Bell fraction |
| --- | --- | ---: | --- | ---: |
| `art/sprites/cloud1.png` | 1024 × 295 | 2 | — | — |
| `art/sprites/cloud2.png` | 1024 × 841 | 2 | — | — |
| `art/sprites/cloud3.png` | 987 × 815 | 2 | — | — |
| `art/sprites/cloud4.png` | 1024 × 217 | 2 | — | — |
| `art/sprites/jellyfish.png` | 455 × 768 | 4 | 250 / 768 | 0.3255 |
| `art/sprites/jellyfish2.png` | 325 × 768 | 3 | 184 / 768 | 0.2396 |
| `art/sprites/sardine.png` | 512 × 168 | 1 | — | — |

The moon's front rim is around row 219 and its lower rear rim around row 250; use **0.3255** as the initial bell fraction. The pink jellyfish's front rim is around row 150 and lower rear rim around row 184; use **0.2396** initially.

## Generation attempts and deviations

- Clouds: one generation and one neutral-colour edit each. Initial soft edges had faint blue channel contamination, and the tall cloud had too little bottom clearance. Edits neutralised visible colour cast and improved clearance. Microscopic channel differences remain in a few low-alpha edge pixels (maximum alpha-weighted blue excess about 2–6 levels out of 255); no blue fringe was visible in the contrasting-background checks. These are not mathematically greyscale files.
- `cloud1`'s first source was 2172 × 724 despite requesting 1536 × 1024; the accepted edit is the requested 1536 × 1024. All other accepted sources also match their requested dimensions.
- Moon jellyfish: four tool calls. First source had an almost opaque bell and overly long frilly oral arms. Second corrected alpha but retained long arms. Third shortened the oral arms but restored near-opaque bell alpha. Fourth corrected the actual alpha while retaining short oral arms and long fine tentacles. Its iridescent highlights are stronger than the initial soft moon-jelly render. A very faint ambient glow reaches the top edge of the source alpha bounds; the actual bell and tentacles are complete, and the prescribed padded crop retains them. Check the bright rim and subtle glow in the scene.
- Pink jellyfish: three tool calls. First source was mostly opaque; second had insufficient interior translucency. Third corrected bell and arm alpha. It is deliberately faint against some backgrounds, with reflective edges carrying much of its shape; check its scene visibility before merging.
- Sardine: accepted first generation, no horizontal flip needed.

The exact prompts below include all additions and changes from the brief. Attempts after the first used the preceding image for that subject as an edit input, except the moon's third edit used its accepted second image to shorten arms. Only the seven final PNGs and this manifest are committed.

## Exact prompts

### `art/sprites/cloud1.png`

Attempt 1:

```text
Create one high-quality 1536 × 1024 landscape PNG with true alpha transparency. A single photorealistic wide, flat-bottomed fair-weather cumulus cloud, bright white with soft grey shading underneath, lit from above by midday sun, glossy and fluffy in the style of a 2007 Frutiger Aero stock photo. Isolated on a transparent background: no sky, no blue, no other clouds. Soft natural edges that fade into transparency. Whole cloud in frame with a generous empty margin. Neutral white and grey RGB at all soft edges, no blue colour cast or fringe, no painted checkerboard, no text. A broad cloud bank with a clear horizontal flat base and rounded lobes, about three times wider than tall.
```

Attempt 2:

```text
Edit this single wide flat-bottomed cumulus cloud cut-out. Keep its distinctive silhouette, photorealistic fluffy volume and natural feathered alpha edges. Correct ALL colour to strictly neutral black-and-white photography: white and grey only, R=G=B throughout visible cloud and translucent edge pixels. No blue, cyan, purple or warm colour cast, no blue fringe, no sky. Lit from above at midday, white highlights and soft neutral grey underside. Output one high quality RGBA PNG at 1536x1024 landscape. Fit the WHOLE cloud with at least 100 pixels clear transparent margin on all sides: shrink uniformly to fit the canvas, never stretch, crop, clip or add other clouds. All four corners alpha exactly zero. Do not bake any background, glow, shadow, checkerboard, labels or text.
```

### `art/sprites/cloud2.png`

Attempt 1:

```text
Create one high-quality 1536 × 1024 landscape PNG with true alpha transparency. A single photorealistic tall, puffy cumulus with a big rounded top cloud, bright white with soft grey shading underneath, lit from above by midday sun, glossy and fluffy in the style of a 2007 Frutiger Aero stock photo. Isolated on a transparent background: no sky, no blue, no other clouds. Soft natural edges that fade into transparency. Whole cloud in frame with a generous empty margin. Neutral white and grey RGB at all soft edges, no blue colour cast or fringe, no painted checkerboard, no text. A distinctly tall towering rounded silhouette, roughly as tall as wide.
```

Attempt 2:

```text
Edit this single tall puffy rounded-top cumulus cloud cut-out. Keep its distinctive silhouette, photorealistic fluffy volume and natural feathered alpha edges. Correct ALL colour to strictly neutral black-and-white photography: white and grey only, R=G=B throughout visible cloud and translucent edge pixels. No blue, cyan, purple or warm colour cast, no blue fringe, no sky. Lit from above at midday, white highlights and soft neutral grey underside. Output one high quality RGBA PNG at 1536x1024 landscape. Fit the WHOLE cloud with at least 100 pixels clear transparent margin on all sides: shrink uniformly to fit the canvas, never stretch, crop, clip or add other clouds. All four corners alpha exactly zero. Do not bake any background, glow, shadow, checkerboard, labels or text.
```

### `art/sprites/cloud3.png`

Attempt 1:

```text
Create one high-quality 1536 × 1024 landscape PNG with true alpha transparency. A single photorealistic small, round cumulus puff cloud, bright white with soft grey shading underneath, lit from above by midday sun, glossy and fluffy in the style of a 2007 Frutiger Aero stock photo. Isolated on a transparent background: no sky, no blue, no other clouds. Soft natural edges that fade into transparency. Whole cloud in frame with a generous empty margin. Neutral white and grey RGB at all soft edges, no blue colour cast or fringe, no painted checkerboard, no text. One compact almost spherical puff, distinctly round rather than stretched.
```

Attempt 2:

```text
Edit this single compact round cumulus cloud cut-out. Keep its distinctive silhouette, photorealistic fluffy volume and natural feathered alpha edges. Correct ALL colour to strictly neutral black-and-white photography: white and grey only, R=G=B throughout visible cloud and translucent edge pixels. No blue, cyan, purple or warm colour cast, no blue fringe, no sky. Lit from above at midday, white highlights and soft neutral grey underside. Output one high quality RGBA PNG at 1536x1024 landscape. Fit the WHOLE cloud with at least 100 pixels clear transparent margin on all sides: shrink uniformly to fit the canvas, never stretch, crop, clip or add other clouds. All four corners alpha exactly zero. Do not bake any background, glow, shadow, checkerboard, labels or text.
```

### `art/sprites/cloud4.png`

Attempt 1:

```text
Create one high-quality 1536 × 1024 landscape PNG with true alpha transparency. A single photorealistic long, low, stretched cumulus cloud, bright white with soft grey shading underneath, lit from above by midday sun, glossy and fluffy in the style of a 2007 Frutiger Aero stock photo. Isolated on a transparent background: no sky, no blue, no other clouds. Soft natural edges that fade into transparency. Whole cloud in frame with a generous empty margin. Neutral white and grey RGB at all soft edges, no blue colour cast or fringe, no painted checkerboard, no text. A distinctly stretched low silhouette, about five times wider than tall.
```

Attempt 2:

```text
Edit this single long low stretched cumulus cloud cut-out. Keep its distinctive silhouette, photorealistic fluffy volume and natural feathered alpha edges. Correct ALL colour to strictly neutral black-and-white photography: white and grey only, R=G=B throughout visible cloud and translucent edge pixels. No blue, cyan, purple or warm colour cast, no blue fringe, no sky. Lit from above at midday, white highlights and soft neutral grey underside. Output one high quality RGBA PNG at 1536x1024 landscape. Fit the WHOLE cloud with at least 100 pixels clear transparent margin on all sides: shrink uniformly to fit the canvas, never stretch, crop, clip or add other clouds. All four corners alpha exactly zero. Do not bake any background, glow, shadow, checkerboard, labels or text.
```

### `art/sprites/jellyfish.png`

Attempt 1:

```text
Create one high-quality 1024 × 1536 portrait PNG with true alpha transparency. A photorealistic moon jellyfish, seen from the side, perfectly upright: a translucent, glassy dome-shaped bell at the top with four pale pink rings visible inside, and fine translucent tentacles and short frilly arms hanging straight down below it. Soft, luminous, glossy, Frutiger Aero style. Isolated on a transparent background, no water, no bubbles, no other animals. Whole jellyfish in frame with an empty margin. Both bell tissue and tentacles must have genuinely intermediate alpha, visibly see-through, with empty background alpha=0; do not paint opaque tissue against a backdrop. Symmetric upright bell, rim approximately one third down the complete subject height; tentacles originate beneath rim and descend vertically, no sideways appendages above the lower edge of the bell. No floor, cast shadow, frame, text or checkerboard.
```

Attempt 2:

```text
Edit this moon jellyfish PNG into a usable TRANSLUCENT sprite. Preserve its exact upright single-animal composition, bell outline, four pale pink rings, arms and all fine tentacles. Important correction: the existing bell is almost opaque, which fails the task. The actual PNG ALPHA CHANNEL throughout the interior of the bell must be roughly 80–170 out of 255 (30–65% opacity), not 250–255; fine tentacles and ribbon arms also need intermediate alpha, roughly 70–190. Only narrow bright specular rims may be more opaque. This must be real partial alpha that reveals any background placed beneath the sprite, NOT a painted illusion of transparent glass and NOT a coloured solid fill. Empty background alpha exactly zero including all four corners. Output high-quality RGBA transparent PNG, 1024x1536 portrait. Whole animal with generous empty margins; no water, bubbles, shadow, other animals, checkerboard or backdrop. All appendages hang beneath the bell rim, none protrude sideways above it.
```

Attempt 3:

```text
Edit this moon jellyfish cut-out, preserving its upright dome bell, FOUR pale pink internal rings, glossy photographic detail and genuinely translucent alpha. Correct only its oral arms: the frilly central oral arms must be SHORT, ending around halfway down the complete jellyfish, rather than extending almost to the bottom. Keep the fine, delicate peripheral tentacles hanging vertically down beneath the rim, extending farther than the short frilly arms. Single animal, complete silhouette, no sideways appendages above the rim. Retain the same bell size and position. Actual bell-interior alpha approximately 100–180/255, translucent arms and tentacles with intermediate alpha, background alpha exactly zero. Output high-quality 1024x1536 portrait transparent RGBA PNG with ample clear margin on every side; no water, bubbles, shadow, other animal, checkerboard, text or backdrop.
```

Attempt 4:

```text
Alpha-channel correction ONLY on this moon jellyfish PNG. Preserve the present upright shape, short central frilly arms, long fine hanging tentacles, four pink rings and all colours/details. Existing bell alpha is 252–254 and fails translucency. Change the ACTUAL RGBA PNG alpha across the entire interior of the bell to 90–170/255, including central regions between the four rings. Give the short frilly arms alpha 80–180/255 as well. Make the object genuinely see-through when composited over any background; don't just paint translucent-looking opaque glass. Narrow glossy rim highlights may remain alpha 220. Background stays alpha exactly zero including corners. Output high-quality transparent PNG 1024x1536 portrait, complete animal, no water, bubbles, shadow, other objects, checkerboard or backdrop. Keep the short arms short. Do not repaint or fill the bell with opaque lavender.
```

### `art/sprites/jellyfish2.png`

Attempt 1:

```text
Create one high-quality 1024 × 1536 portrait PNG with true alpha transparency. A photorealistic glowing jellyfish, seen from the side, perfectly upright: a translucent pink-and-violet bell at the top with a soft inner glow, and long, flowing, ribbon-like arms and fine tentacles hanging straight down below it. Luminous and glossy, Frutiger Aero style. Isolated on a transparent background, no water, no bubbles, no other animals. Whole jellyfish in frame with an empty margin. Bell and tentacles must be genuinely partly see-through with intermediate alpha; all empty space alpha=0, never an opaque painted backdrop. Keep long arms beneath the bell, not projecting sideways above its lower rim. Bell rim approximately 25% down the complete subject height. Vertical posture, no floor, shadow, text or checkerboard.
```

Attempt 2:

```text
Edit this pink-and-violet jellyfish PNG into a usable TRANSLUCENT sprite. Preserve its exact upright single-animal composition, bell outline, inner pink-violet glow, arms and all fine tentacles. Important correction: the existing bell is almost opaque, which fails the task. The actual PNG ALPHA CHANNEL throughout the interior of the bell must be roughly 80–170 out of 255 (30–65% opacity), not 250–255; fine tentacles and ribbon arms also need intermediate alpha, roughly 70–190. Only narrow bright specular rims may be more opaque. This must be real partial alpha that reveals any background placed beneath the sprite, NOT a painted illusion of transparent glass and NOT a coloured solid fill. Empty background alpha exactly zero including all four corners. Output high-quality RGBA transparent PNG, 1024x1536 portrait. Whole animal with generous empty margins; no water, bubbles, shadow, other animals, checkerboard or backdrop. All appendages hang beneath the bell rim, none protrude sideways above it.
```

Attempt 3:

```text
Edit this upright pink-and-violet jellyfish cut-out, preserving its single complete silhouette, hanging vertical arms, glossy details and transparent background. Make its material MUCH more translucent. Reduce the actual PNG alpha of ALL bell interior and ALL ribbon arms to approximately 100–160 out of 255. Let the background show through the centre, not only the outer edges. Reduce the inner glow brightness so it does not become an opaque painted pink mass. Only very thin specular lines and bell rim may reach alpha 200. Empty background must be exactly alpha zero. This is an RGBA alpha correction, not merely changing RGB brightness or painting glass effects. Output high-quality transparent PNG 1024x1536 portrait with generous empty margins, no water, bubbles, other animals, checkerboard or shadow. Bell remains at top, tentacles straight down below its rim.
```

### `art/sprites/sardine.png`

Attempt 1:

```text
Create one high-quality 1536 × 1024 landscape PNG with true alpha transparency. A photorealistic small silver sardine, exact side profile facing right, slim body, metallic silver sides with a blue-green back and a bright reflective sheen, fins spread. Isolated on a transparent background, no water, no shadow, nothing else in frame. One complete fish only, all fins and tail fully in frame with generous transparent margins, no droplets, bubbles, painted checkerboard, text or other objects. Match the crisp glossy photographic detail of a 2007 Frutiger Aero stock photo.
```
