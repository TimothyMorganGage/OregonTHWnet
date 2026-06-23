---
name: Slides PPTX text-overflow ("disappearing text")
description: Why exported slide text disappears and how to fix it at the content level
---

# Slides PPTX "disappearing text"

The dom-to-pptx export converter emits every text box with `wrap="none"` and sizes
each box width to an OVER-measured natural line width. It DOES split each
browser-wrapped visual line into its own `<a:p>` paragraph, so multi-line text does
NOT collapse to one line. Text "disappears" only when a box runs off the slide:
`x + cx > 9144000` EMU (right edge) or `y + cy > 5143500` EMU (bottom).
Slide = 9144000 × 5143500 EMU = 1920×1080 px (≈4762.5 EMU/px).

**Rule:** this is a CONTENT-level mitigation, not a converter fix. `wrap="none"`
persists upstream, so new copy or new slides can reintroduce overflow.

**How to apply:**
- Constrain text-block widths (Tailwind `max-w-[Nvw]`) so each wrapped line's box
  fits horizontally. Empirically body blocks at ~60–64vw fit (with ~4vw margin);
  80–84vw and unconstrained headings overflow. A definite/`max-w` width makes the
  converter split per visual line into separate fitting boxes.
- Narrowing widths increases line count → can cause VERTICAL overflow; rebalance
  with tighter `leading`, smaller `gap-*`, and shifting content blocks up.
- Respect text-size floors from `.local/skills/slides/references/visual_qa.md`
  (body ≥3vw, captions ≥2.2vw) — do NOT shrink font to fix overflow.

**Verify objectively (the success criterion):** export PPTX, then unzip and scan
`ppt/slides/slideN.xml` `<p:sp>` for any box with `x+cx > 9144000` or
`y+cy > 5143500`. Zero offenders = no disappearing text. (`cd /tmp && unzip -q
<pptx>`; regex `<a:off x.. y..>` + `<a:ext cx.. cy..>` per shape.)

**Export:** `exportSlides({format:"pptx", presentationName, artifactDirName})` via
code_execution writes to `.local/outputs/<slug>.pptx`. Exports DO reflect source
edits (confirmed via a 4-byte sentinel test); occasional byte-identical sizes after
a position-only change are coincidence, not stale caching — re-extract to confirm.

**Layout pattern (avoid the export-fix-breaks-screen trap):** fixing export width by
hardcoding absolute content blocks at `top-[Xvh]` is fragile — it desyncs from the
header and clips content behind the footer on-screen. Robust content-slide template:
a single `absolute inset-x-0 top-0 bottom-[9vh] flex flex-col px-[8vw] pt-[7.5vh]
pb-[3vh]` container → `<header className="shrink-0">` (eyebrow + h2) →
`<div className="flex-1 flex flex-col justify-center gap-…">` body. The `bottom-[9vh]`
must match the footer `h-[9vh]`. **Why:** keeps header/body/footer in one flow so they
never collide, and bounds the content above the footer automatically.
**Density is the real height lever, not spacing.** Three 2-line bullets + a 2-line lead
+ a 2-line heading already busts the height budget at the 3vw floor. Per visual_qa the
remedy is fewer LINES (terser/punchy bullet copy, ≤6 lines/slide), NOT shrinking font
below 3vw nor endlessly tightening gaps. Verify each slide at 1280×720 (proportional
to 1920×1080) — bottom clipping there = clipping on export.
