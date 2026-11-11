# Art brief 2: everything that's still painted by code

**For:** an AI coding agent (e.g. Codex) with access to GPT Image.
**Goal:** 11 more cut-outs on transparent backgrounds, matching the photo style of the existing art. Some things are still painted by code and look flat next to the photos: the drifting clouds, the jellyfish, the small fish in the shoal, the wind turbines, the butterflies and the dolphins' splash. These images replace them. The code animates them (spins the blades, flaps the wings, pulses the jellyfish, repeats the fish), so each image is one still, clean subject.

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
| `art/sprites/sardine.png` | 1536 × 1024 | small silver-grey fish (one fish; the code repeats it to make the shoal) |
| `art/sprites/turbine_tower.png` | 1024 × 1536 (portrait) | wind turbine tower and nacelle, **no blades** |
| `art/sprites/turbine_rotor.png` | 1024 × 1024 | wind turbine rotor (3 blades + hub), front view, **no tower** |
| `art/sprites/butterfly.png` | 1024 × 1024 | blue morpho butterfly from directly above |
| `art/sprites/splash.png` | 1536 × 1024 | water splash rising from the surface |

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

> A photorealistic small silver-grey sardine, exact side profile facing right, slim streamlined body, metallic silver-grey sides with a slightly darker grey-blue back and a bright reflective sheen, fins spread. Isolated on a transparent background, no water, no shadow, nothing else in frame.

Checks:
- [ ] Faces right, clean side view, whole fish in frame.

### Wind turbine (two images)

The code stands the tower on the hills and spins the rotor on top of it, so they must be separate.

**`turbine_tower.png`**
> A photorealistic modern white wind turbine tower, tall and gently tapering, with its streamlined white nacelle housing on top, seen from the side at a slight angle. NO blades, NO rotor, NO propeller: just the tower and the nacelle, as if the blades were removed. Clean glossy white, lit by midday sun from the upper left. Isolated on a transparent background, no ground, no sky, no shadow. The whole tower is in frame, vertical and centred.

**`turbine_rotor.png`**
> The three-bladed rotor of a modern white wind turbine, seen straight on from the front: a white rounded hub in the exact centre of the image with three long, slender, gently tapered white blades exactly 120 degrees apart, one pointing straight up. Clean glossy white, lit from the upper left. Isolated on a transparent background: no tower, no nacelle, no sky. All three blade tips inside the frame.

Checks:
- [ ] The tower has **no** blades or rotor parts on it.
- [ ] The rotor has **no** tower. It's three blades at 120 degrees with the hub dead centre.
- [ ] Both are white and glossy, with no sky colour around the edges.

### Butterfly

The code cuts this image down the middle and squeezes each half towards the body to flap the wings, so it must be symmetrical, with the body exactly down the centre.

> A photorealistic blue morpho butterfly seen from directly above, wings fully open and flat, perfectly symmetrical left to right, body vertical in the exact centre of the image with the head at the top. Iridescent electric blue wings with dark edges, glossy. Isolated on a transparent background, no shadow, nothing else in frame.

Checks:
- [ ] Symmetrical, with the body exactly on the vertical centre line (within 1% of the width).

### Splash

The code puts this where a dolphin leaves or re-enters the water. It grows, then fades.

> A photorealistic splash of clear, sparkling tropical water bursting upward from a flat water surface, seen from the side at water level: a crown of water and spray with flying droplets and white foam at its base. Bright, clean, glossy, Frutiger Aero style. Isolated on a transparent background: no water surface, no sea, no sky. The splash is semi-transparent where water is thin.

Checks:
- [ ] The base of the splash (where it meets the water) is a fairly flat line along the bottom of the subject.
- [ ] There's no blue water area or sky around it, only the splash itself.

## Processing

1. Trim each image to the bounding box of pixels with alpha > 8, plus 8 px of transparent padding on every side.
2. Scale down so the longest side is at most 1024 px (clouds 1024, jellyfish 768, sardine 512).
3. Save as PNG with alpha to the paths in the table.
4. Special cases. These matter, because the code relies on them:
   - **`turbine_rotor.png`:** make it square with the **hub at the exact centre**. Pad or crop evenly around the hub, not around the bounding box. Size 512 × 512.
   - **`turbine_tower.png`:** the bottom of the tower must touch the bottom edge of the image (no padding below it). Longest side 1024.
   - **`butterfly.png`:** pad evenly left and right so the body stays on the exact vertical centre line. Size 512 wide.
   - **`splash.png`:** the base of the splash must touch the bottom edge of the image (no padding below it). Longest side 768.

## Write `art/MANIFEST_2.md`

Include:
- for each file: its final size, the prompt used (plus any changes) and how many tries it took
- for each jellyfish: the **bell fraction**, which is the row where the bell's rim is divided by the image height (for example `0.38`)
- for `turbine_tower.png`: the **hub point**, which is where the rotor's centre should go on the front of the nacelle, as fractions of the image width and height (for example `[0.5, 0.05]`)
- for `turbine_rotor.png`: the **blade length** (hub centre to blade tip) as a fraction of the image width
- anything that didn't come out as asked

## Hand-off

1. Work on a branch named `art-v2`, created from `main`. If your environment names branches itself, any name is fine.
2. Commit only the 11 images and `art/MANIFEST_2.md`.
3. Push the branch, or let it become a pull request into `main`. **Don't merge it.** Claude will set the jellyfish bell fractions and the turbine hub point, then check everything in the scene first.
4. Finish by summarising what you made and anything that needs a second look.
