# Animation brief: swim-cycle loops for the sea life

**For:** an AI coding agent (e.g. Codex) with access to GPT Image.
**Goal:** find out whether GPT Image can turn the existing still cut-outs into smooth, looping swim animations. If it can, produce them in a format the wallpaper plays.

Right now the wallpaper fakes the motion in code: it cuts the turtle's flippers out and swings them, and bends the fish and dolphin images. Real animation frames would look better, but only if the animal stays identical from frame to frame. A shell that changes pattern, or a fish that shifts colour, would flicker and look worse than the code version. So this starts with a small test and stops if the test doesn't pass.

Read this whole file before starting. Do not change any code files (`*.js`, `*.html`, `config.js`) or the existing images in `art/plates` and `art/sprites`.

---

## Phase 1: test with the turtle and the clownfish

Make only these two first:

| Animation | Reference image | Frames | Frame width | What moves |
| --- | --- | --- | --- | --- |
| `turtle` | `art/sprites/turtle.png` | 12 | 512 px | Front flipper sweeps down and back (power stroke), then forward and up (recovery). The rear flipper paddles gently and the head bobs slightly. The shell does **not** change. |
| `clownfish` | `art/sprites/clownfish.png` | 8 | 384 px | The tail beats side to side, which seen side-on looks like the tail fin narrowing and widening. The back of the body flexes slightly and the pectoral fin flutters. The head stays still. |

### How to make the frames

- **Use the reference image as the input for every frame** (image edit), so the animal stays the same individual. Describe only the pose change in each frame's prompt, for example: *"Same turtle, same position, size, lighting and shell. Only change: the front flipper is raised forward and up at about 30 degrees above its current angle. Transparent background."*
- If your image tool can output an animated GIF or a multi-frame sequence directly, you may try that instead. Then extract the frames. GIF frames have hard-edged transparency, so if you use GIF, regenerate the final frames as transparent PNGs where you can.
- Every frame must:
  - keep the same canvas, with the animal at the same position and scale. Only the moving parts may move.
  - face right.
  - have a truly transparent background (corner alpha = 0, no painted checkerboard).
  - show no water, bubbles, shadow or second animal.
- The loop must be seamless: the last frame should flow straight back into the first.

### Check before going further

Put the frames side by side and play them as a loop (make a preview GIF). Pass only if all of these hold:

- [ ] The rigid parts don't wander. The turtle's shell and the fish's head stay within 3 px between frames. Compare a cropped patch, not just the bounding box.
- [ ] Colours and patterns stay the same across frames: no shell pattern changes, no stripe shifts, no colour flicker.
- [ ] The moving parts move clearly and smoothly, with no jumps between neighbouring frames.
- [ ] The loop has no visible jump between the last frame and the first.

**If either animation fails after 3 honest attempts, stop.** Report what went wrong, with the preview GIFs, and commit just the previews (see Hand-off). The code version stays in use, so failing the test is a useful answer.

## Phase 2: the rest (only if Phase 1 passed)

| Animation | Reference image | Frames | Frame width | What moves |
| --- | --- | --- | --- | --- |
| `bluetang` | `art/sprites/bluetang.png` | 8 | 384 px | tail beat, body flex, fins flutter |
| `yellowtang` | `art/sprites/yellowtang.png` | 8 | 384 px | tail beat, body flex, fins flutter |
| `angelfish` | `art/sprites/angelfish.png` | 8 | 384 px | tail beat, the long dorsal streamer ripples, fins flutter |
| `dolphin` | `art/sprites/dolphin.png` | 8 | 512 px | flukes beat up and down, slight body flex. Keep the same nose-up leaping pose and angle as the reference, because the code tilts it along the jump. |

Same rules and checks as Phase 1.

## Processing each animation

1. Find the bounding box that contains the animal in **all** frames (alpha > 8), add 8 px of transparent padding, and crop **every** frame to that same box. Never crop each frame separately, or the animal will jitter.
2. Scale every frame to the frame width in the table, keeping the aspect ratio.
3. Join the frames left to right into one strip: `art/anim/<name>.png` (PNG with alpha). The strip is `frames × frame width` wide.
4. Add the animation to `art/anim/manifest.json`. The file already exists with `{}`. For example:
   ```json
   {
     "turtle": { "file": "turtle.png", "frames": 12, "fps": 10 },
     "clownfish": { "file": "clownfish.png", "frames": 8, "fps": 12 }
   }
   ```
   Use fps 10 for the turtle, 12 for fish and 12 for the dolphin.
5. Save a preview GIF for people to look at: `art/anim/preview/<name>.gif`. The wallpaper doesn't use these.

The wallpaper picks these up automatically. Any animal listed in the manifest plays its frames, and the rest keep the code motion.

## Write `art/anim/NOTES.md`

Include:
- the model and settings you used
- for each animation: whether it passed each check, how many attempts it took, and the prompts used
- anything that looked off

## Hand-off

1. Work on a branch named `anim-v1`, created from `main`. If your environment names branches itself, any name is fine.
2. Commit only files under `art/anim/`. If Phase 1 failed, commit only the previews and `NOTES.md`, and leave `manifest.json` as `{}`.
3. Push the branch, or let it become a pull request into `main`. **Don't merge it.** Claude will check the frames in the scene before merging.
4. Finish by summarising what you made, whether the test passed, and anything that needs a second look.
