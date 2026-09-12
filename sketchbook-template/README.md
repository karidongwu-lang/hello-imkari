# Sketchbook widget — reuse spec

This folder is the master copy of the flipbook widget: a self-contained
`widget.html` (HTML+CSS+JS, no build step) plus `scripts/prepare_assets.py`,
which turns raw cover/page photos into the exact PNGs the widget expects.

Keep this folder untouched as the "source of truth." Every individual
sketchbook lives in its own folder and is a **copy** of this one with its
own images and its own edited `PAGES` array — never edit the shared logic
per-book, or fixes stop propagating.

## Folder layout this produces

```
sketchbooks/
  singapore-sketches/
    index.html          <- copy of widget.html, PAGES array edited
    sketchbook/
      cover-front.png
      cover-back.png
      page-1.png
      page-2.png ...
  tokyo-notebook/
    index.html
    sketchbook/
      ...
```

## Steps for a new sketchbook (do this every time, identically)

1. Create `sketchbooks/<name>/` and `sketchbooks/<name>/sketchbook/`.
2. Run the asset script on that book's raw photos:
   ```
   python3 scripts/prepare_assets.py \
     --front raw/<name>/front.jpg \
     --back  raw/<name>/back.jpg \
     --pages raw/<name>/page1.jpg raw/<name>/page2.jpg raw/<name>/page3.jpg \
     --out   sketchbooks/<name>/sketchbook
   ```
3. Copy `widget.html` to `sketchbooks/<name>/index.html`.
4. In that copy, edit the `PAGES` array (marked `// EDIT-PER-BOOK` in the
   file) to match how many pages you passed to `--pages`, in the same
   order, with real titles.
5. Open `index.html` — the book should boot closed, tap to open, and
   center itself as it opens.

## The non-negotiable conventions

These are baked into the widget's turn/shadow/recenter math — changing
them requires touching `widget.html` itself, not just swapping images:

- Canvas is **1760×1240** for every asset (covers and pages alike).
- **Front cover**: art fills the right half only (x 880–1760), left half
  fully transparent (alpha 0, not a matching background color).
- **Back cover**: mirrored — art fills the left half only, right half
  transparent. This isn't just visual symmetry: the page-turn math
  requires the back cover's art on the left for the closing animation to
  land correctly.
- **Pages**: full-bleed across the entire 1760×1240 canvas, no margin.
- `prepare_assets.py` already handles all of the above — as long as you
  always go through that script, every book stays consistent.

## Prompting Claude Code

Point it at this README instead of re-describing the system each time.
A prompt like this is enough:

> Read `sketchbook-template/README.md` and follow its steps exactly to
> add a new sketchbook called "tokyo-notebook" using the raw photos in
> `raw/tokyo-notebook/` (front.jpg, back.jpg, page1.jpg, page2.jpg,
> page3.jpg, page4.jpg). Use real titles based on what's in each page
> photo.

Because the conventions and exact commands live in this file rather than
in a chat transcript, every sketchbook Claude Code builds this way ends
up structurally identical — same script, same flags, same edit points —
instead of subtly drifting each time it's asked to "do the same thing
again."
