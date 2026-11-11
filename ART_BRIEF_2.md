# Art brief 2: clouds, jellyfish and the shoal

**For:** an AI coding agent (e.g. Codex) with access to GPT Image.
**Goal:** 7 more cut-outs on transparent backgrounds, matching the photo style of the existing art. Some things are still painted by code and look flat next to the photos: the drifting clouds, the jellyfish and the small fish in the shoal. These images replace them. The code animates them, so each image is one still, clean subject.

Read this whole file before starting. Follow the same rules as `ART_BRIEF.md`:
- Use GPT Image at high quality.
- Use a truly transparent background (corner alpha = 0; a painted checkerboard is a failure).
- Don't change any code files or existing images.

## What to make

| File | Generate at | Subject |
| --- | --- | --- |
| `art/sprites/cloud1.png` | 1536 × 1024 | wide, flat-bottomed fair-weather cumulus |
| `art/sprites/cloud2.png` | 1536 × 1024 | tall, puffy cumulus with a big rounded top |
| `art/sprites/cloud3.png` | 1536 × 1024 | small, round cumulus puff |
| `art/sprites/cloud4.png` | 1536 × 1024 | long, low, stretched cumulus |
| `art/sprites/jellyfish.png` | 1024 × 1536 (portrait) | moon jellyfish |
| `art/sprites/jellyfish2.png` | 1024 × 1536 (portrait) | pink-and-violet glowing jellyfish |
| `art/sprites/sardine.png` | 1536 × 1024 | small silver sardine |

### Clouds

Template (fill in the shape from the table):
> A single photorealistic [SHAPE] cloud, bright white with soft grey shading underneath, lit from above by midday sun, glossy and fluffy in the style of a 2007 Frutiger Aero stock photo. Isolated on a transparent background: no sky, no blue, no other clouds. Soft natural edges that fade into transparency. Whole cloud in frame with a generous empty margin.

Checks:
- [ ] There's no blue sky colour or blue fringe around the edges. The edges are white or grey and fade to transparent.
- [ ] Nothing is cut off at the image border.
- [ ] Each of the four is a clearly different shape.

### Jellyfish

The code splits each jellyfish into the **bell** (top) and the **tentacles** (below). It pulses the bell and waves the tentacles. So the jellyfish must be upright, with the bell at the top and everything else hanging straight down beneath it.

**`jellyfish.png`**
> A photorealistic moon jellyfish, seen from the side, perfectly upright: a translucent, glassy dome-shaped bell at the top with four pale pink rings visible inside, and fine translucent tentacles and short frilly arms hanging straight down below it. Soft, luminous, glossy, Frutiger Aero style. Isolated on a transparent background, no water, no bubbles, no other animals. Whole jellyfish in frame with an empty margin.

**`jellyfish2.png`**
> A photorealistic glowing jellyfish, seen from the side, perfectly upright: a translucent pink-and-violet bell at the top with a soft inner glow, and long, flowing, ribbon-like arms and fine tentacles hanging straight down below it. Luminous and glossy, Frutiger Aero style. Isolated on a transparent background, no water, no bubbles, no other animals. Whole jellyfish in frame with an empty margin.

Checks:
- [ ] Upright, with the bell at the top and nothing sticking out sideways above the bell's lower edge.
- [ ] The bell and tentacles are translucent (partly see-through alpha), not solid. Make sure they're not painted opaque on top of a backdrop colour.
- [ ] Measure where the bell ends: the row where the bell's rim is, as a fraction of the final image height. Record it in the manifest (see below).

### Sardine

> A photorealistic small silver sardine, exact side profile facing right, slim body, metallic silver sides with a blue-green back and a bright reflective sheen, fins spread. Isolated on a transparent background, no water, no shadow, nothing else in frame.

Checks:
- [ ] Faces right, clean side view, whole fish in frame.

## Processing

1. Trim each image to the bounding box of pixels with alpha > 8, plus 8 px of transparent padding on every side.
2. Scale down so the longest side is at most 1024 px (clouds 1024, jellyfish 768, sardine 512).
3. Save as PNG with alpha to the paths in the table.

## Write `art/MANIFEST_2.md`

Include:
- for each file: its final size, the prompt used (plus any changes) and how many tries it took
- for each jellyfish: the **bell fraction**, which is the row where the bell's rim is divided by the image height (for example `0.38`)
- anything that didn't come out as asked

## Hand-off

1. Work on a branch named `art-v2`, created from `main`. If your environment names branches itself, any name is fine.
2. Commit only the 7 images and `art/MANIFEST_2.md`.
3. Push the branch, or let it become a pull request into `main`. **Don't merge it.** Claude will set the jellyfish bell fractions and check everything in the scene first.
4. Finish by summarising what you made and anything that needs a second look.
