# Phase 1 animation experiment

Result: **FAIL — stopped before Phase 2.** The turtle failed after three complete, independently generated 12-frame attempts. The clownfish received one complete 8-frame attempt before the turtle exhausted its retry limit. Following the brief, this branch contains only preview GIFs and these notes. `manifest.json` remains `{}`; no playback strips are enabled. Existing code, plates and sprites are unchanged.

## Model, settings and inputs

Used the built-in GPT Image generation/edit tool, `image_gen.imagegen`, with `transparent_background: true` and explicit local reference paths. The tool exposes neither an exact GPT Image model revision nor numeric quality/size controls; every prompt requested high quality, transparent PNG and 1536 × 1024. All 44 outputs were RGBA PNGs at 1536 × 1024. No generated frame was used as another frame's reference.

The original 1024 × 352 turtle cut-out was placed without scaling at (256,336) on a transparent 1536 × 1024 working canvas. The original 1024 × 553 clownfish was placed without scaling at (256,236). Each frame edit received its animal's original padded reference. Turtle attempt 3 also received the unmodified original `art/sprites/turtle.png` as a second identity reference. These preparatory canvases are scratch files; the source sprites were never modified.

## Checks and decision

| Sequence | Rigid patch stays within 3 px | Colours and patterns stable | Smooth, clear motion | Seamless last→first | Result |
| --- | --- | --- | --- | --- | --- |
| Turtle attempt 1 | Pass | Fail: shell highlights/texture shimmer | Fail: abrupt, inconsistent front-flipper poses | Fail: shape/texture change at seam | Rejected |
| Turtle attempt 2 | Pass | Fail: fine shell texture changes | Fail: flipper shape and foreshortening change abruptly, especially 2→3 | Fail: flipper and shell appearance jump | Rejected |
| Turtle attempt 3 | Pass | Fail: shell texture still redraws | Fail: smaller stroke still has uneven flipper proportions/pose steps | Fail: visible pose/texture step | Rejected; stop limit reached |
| Clownfish attempt 1 | Pass | Fail: small scale/highlight and fin-detail flicker | Fail: irregular pectoral-fin changes accompany tail narrowing | Fail: residual fin/texture step | Not accepted; no further retry after turtle stop condition |

All frames retain a single complete right-facing animal, with no water, bubbles or second animal. The tool's initial dark-backed display appeared to show a broad halo, but compositing the actual alpha against teal showed clean surrounding space; that display alone was not treated as a failure. A few raw turtle corner pixels have alpha 1–2 instead of exactly zero (attempt 1: frames 0 and 9; attempt 2: frame 5). Attempt 3 and all clownfish raw frames have zero alpha at all four corners. No painted checkerboard was present. Texture/motion failures remain independently of that corner noise.

The decision is based on side-by-side frame contact sheets, the PNG patch comparisons, and GIF playback in headless Chromium. The shared desktop browser could not start (`the gaas-browser node_repl sandbox cannot be disabled`); the installed system Chromium successfully played all eight full-animation/rigid-crop previews. Screenshots at several playback phases confirmed changing frames. These are rejected test loops, not production-ready animation.

## Measurement and processing

For each attempt, found the union of every source frame's alpha > 8 bounds, added 8 px on all sides, and applied the identical crop to every frame. Then scaled proportionally to width 512 for turtle or 384 for clownfish. No per-frame alignment, separate trim, colour correction, optical flow, interpolation, shell replacement or pose repair was used. The preview composites use a flat teal backdrop to show soft alpha edges. The GIFs are for inspection only; their palette quantisation may add small errors, so PNG measurements were used for rigid stability and texture comparisons.

Turtle previews run at 10 fps (12 frames, 1.2 s). Clownfish runs approximately 12 fps using GIF delays 80,80,90,80,80,90,80,80 ms (8 frames, 0.66 s). All loop indefinitely. Each `*-rigid.gif` is a fixed source-coordinate shell/head crop with identical framing, allowing inspection without relying on the whole-animal bounding box.

Rigid comparisons use turtle source patch (620,370)–(900,450), clownfish head patch (1140,430)–(1240,530), excluding the moving fins. For each frame, searched translations ±12 source pixels to minimise mean absolute RGB error against frame 0's patch. Reported displacement is scaled to final frame width. Maximum pairwise displacement is below 1 px for every sequence, comfortably inside 3 px. Low displacement does **not** establish pattern stability: the aligned shell patch still changes considerably. RGB error is supporting evidence, not an invented pass threshold.

| Sequence | Common crop (left,top,right,bottom) | Final frame | Max aligned patch RGB error (0–255) | Preview |
| --- | --- | --- | ---: | --- |
| turtle-attempt-1 | (246, 331, 1284, 750) | 512 × 207 | 13.89 | [Loop](preview/turtle-attempt-1.gif), [rigid crop](preview/turtle-attempt-1-rigid.gif) |
| turtle-attempt-2 | (248, 331, 1284, 751) | 512 × 208 | 12.87 | [Loop](preview/turtle-attempt-2.gif), [rigid crop](preview/turtle-attempt-2-rigid.gif) |
| turtle-attempt-3 | (243, 331, 1285, 717) | 512 × 190 | 13.1 | [Loop](preview/turtle-attempt-3.gif), [rigid crop](preview/turtle-attempt-3-rigid.gif) |
| clownfish-attempt-1 | (222, 179, 1292, 820) | 384 × 230 | 4.84 | [Loop](preview/clownfish-attempt-1.gif), [rigid crop](preview/clownfish-attempt-1-rigid.gif) |

## Attempts and exact prompts

The turtle attempts deliberately changed approach: (1) relative angular phases; (2) explicit large elliptical flipper-tip coordinates; (3) a smaller stroke, restricted retouch region and extra original identity reference. All were genuine complete generation attempts, with a fresh reference-based edit for each frame. No identical frame was duplicated to make a loop appear stable. Clownfish used tail-width phases and a fixed head. After turtle attempt 3 failed, generation stopped rather than continuing to Phase 2 or retrying the clownfish.

Below are the exact submitted prompts, including coordinates, phase values and changes to the brief. Frame indices are zero-based and play in listed order.

### turtle-attempt-1

Frame 0:

```text
Edit the input reference turtle into frame 0 of a 12-frame seamless swim loop. Output a single 1536x1024 high-quality PNG with true transparent background. Keep the exact canvas, turtle position, size, right-facing side view, lighting, colours and every shell scute and marking unchanged. Only change: near front flipper rotated forward and up by 25 degrees from the reference at its shoulder; rear flipper 5 degrees up; head unchanged. Whole turtle in frame, no water, bubbles, droplets, shadow or second animal. Preserve the shell pixels and silhouette exactly; never recenter or enlarge.
```

Frame 1:

```text
Edit the supplied original turtle reference into frame 1 of a 12-frame seamless swim cycle. Single high quality 1536x1024 PNG, true transparent background. Keep the exact canvas, turtle position, size, right-facing side view, lighting, colours and every shell scute and marking unchanged. Only change: rotate the near front flipper 22 degrees forward/up from the reference at its shoulder (negative means down/back); rear flipper 4 degrees up; head vertical offset 1 pixels. Shell fixed pixel-for-pixel. Whole animal in frame. No halo, shadow, water, bubbles, droplets, second animal, or background. Do not recenter or enlarge.
```

Frame 2:

```text
Edit the supplied original turtle reference into frame 2 of a 12-frame seamless swim cycle. Single high quality 1536x1024 PNG, true transparent background. Keep the exact canvas, turtle position, size, right-facing side view, lighting, colours and every shell scute and marking unchanged. Only change: rotate the near front flipper 13 degrees forward/up from the reference at its shoulder (negative means down/back); rear flipper 3 degrees up; head vertical offset 2 pixels. Shell fixed pixel-for-pixel. Whole animal in frame. No halo, shadow, water, bubbles, droplets, second animal, or background. Do not recenter or enlarge.
```

Frame 3:

```text
Edit the supplied original turtle reference into frame 3 of a 12-frame seamless swim cycle. Single high quality 1536x1024 PNG, true transparent background. Keep the exact canvas, turtle position, size, right-facing side view, lighting, colours and every shell scute and marking unchanged. Only change: rotate the near front flipper 0 degrees forward/up from the reference at its shoulder (negative means down/back); rear flipper 0 degrees up; head vertical offset 2 pixels. Shell fixed pixel-for-pixel. Whole animal in frame. No halo, shadow, water, bubbles, droplets, second animal, or background. Do not recenter or enlarge.
```

Frame 4:

```text
Edit the supplied original turtle reference into frame 4 of a 12-frame seamless swim cycle. Single high quality 1536x1024 PNG, true transparent background. Keep the exact canvas, turtle position, size, right-facing side view, lighting, colours and every shell scute and marking unchanged. Only change: rotate the near front flipper -12 degrees forward/up from the reference at its shoulder (negative means down/back); rear flipper -2 degrees up; head vertical offset 2 pixels. Shell fixed pixel-for-pixel. Whole animal in frame. No halo, shadow, water, bubbles, droplets, second animal, or background. Do not recenter or enlarge.
```

Frame 5:

```text
Edit the supplied original turtle reference into frame 5 of a 12-frame seamless swim cycle. Single high quality 1536x1024 PNG, true transparent background. Keep the exact canvas, turtle position, size, right-facing side view, lighting, colours and every shell scute and marking unchanged. Only change: rotate the near front flipper -22 degrees forward/up from the reference at its shoulder (negative means down/back); rear flipper -4 degrees up; head vertical offset 1 pixels. Shell fixed pixel-for-pixel. Whole animal in frame. No halo, shadow, water, bubbles, droplets, second animal, or background. Do not recenter or enlarge.
```

Frame 6:

```text
Edit the supplied original turtle reference into frame 6 of a 12-frame seamless swim cycle. Single high quality 1536x1024 PNG, true transparent background. Keep the exact canvas, turtle position, size, right-facing side view, lighting, colours and every shell scute and marking unchanged. Only change: rotate the near front flipper -25 degrees forward/up from the reference at its shoulder (negative means down/back); rear flipper -5 degrees up; head vertical offset 0 pixels. Shell fixed pixel-for-pixel. Whole animal in frame. No halo, shadow, water, bubbles, droplets, second animal, or background. Do not recenter or enlarge.
```

Frame 7:

```text
Edit the supplied original turtle reference into frame 7 of a 12-frame seamless swim cycle. Single high quality 1536x1024 PNG, true transparent background. Keep the exact canvas, turtle position, size, right-facing side view, lighting, colours and every shell scute and marking unchanged. Only change: rotate the near front flipper -22 degrees forward/up from the reference at its shoulder (negative means down/back); rear flipper -4 degrees up; head vertical offset -1 pixels. Shell fixed pixel-for-pixel. Whole animal in frame. No halo, shadow, water, bubbles, droplets, second animal, or background. Do not recenter or enlarge.
```

Frame 8:

```text
Edit the supplied original turtle reference into frame 8 of a 12-frame seamless swim cycle. Single high quality 1536x1024 PNG, true transparent background. Keep the exact canvas, turtle position, size, right-facing side view, lighting, colours and every shell scute and marking unchanged. Only change: rotate the near front flipper -13 degrees forward/up from the reference at its shoulder (negative means down/back); rear flipper -3 degrees up; head vertical offset -2 pixels. Shell fixed pixel-for-pixel. Whole animal in frame. No halo, shadow, water, bubbles, droplets, second animal, or background. Do not recenter or enlarge.
```

Frame 9:

```text
Edit the supplied original turtle reference into frame 9 of a 12-frame seamless swim cycle. Single high quality 1536x1024 PNG, true transparent background. Keep the exact canvas, turtle position, size, right-facing side view, lighting, colours and every shell scute and marking unchanged. Only change: rotate the near front flipper 0 degrees forward/up from the reference at its shoulder (negative means down/back); rear flipper 0 degrees up; head vertical offset -2 pixels. Shell fixed pixel-for-pixel. Whole animal in frame. No halo, shadow, water, bubbles, droplets, second animal, or background. Do not recenter or enlarge.
```

Frame 10:

```text
Edit the supplied original turtle reference into frame 10 of a 12-frame seamless swim cycle. Single high quality 1536x1024 PNG, true transparent background. Keep the exact canvas, turtle position, size, right-facing side view, lighting, colours and every shell scute and marking unchanged. Only change: rotate the near front flipper 13 degrees forward/up from the reference at its shoulder (negative means down/back); rear flipper 3 degrees up; head vertical offset -2 pixels. Shell fixed pixel-for-pixel. Whole animal in frame. No halo, shadow, water, bubbles, droplets, second animal, or background. Do not recenter or enlarge.
```

Frame 11:

```text
Edit the supplied original turtle reference into frame 11 of a 12-frame seamless swim cycle. Single high quality 1536x1024 PNG, true transparent background. Keep the exact canvas, turtle position, size, right-facing side view, lighting, colours and every shell scute and marking unchanged. Only change: rotate the near front flipper 22 degrees forward/up from the reference at its shoulder (negative means down/back); rear flipper 4 degrees up; head vertical offset -1 pixels. Shell fixed pixel-for-pixel. Whole animal in frame. No halo, shadow, water, bubbles, droplets, second animal, or background. Do not recenter or enlarge.
```

### clownfish-attempt-1

Frame 0:

```text
Edit the supplied original clownfish reference into frame 0 of an 8-frame seamless swim cycle. One high quality 1536x1024 transparent PNG. Same individual fish, exact right-facing side view, position, scale, colours, stripe boundaries, lighting and canvas. Keep the head perfectly still, with its original pixels at original coordinates. Only change: tail fin fully broad side-on; posterior body flex 0 degrees in depth at the tail peduncle; pectoral fin flutter 0 degrees. The side-on tail narrows and widens in perspective, never swings vertically. Preserve all rigid head and body markings. Single complete fish, no shadow, glow, halo, water, bubbles, second animal or background. Outside the fish must be alpha zero. Never recenter or resize.
```

Frame 1:

```text
Edit the supplied original clownfish reference into frame 1 of an 8-frame seamless swim cycle. One high quality 1536x1024 transparent PNG. Same individual fish, exact right-facing side view, position, scale, colours, stripe boundaries, lighting and canvas. Keep the head perfectly still, with its original pixels at original coordinates. Only change: tail fin 75% of original apparent width, turning away; posterior body flex 2 degrees in depth at the tail peduncle; pectoral fin flutter 5 degrees. The side-on tail narrows and widens in perspective, never swings vertically. Preserve all rigid head and body markings. Single complete fish, no shadow, glow, halo, water, bubbles, second animal or background. Outside the fish must be alpha zero. Never recenter or resize.
```

Frame 2:

```text
Edit the supplied original clownfish reference into frame 2 of an 8-frame seamless swim cycle. One high quality 1536x1024 transparent PNG. Same individual fish, exact right-facing side view, position, scale, colours, stripe boundaries, lighting and canvas. Keep the head perfectly still, with its original pixels at original coordinates. Only change: tail fin 45% of original apparent width, away extreme; posterior body flex 4 degrees in depth at the tail peduncle; pectoral fin flutter 10 degrees. The side-on tail narrows and widens in perspective, never swings vertically. Preserve all rigid head and body markings. Single complete fish, no shadow, glow, halo, water, bubbles, second animal or background. Outside the fish must be alpha zero. Never recenter or resize.
```

Frame 3:

```text
Edit the supplied original clownfish reference into frame 3 of an 8-frame seamless swim cycle. One high quality 1536x1024 transparent PNG. Same individual fish, exact right-facing side view, position, scale, colours, stripe boundaries, lighting and canvas. Keep the head perfectly still, with its original pixels at original coordinates. Only change: tail fin 75% of original apparent width, returning; posterior body flex 2 degrees in depth at the tail peduncle; pectoral fin flutter 5 degrees. The side-on tail narrows and widens in perspective, never swings vertically. Preserve all rigid head and body markings. Single complete fish, no shadow, glow, halo, water, bubbles, second animal or background. Outside the fish must be alpha zero. Never recenter or resize.
```

Frame 4:

```text
Edit the supplied original clownfish reference into frame 4 of an 8-frame seamless swim cycle. One high quality 1536x1024 transparent PNG. Same individual fish, exact right-facing side view, position, scale, colours, stripe boundaries, lighting and canvas. Keep the head perfectly still, with its original pixels at original coordinates. Only change: tail fin fully broad side-on; posterior body flex 0 degrees in depth at the tail peduncle; pectoral fin flutter 0 degrees. The side-on tail narrows and widens in perspective, never swings vertically. Preserve all rigid head and body markings. Single complete fish, no shadow, glow, halo, water, bubbles, second animal or background. Outside the fish must be alpha zero. Never recenter or resize.
```

Frame 5:

```text
Edit the supplied original clownfish reference into frame 5 of an 8-frame seamless swim cycle. One high quality 1536x1024 transparent PNG. Same individual fish, exact right-facing side view, position, scale, colours, stripe boundaries, lighting and canvas. Keep the head perfectly still, with its original pixels at original coordinates. Only change: tail fin 75% of original apparent width, turning towards camera; posterior body flex -2 degrees in depth at the tail peduncle; pectoral fin flutter -5 degrees. The side-on tail narrows and widens in perspective, never swings vertically. Preserve all rigid head and body markings. Single complete fish, no shadow, glow, halo, water, bubbles, second animal or background. Outside the fish must be alpha zero. Never recenter or resize.
```

Frame 6:

```text
Edit the supplied original clownfish reference into frame 6 of an 8-frame seamless swim cycle. One high quality 1536x1024 transparent PNG. Same individual fish, exact right-facing side view, position, scale, colours, stripe boundaries, lighting and canvas. Keep the head perfectly still, with its original pixels at original coordinates. Only change: tail fin 45% of original apparent width, towards extreme; posterior body flex -4 degrees in depth at the tail peduncle; pectoral fin flutter -10 degrees. The side-on tail narrows and widens in perspective, never swings vertically. Preserve all rigid head and body markings. Single complete fish, no shadow, glow, halo, water, bubbles, second animal or background. Outside the fish must be alpha zero. Never recenter or resize.
```

Frame 7:

```text
Edit the supplied original clownfish reference into frame 7 of an 8-frame seamless swim cycle. One high quality 1536x1024 transparent PNG. Same individual fish, exact right-facing side view, position, scale, colours, stripe boundaries, lighting and canvas. Keep the head perfectly still, with its original pixels at original coordinates. Only change: tail fin 75% of original apparent width, returning; posterior body flex -2 degrees in depth at the tail peduncle; pectoral fin flutter -5 degrees. The side-on tail narrows and widens in perspective, never swings vertically. Preserve all rigid head and body markings. Single complete fish, no shadow, glow, halo, water, bubbles, second animal or background. Outside the fish must be alpha zero. Never recenter or resize.
```

### turtle-attempt-2

Frame 0:

```text
Minimal local image edit of the ORIGINAL turtle reference. Output one high quality 1536x1024 RGBA PNG. This is frame 0/12, phase 0 degrees. Keep all pixels of the rigid shell exactly unchanged: every scute boundary, scratch, highlight, colour, silhouette and position. Turtle remains facing right. Do not repaint or relight it. Only pose change: the near front flipper pivots at shoulder (1045,490), its tip should now be at (875,520) in this 1536x1024 canvas, forming a natural flipper silhouette with the SAME scales. Rear flipper paddles by 0 degrees; head bobs 0 px vertically. Do not rotate or translate the shell. Preserve the original transparent background: alpha exactly zero outside the animal, including every corner. No glow, haze, halo, shadow, water, bubbles or additional animal. Never zoom, crop or recenter.
```

Frame 1:

```text
Minimal local image edit of the ORIGINAL turtle reference. Output one high quality 1536x1024 RGBA PNG. This is frame 1/12, phase 30 degrees. Keep all pixels of the rigid shell exactly unchanged: every scute boundary, scratch, highlight, colour, silhouette and position. Turtle remains facing right. Do not repaint or relight it. Only pose change: the near front flipper pivots at shoulder (1045,490), its tip should now be at (925,533) in this 1536x1024 canvas, forming a natural flipper silhouette with the SAME scales. Rear flipper paddles by 2 degrees; head bobs 0 px vertically. Do not rotate or translate the shell. Preserve the original transparent background: alpha exactly zero outside the animal, including every corner. No glow, haze, halo, shadow, water, bubbles or additional animal. Never zoom, crop or recenter.
```

Frame 2:

```text
Minimal local image edit of the ORIGINAL turtle reference. Output one high quality 1536x1024 RGBA PNG. This is frame 2/12, phase 60 degrees. Keep all pixels of the rigid shell exactly unchanged: every scute boundary, scratch, highlight, colour, silhouette and position. Turtle remains facing right. Do not repaint or relight it. Only pose change: the near front flipper pivots at shoulder (1045,490), its tip should now be at (962,570) in this 1536x1024 canvas, forming a natural flipper silhouette with the SAME scales. Rear flipper paddles by 3 degrees; head bobs 1 px vertically. Do not rotate or translate the shell. Preserve the original transparent background: alpha exactly zero outside the animal, including every corner. No glow, haze, halo, shadow, water, bubbles or additional animal. Never zoom, crop or recenter.
```

Frame 3:

```text
Minimal local image edit of the ORIGINAL turtle reference. Output one high quality 1536x1024 RGBA PNG. This is frame 3/12, phase 90 degrees. Keep all pixels of the rigid shell exactly unchanged: every scute boundary, scratch, highlight, colour, silhouette and position. Turtle remains facing right. Do not repaint or relight it. Only pose change: the near front flipper pivots at shoulder (1045,490), its tip should now be at (975,620) in this 1536x1024 canvas, forming a natural flipper silhouette with the SAME scales. Rear flipper paddles by 4 degrees; head bobs 1 px vertically. Do not rotate or translate the shell. Preserve the original transparent background: alpha exactly zero outside the animal, including every corner. No glow, haze, halo, shadow, water, bubbles or additional animal. Never zoom, crop or recenter.
```

Frame 4:

```text
Minimal local image edit of the ORIGINAL turtle reference. Output one high quality 1536x1024 RGBA PNG. This is frame 4/12, phase 120 degrees. Keep all pixels of the rigid shell exactly unchanged: every scute boundary, scratch, highlight, colour, silhouette and position. Turtle remains facing right. Do not repaint or relight it. Only pose change: the near front flipper pivots at shoulder (1045,490), its tip should now be at (962,670) in this 1536x1024 canvas, forming a natural flipper silhouette with the SAME scales. Rear flipper paddles by 3 degrees; head bobs 1 px vertically. Do not rotate or translate the shell. Preserve the original transparent background: alpha exactly zero outside the animal, including every corner. No glow, haze, halo, shadow, water, bubbles or additional animal. Never zoom, crop or recenter.
```

Frame 5:

```text
Minimal local image edit of the ORIGINAL turtle reference. Output one high quality 1536x1024 RGBA PNG. This is frame 5/12, phase 150 degrees. Keep all pixels of the rigid shell exactly unchanged: every scute boundary, scratch, highlight, colour, silhouette and position. Turtle remains facing right. Do not repaint or relight it. Only pose change: the near front flipper pivots at shoulder (1045,490), its tip should now be at (925,707) in this 1536x1024 canvas, forming a natural flipper silhouette with the SAME scales. Rear flipper paddles by 2 degrees; head bobs 0 px vertically. Do not rotate or translate the shell. Preserve the original transparent background: alpha exactly zero outside the animal, including every corner. No glow, haze, halo, shadow, water, bubbles or additional animal. Never zoom, crop or recenter.
```

Frame 6:

```text
Minimal local image edit of the ORIGINAL turtle reference. Output one high quality 1536x1024 RGBA PNG. This is frame 6/12, phase 180 degrees. Keep all pixels of the rigid shell exactly unchanged: every scute boundary, scratch, highlight, colour, silhouette and position. Turtle remains facing right. Do not repaint or relight it. Only pose change: the near front flipper pivots at shoulder (1045,490), its tip should now be at (875,720) in this 1536x1024 canvas, forming a natural flipper silhouette with the SAME scales. Rear flipper paddles by 0 degrees; head bobs 0 px vertically. Do not rotate or translate the shell. Preserve the original transparent background: alpha exactly zero outside the animal, including every corner. No glow, haze, halo, shadow, water, bubbles or additional animal. Never zoom, crop or recenter.
```

Frame 7:

```text
Minimal local image edit of the ORIGINAL turtle reference. Output one high quality 1536x1024 RGBA PNG. This is frame 7/12, phase 210 degrees. Keep all pixels of the rigid shell exactly unchanged: every scute boundary, scratch, highlight, colour, silhouette and position. Turtle remains facing right. Do not repaint or relight it. Only pose change: the near front flipper pivots at shoulder (1045,490), its tip should now be at (825,707) in this 1536x1024 canvas, forming a natural flipper silhouette with the SAME scales. Rear flipper paddles by -2 degrees; head bobs 0 px vertically. Do not rotate or translate the shell. Preserve the original transparent background: alpha exactly zero outside the animal, including every corner. No glow, haze, halo, shadow, water, bubbles or additional animal. Never zoom, crop or recenter.
```

Frame 8:

```text
Minimal local image edit of the ORIGINAL turtle reference. Output one high quality 1536x1024 RGBA PNG. This is frame 8/12, phase 240 degrees. Keep all pixels of the rigid shell exactly unchanged: every scute boundary, scratch, highlight, colour, silhouette and position. Turtle remains facing right. Do not repaint or relight it. Only pose change: the near front flipper pivots at shoulder (1045,490), its tip should now be at (788,670) in this 1536x1024 canvas, forming a natural flipper silhouette with the SAME scales. Rear flipper paddles by -3 degrees; head bobs -1 px vertically. Do not rotate or translate the shell. Preserve the original transparent background: alpha exactly zero outside the animal, including every corner. No glow, haze, halo, shadow, water, bubbles or additional animal. Never zoom, crop or recenter.
```

Frame 9:

```text
Minimal local image edit of the ORIGINAL turtle reference. Output one high quality 1536x1024 RGBA PNG. This is frame 9/12, phase 270 degrees. Keep all pixels of the rigid shell exactly unchanged: every scute boundary, scratch, highlight, colour, silhouette and position. Turtle remains facing right. Do not repaint or relight it. Only pose change: the near front flipper pivots at shoulder (1045,490), its tip should now be at (775,620) in this 1536x1024 canvas, forming a natural flipper silhouette with the SAME scales. Rear flipper paddles by -4 degrees; head bobs -1 px vertically. Do not rotate or translate the shell. Preserve the original transparent background: alpha exactly zero outside the animal, including every corner. No glow, haze, halo, shadow, water, bubbles or additional animal. Never zoom, crop or recenter.
```

Frame 10:

```text
Minimal local image edit of the ORIGINAL turtle reference. Output one high quality 1536x1024 RGBA PNG. This is frame 10/12, phase 300 degrees. Keep all pixels of the rigid shell exactly unchanged: every scute boundary, scratch, highlight, colour, silhouette and position. Turtle remains facing right. Do not repaint or relight it. Only pose change: the near front flipper pivots at shoulder (1045,490), its tip should now be at (788,570) in this 1536x1024 canvas, forming a natural flipper silhouette with the SAME scales. Rear flipper paddles by -3 degrees; head bobs -1 px vertically. Do not rotate or translate the shell. Preserve the original transparent background: alpha exactly zero outside the animal, including every corner. No glow, haze, halo, shadow, water, bubbles or additional animal. Never zoom, crop or recenter.
```

Frame 11:

```text
Minimal local image edit of the ORIGINAL turtle reference. Output one high quality 1536x1024 RGBA PNG. This is frame 11/12, phase 330 degrees. Keep all pixels of the rigid shell exactly unchanged: every scute boundary, scratch, highlight, colour, silhouette and position. Turtle remains facing right. Do not repaint or relight it. Only pose change: the near front flipper pivots at shoulder (1045,490), its tip should now be at (825,533) in this 1536x1024 canvas, forming a natural flipper silhouette with the SAME scales. Rear flipper paddles by -2 degrees; head bobs -1 px vertically. Do not rotate or translate the shell. Preserve the original transparent background: alpha exactly zero outside the animal, including every corner. No glow, haze, halo, shadow, water, bubbles or additional animal. Never zoom, crop or recenter.
```

### turtle-attempt-3

Frame 0:

```text
Use both supplied images of the SAME turtle: first is the fixed output canvas, second is the original detailed cut-out for identity. Produce ONE 1536x1024 high quality transparent PNG, frame 0 of 12 at phase 0 degrees. Treat this as a restricted local retouch, not a new turtle render. Copy the entire rigid shell from input one verbatim at its original coordinates, including its brown/green scute texture, white seam network, highlights and alpha edge. Keep its head, shell and torso locked. Only change the front flipper within rectangle x=720..1110,y=470..735: same anatomical length and scale pattern, shoulder fixed at (1045,490), flipper tip (850,595). This is a SMALL gentle stroke; keep flipper fully extended without shortening, curling or changing perspective. Rear flipper gentle 0 degree paddle; head at most 0 px vertical bob. Preserve all other pixels and original lighting. Exact right-facing side profile, complete silhouette. Transparent alpha=0 outside animal. No halo, glow, shadow, water, bubbles, droplets or other animal. No repositioning, rescaling, cropping, new highlights or pattern redraw.
```

Frame 1:

```text
Use both supplied images of the SAME turtle: first is the fixed output canvas, second is the original detailed cut-out for identity. Produce ONE 1536x1024 high quality transparent PNG, frame 1 of 12 at phase 30 degrees. Treat this as a restricted local retouch, not a new turtle render. Copy the entire rigid shell from input one verbatim at its original coordinates, including its brown/green scute texture, white seam network, highlights and alpha edge. Keep its head, shell and torso locked. Only change the front flipper within rectangle x=720..1110,y=470..735: same anatomical length and scale pattern, shoulder fixed at (1045,490), flipper tip (870,602). This is a SMALL gentle stroke; keep flipper fully extended without shortening, curling or changing perspective. Rear flipper gentle 1 degree paddle; head at most 0 px vertical bob. Preserve all other pixels and original lighting. Exact right-facing side profile, complete silhouette. Transparent alpha=0 outside animal. No halo, glow, shadow, water, bubbles, droplets or other animal. No repositioning, rescaling, cropping, new highlights or pattern redraw.
```

Frame 2:

```text
Use both supplied images of the SAME turtle: first is the fixed output canvas, second is the original detailed cut-out for identity. Produce ONE 1536x1024 high quality transparent PNG, frame 2 of 12 at phase 60 degrees. Treat this as a restricted local retouch, not a new turtle render. Copy the entire rigid shell from input one verbatim at its original coordinates, including its brown/green scute texture, white seam network, highlights and alpha edge. Keep its head, shell and torso locked. Only change the front flipper within rectangle x=720..1110,y=470..735: same anatomical length and scale pattern, shoulder fixed at (1045,490), flipper tip (885,623). This is a SMALL gentle stroke; keep flipper fully extended without shortening, curling or changing perspective. Rear flipper gentle 2 degree paddle; head at most 1 px vertical bob. Preserve all other pixels and original lighting. Exact right-facing side profile, complete silhouette. Transparent alpha=0 outside animal. No halo, glow, shadow, water, bubbles, droplets or other animal. No repositioning, rescaling, cropping, new highlights or pattern redraw.
```

Frame 3:

```text
Use both supplied images of the SAME turtle: first is the fixed output canvas, second is the original detailed cut-out for identity. Produce ONE 1536x1024 high quality transparent PNG, frame 3 of 12 at phase 90 degrees. Treat this as a restricted local retouch, not a new turtle render. Copy the entire rigid shell from input one verbatim at its original coordinates, including its brown/green scute texture, white seam network, highlights and alpha edge. Keep its head, shell and torso locked. Only change the front flipper within rectangle x=720..1110,y=470..735: same anatomical length and scale pattern, shoulder fixed at (1045,490), flipper tip (890,650). This is a SMALL gentle stroke; keep flipper fully extended without shortening, curling or changing perspective. Rear flipper gentle 2 degree paddle; head at most 1 px vertical bob. Preserve all other pixels and original lighting. Exact right-facing side profile, complete silhouette. Transparent alpha=0 outside animal. No halo, glow, shadow, water, bubbles, droplets or other animal. No repositioning, rescaling, cropping, new highlights or pattern redraw.
```

Frame 4:

```text
Use both supplied images of the SAME turtle: first is the fixed output canvas, second is the original detailed cut-out for identity. Produce ONE 1536x1024 high quality transparent PNG, frame 4 of 12 at phase 120 degrees. Treat this as a restricted local retouch, not a new turtle render. Copy the entire rigid shell from input one verbatim at its original coordinates, including its brown/green scute texture, white seam network, highlights and alpha edge. Keep its head, shell and torso locked. Only change the front flipper within rectangle x=720..1110,y=470..735: same anatomical length and scale pattern, shoulder fixed at (1045,490), flipper tip (885,678). This is a SMALL gentle stroke; keep flipper fully extended without shortening, curling or changing perspective. Rear flipper gentle 2 degree paddle; head at most 1 px vertical bob. Preserve all other pixels and original lighting. Exact right-facing side profile, complete silhouette. Transparent alpha=0 outside animal. No halo, glow, shadow, water, bubbles, droplets or other animal. No repositioning, rescaling, cropping, new highlights or pattern redraw.
```

Frame 5:

```text
Use both supplied images of the SAME turtle: first is the fixed output canvas, second is the original detailed cut-out for identity. Produce ONE 1536x1024 high quality transparent PNG, frame 5 of 12 at phase 150 degrees. Treat this as a restricted local retouch, not a new turtle render. Copy the entire rigid shell from input one verbatim at its original coordinates, including its brown/green scute texture, white seam network, highlights and alpha edge. Keep its head, shell and torso locked. Only change the front flipper within rectangle x=720..1110,y=470..735: same anatomical length and scale pattern, shoulder fixed at (1045,490), flipper tip (870,698). This is a SMALL gentle stroke; keep flipper fully extended without shortening, curling or changing perspective. Rear flipper gentle 1 degree paddle; head at most 0 px vertical bob. Preserve all other pixels and original lighting. Exact right-facing side profile, complete silhouette. Transparent alpha=0 outside animal. No halo, glow, shadow, water, bubbles, droplets or other animal. No repositioning, rescaling, cropping, new highlights or pattern redraw.
```

Frame 6:

```text
Use both supplied images of the SAME turtle: first is the fixed output canvas, second is the original detailed cut-out for identity. Produce ONE 1536x1024 high quality transparent PNG, frame 6 of 12 at phase 180 degrees. Treat this as a restricted local retouch, not a new turtle render. Copy the entire rigid shell from input one verbatim at its original coordinates, including its brown/green scute texture, white seam network, highlights and alpha edge. Keep its head, shell and torso locked. Only change the front flipper within rectangle x=720..1110,y=470..735: same anatomical length and scale pattern, shoulder fixed at (1045,490), flipper tip (850,705). This is a SMALL gentle stroke; keep flipper fully extended without shortening, curling or changing perspective. Rear flipper gentle 0 degree paddle; head at most 0 px vertical bob. Preserve all other pixels and original lighting. Exact right-facing side profile, complete silhouette. Transparent alpha=0 outside animal. No halo, glow, shadow, water, bubbles, droplets or other animal. No repositioning, rescaling, cropping, new highlights or pattern redraw.
```

Frame 7:

```text
Use both supplied images of the SAME turtle: first is the fixed output canvas, second is the original detailed cut-out for identity. Produce ONE 1536x1024 high quality transparent PNG, frame 7 of 12 at phase 210 degrees. Treat this as a restricted local retouch, not a new turtle render. Copy the entire rigid shell from input one verbatim at its original coordinates, including its brown/green scute texture, white seam network, highlights and alpha edge. Keep its head, shell and torso locked. Only change the front flipper within rectangle x=720..1110,y=470..735: same anatomical length and scale pattern, shoulder fixed at (1045,490), flipper tip (830,698). This is a SMALL gentle stroke; keep flipper fully extended without shortening, curling or changing perspective. Rear flipper gentle -1 degree paddle; head at most 0 px vertical bob. Preserve all other pixels and original lighting. Exact right-facing side profile, complete silhouette. Transparent alpha=0 outside animal. No halo, glow, shadow, water, bubbles, droplets or other animal. No repositioning, rescaling, cropping, new highlights or pattern redraw.
```

Frame 8:

```text
Use both supplied images of the SAME turtle: first is the fixed output canvas, second is the original detailed cut-out for identity. Produce ONE 1536x1024 high quality transparent PNG, frame 8 of 12 at phase 240 degrees. Treat this as a restricted local retouch, not a new turtle render. Copy the entire rigid shell from input one verbatim at its original coordinates, including its brown/green scute texture, white seam network, highlights and alpha edge. Keep its head, shell and torso locked. Only change the front flipper within rectangle x=720..1110,y=470..735: same anatomical length and scale pattern, shoulder fixed at (1045,490), flipper tip (815,678). This is a SMALL gentle stroke; keep flipper fully extended without shortening, curling or changing perspective. Rear flipper gentle -2 degree paddle; head at most -1 px vertical bob. Preserve all other pixels and original lighting. Exact right-facing side profile, complete silhouette. Transparent alpha=0 outside animal. No halo, glow, shadow, water, bubbles, droplets or other animal. No repositioning, rescaling, cropping, new highlights or pattern redraw.
```

Frame 9:

```text
Use both supplied images of the SAME turtle: first is the fixed output canvas, second is the original detailed cut-out for identity. Produce ONE 1536x1024 high quality transparent PNG, frame 9 of 12 at phase 270 degrees. Treat this as a restricted local retouch, not a new turtle render. Copy the entire rigid shell from input one verbatim at its original coordinates, including its brown/green scute texture, white seam network, highlights and alpha edge. Keep its head, shell and torso locked. Only change the front flipper within rectangle x=720..1110,y=470..735: same anatomical length and scale pattern, shoulder fixed at (1045,490), flipper tip (810,650). This is a SMALL gentle stroke; keep flipper fully extended without shortening, curling or changing perspective. Rear flipper gentle -2 degree paddle; head at most -1 px vertical bob. Preserve all other pixels and original lighting. Exact right-facing side profile, complete silhouette. Transparent alpha=0 outside animal. No halo, glow, shadow, water, bubbles, droplets or other animal. No repositioning, rescaling, cropping, new highlights or pattern redraw.
```

Frame 10:

```text
Use both supplied images of the SAME turtle: first is the fixed output canvas, second is the original detailed cut-out for identity. Produce ONE 1536x1024 high quality transparent PNG, frame 10 of 12 at phase 300 degrees. Treat this as a restricted local retouch, not a new turtle render. Copy the entire rigid shell from input one verbatim at its original coordinates, including its brown/green scute texture, white seam network, highlights and alpha edge. Keep its head, shell and torso locked. Only change the front flipper within rectangle x=720..1110,y=470..735: same anatomical length and scale pattern, shoulder fixed at (1045,490), flipper tip (815,623). This is a SMALL gentle stroke; keep flipper fully extended without shortening, curling or changing perspective. Rear flipper gentle -2 degree paddle; head at most -1 px vertical bob. Preserve all other pixels and original lighting. Exact right-facing side profile, complete silhouette. Transparent alpha=0 outside animal. No halo, glow, shadow, water, bubbles, droplets or other animal. No repositioning, rescaling, cropping, new highlights or pattern redraw.
```

Frame 11:

```text
Use both supplied images of the SAME turtle: first is the fixed output canvas, second is the original detailed cut-out for identity. Produce ONE 1536x1024 high quality transparent PNG, frame 11 of 12 at phase 330 degrees. Treat this as a restricted local retouch, not a new turtle render. Copy the entire rigid shell from input one verbatim at its original coordinates, including its brown/green scute texture, white seam network, highlights and alpha edge. Keep its head, shell and torso locked. Only change the front flipper within rectangle x=720..1110,y=470..735: same anatomical length and scale pattern, shoulder fixed at (1045,490), flipper tip (830,602). This is a SMALL gentle stroke; keep flipper fully extended without shortening, curling or changing perspective. Rear flipper gentle -1 degree paddle; head at most -1 px vertical bob. Preserve all other pixels and original lighting. Exact right-facing side profile, complete silhouette. Transparent alpha=0 outside animal. No halo, glow, shadow, water, bubbles, droplets or other animal. No repositioning, rescaling, cropping, new highlights or pattern redraw.
```
