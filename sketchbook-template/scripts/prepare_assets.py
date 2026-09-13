#!/usr/bin/env python3
"""
prepare_assets.py — turns raw photos into the exact PNGs the sketchbook
widget expects. Run this once per sketchbook; the output drops straight
into that book's sketchbook/ folder.

CONVENTIONS (must match widget.html exactly — do not change without
updating both):
  - Canvas size: 1760 x 1240 (any aspect ratio works, but every asset
    must be this same size).
  - cover-front.png: art fills the RIGHT half (x=880..1760) edge to
    edge, LEFT half fully transparent.
  - cover-back.png:  art fills the LEFT half (x=0..880) edge to edge,
    RIGHT half fully transparent. (Mirrored from the front cover — the
    turn animation's math requires this, it's not just a style choice.)
  - page-N.png: full-bleed, fills the ENTIRE 1760x1240 canvas (no
    transparent margin — pages aren't half-width like covers).

USAGE
  python3 prepare_assets.py \\
      --front /path/to/front-cover.jpg \\
      --back  /path/to/back-cover.jpg \\
      --pages page1.jpg page2.jpg page3.jpg ... \\
      --out   ../sketchbooks/my-book/sketchbook

This writes cover-front.png, cover-back.png, page-1.png, page-2.png, ...
into --out. It does NOT touch widget.html or the PAGES array — update
those by hand (or have Claude Code do it) after running this.
"""
import argparse
import os
import numpy as np
from PIL import Image, ImageChops, ImageDraw

W, H = 1760, 1240
HALF = W // 2
CORNER_RADIUS = 26  # px, on the 1760x1240 canvas


def round_corners(im, radius, corners=(True, True, True, True)):
    """Bakes real alpha transparency into rounded corners, rather than
    leaving the rounding to the browser's CSS border-radius +
    overflow:hidden. That CSS clipping doesn't reliably hold up on the
    deeply-nested, actively-rotating elements the page-turn's 3D curl
    uses (a real, reproduced rendering gap) — a square image corner can
    show through as a "white border" right at the edge during/after a
    flip. Baking the transparency into the pixels themselves sidesteps
    that entirely: it renders correctly no matter what CSS/3D context
    the image ends up composited into.
    im: RGBA image, exactly W x H. corners: (top_left, top_right,
    bottom_left, bottom_right) — which corners to round; the rest stay
    square (e.g. a cover's spine edge)."""
    im = im.convert("RGBA")
    w, h = im.size
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w - 1, h - 1], radius=radius, fill=255, corners=corners)
    im.putalpha(ImageChops.multiply(im.split()[-1], mask))
    return im


def fit_contain(im, box_w, box_h, bg=(0, 0, 0, 0)):
    """Scale (down OR up) to fit entirely inside box_w x box_h with no
    cropping at all — every pixel of the original survives. Centers the
    result and fills the leftover margin with bg (transparent for covers,
    opaque white for pages) rather than cutting content off an edge."""
    r = min(box_w / im.width, box_h / im.height)
    nw, nh = max(1, round(im.width * r)), max(1, round(im.height * r))
    im = im.resize((nw, nh), Image.LANCZOS).convert("RGBA")
    canvas = Image.new("RGBA", (box_w, box_h), bg)
    canvas.alpha_composite(im, ((box_w - nw) // 2, (box_h - nh) // 2))
    return canvas


def fit_cover(im, box_w, box_h, anchor="center"):
    """Scale + crop to exactly fill box_w x box_h, no letterboxing.
    anchor picks where the crop is taken from on whichever axis ends up
    needing it: 'center' (default), 'top', or 'bottom'. Horizontal is
    always centered — only vertical bias is supported, since that's the
    axis these portrait-ish source photos actually need it on."""
    r = max(box_w / im.width, box_h / im.height)
    nw, nh = int(im.width * r + 0.5), int(im.height * r + 0.5)
    im = im.resize((nw, nh), Image.LANCZOS)
    x0 = (nw - box_w) // 2
    if anchor == "top":
        y0 = 0
    elif anchor == "bottom":
        y0 = nh - box_h
    else:
        y0 = (nh - box_h) // 2
    return im.crop((x0, y0, x0 + box_w, y0 + box_h))


def make_cover(src_path, out_path, side, anchor="center", fit="contain", canvas=None, radius=None):
    """side: 'right' (front cover) or 'left' (back cover).

    radius: optional override for CORNER_RADIUS, in case one book's
    covers should be rounded more/less than the shared default.

    canvas: optional (width, height) to override the module-wide W/H —
    use when a book's own source photos have a natural ratio different
    enough from 1760x1240 that fitting them to the shared canvas would
    mean cropping or padding real content. The sketchbook engine reads
    every book's box size from CSS (one aspect-ratio rule per book,
    keyed by mount id), not from these constants, so a book can use a
    canvas of its own as long as ALL of its own assets (both covers and
    every page) are generated at that same size and the matching CSS
    rule is updated to the same ratio.

    Keeps the source's own alpha channel intact end to end (resize/crop in
    RGBA, then alpha_composite rather than a flat paste). A cutout's edge
    pixels are usually semi-transparent (anti-aliasing / a soft shadow) —
    flattening them onto ANY fixed color first (white, black, whatever)
    bakes that color into the edge as a visible fringe once it lands on the
    real background (the cutting mat). Compositing with true alpha lets
    those edge pixels blend correctly against whatever is actually behind
    them at render time instead.

    fit='contain' (default): no cropping — the source is resized directly
    to fill the half-box (HALF x H) exactly, edge to edge, with no
    leftover margin. Its aspect ratio gets slightly stretched to match
    the half-box's own ratio rather than being cropped or padded; for
    how close these covers' source ratios already are to the half-box's
    (see the CLI --fit help), the distortion is minor. This also avoids
    a real, reproduced bug: the page-turn curl's strips are sliced at
    fixed fractions of the WHOLE book width, so the strip sitting right
    at the 50% mark (bordering the spine/gutter) always spans a little
    into this cover's half regardless of strip count — if that sliver
    were transparent margin (from centering or edge-flushing a
    non-stretched fit instead), that one strip would show the full-bleed
    page sitting behind the cover right through it, mid-turn. Filling
    the half completely removes any margin for that to happen in.
    fit='cover': old behavior, scales to fill the half-box edge to edge
    and crops whatever doesn't fit (anchor picks which edge) — also
    fully opaque with no leftover margin, just via cropping instead of
    stretching."""
    cw, ch = canvas or (W, H)
    half = cw // 2
    im = Image.open(src_path).convert("RGBA")
    # A "cutout" source PNG (content isolated on a transparent canvas)
    # usually has a soft, semi-transparent anti-aliased ring around its
    # real content, not a hard cutoff — plain getbbox() only excludes
    # pixels that are FULLY transparent (alpha==0), so that whole feather
    # band (alpha fading e.g. 0->255 over several source pixels) stays in
    # the crop. The resize below then scales the WHOLE source canvas,
    # feather included, so it survives proportionally into the final art
    # and lands right at the spine-facing edge as a semi-transparent
    # band — recreating the exact transparent-margin bug this function
    # exists to avoid, just from a different source (confirmed: About/
    # Art's source covers have no such feather and jump straight to
    # alpha==255 at their very first pixel; Work's does not). Crop to a
    # near-full-opacity threshold instead of any-nonzero so the feather
    # itself is trimmed away, leaving only solid content to resize.
    alpha = np.array(im.split()[-1])
    ys, xs = np.where(alpha > 250)
    if len(xs):
        im = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    if fit == "contain":
        art = im.resize((half, ch), Image.LANCZOS)
        y = 0
    else:
        art = fit_cover(im, half, ch, anchor)
        y = 0
    # round only the outer edge (away from the spine) — the right corners
    # for a right-side (front) cover's half, left corners for a left-side
    # (back) cover's half. Pillow's `corners` order is clockwise from
    # top-left: (top_left, top_right, bottom_right, bottom_left) — verified
    # empirically, it is NOT reading-order (tl, tr, bl, br).
    art = round_corners(art, radius if radius is not None else CORNER_RADIUS, corners=(False, True, True, False) if side == "right" else (True, False, False, True))
    out_canvas = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))  # fully transparent
    x = (cw - art.width) if side == "right" else 0
    out_canvas.alpha_composite(art, (x, y))
    out_canvas.save(out_path)
    print(f"  wrote {out_path}  ({side} half filled, {'left' if side=='right' else 'right'} half transparent, fit={fit})")


def make_page(src_path, out_path, anchor="center", fit="contain", canvas=None):
    """Pages are meant to be full-bleed photos with no transparency. But a
    source that's actually an isolated cutout (a product shot on a
    transparent background, rather than a flat-lay photo filling its own
    frame) can have a SOFT, gradual alpha feather around the real content
    (not a hard cutoff) — PIL's getbbox() only excludes fully-transparent
    (alpha==0) pixels, so it leaves the whole low-alpha feathered band in
    place. Flattening that band onto white then bakes a visible whitish
    fringe into the edge, and scaling up to the page canvas magnifies it
    into an obvious border. Crop to a real alpha THRESHOLD instead, so the
    soft feather is discarded along with the fully-transparent margin —
    only substantially-opaque content survives to the white-flatten step."""
    cw, ch = canvas or (W, H)
    im = Image.open(src_path).convert("RGBA")
    THRESH = 200
    BLOCK = 4  # px, checked as a block (not a single pixel) for robustness
    SAFETY = 0  # the cover's own border is only ~10-15px wide in source
    # pixel terms, so any extra safety margin here risks cropping past it
    # entirely into the interior page color — keep this at the verified
    # minimal inset, don't pad it "just in case"
    alpha = np.array(im.split()[-1])
    mask = alpha > THRESH
    ys, xs = np.where(mask)
    if len(xs):
        x0, y0, x1, y1 = int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1
        # A rectangular bbox still leaves the object's own ROUNDED corners
        # (a physical notebook, in this case) as transparent triangles in
        # each corner of that rectangle. Search for the smallest uniform
        # inset whose four corner BLOCKS (not just a single pixel, which
        # can land on a lucky antialiasing speck) are fully opaque, rather
        # than guessing a fixed percentage — too little leaves corner
        # triangles, too much needlessly crops real content (verified
        # against a full-perimeter check too, not just the four corners).
        max_inset = min(x1 - x0, y1 - y0) // 4
        found = None
        for inset in range(0, max_inset, 1):
            nx0, ny0, nx1, ny1 = x0 + inset, y0 + inset, x1 - inset, y1 - inset
            blocks = [
                mask[ny0 : ny0 + BLOCK, nx0 : nx0 + BLOCK],
                mask[ny0 : ny0 + BLOCK, nx1 - BLOCK : nx1],
                mask[ny1 - BLOCK : ny1, nx0 : nx0 + BLOCK],
                mask[ny1 - BLOCK : ny1, nx1 - BLOCK : nx1],
            ]
            if all(b.all() for b in blocks):
                found = inset
                break
        # NOT `found or max_inset` — inset 0 is a legitimate, correct
        # answer (a source with no transparent margin at all, like a
        # plain opaque JPEG) and 0 is falsy, so `or` would silently
        # replace a correct "no crop needed" with the biggest possible
        # crop instead.
        inset = min((found if found is not None else max_inset) + SAFETY, max_inset)
        bbox = (x0 + inset, y0 + inset, x1 - inset, y1 - inset)
        im = im.crop(bbox)
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    im = Image.alpha_composite(bg, im).convert("RGB")
    if fit == "contain":
        art = fit_contain(im, cw, ch, bg=(255, 255, 255, 255)).convert("RGB")
    else:
        art = fit_cover(im, cw, ch, anchor)
    # a page is shown fully open (never half-width like a cover), so all
    # four corners round
    art = round_corners(art, CORNER_RADIUS)
    art.save(out_path)
    print(f"  wrote {out_path}  ({cw}x{ch}, fit={fit})")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--front", required=True, help="path to the raw front-cover photo")
    p.add_argument("--back", required=True, help="path to the raw back-cover photo")
    p.add_argument("--pages", required=True, nargs="+", help="paths to raw page-spread photos, in reading order")
    p.add_argument("--out", required=True, help="output folder (will be created)")
    p.add_argument(
        "--anchor",
        choices=["center", "top", "bottom"],
        default="center",
        help="only used with --fit cover: vertical crop bias when the source's "
        "aspect ratio forces a crop — use 'top' if the important content (a "
        "title, a face) sits near the top of the source with more empty room "
        "at the bottom, or 'bottom' for the reverse",
    )
    p.add_argument(
        "--fit",
        choices=["contain", "cover"],
        default="contain",
        help="'contain' (default): no cropping, full source always visible, "
        "letterboxed if the aspect ratio doesn't match. 'cover': scales to "
        "fill the box edge-to-edge and crops whatever overflows (see --anchor)",
    )
    args = p.parse_args()

    os.makedirs(args.out, exist_ok=True)

    print("Front cover:")
    make_cover(args.front, os.path.join(args.out, "cover-front.png"), side="right", anchor=args.anchor, fit=args.fit)
    print("Back cover:")
    make_cover(args.back, os.path.join(args.out, "cover-back.png"), side="left", anchor=args.anchor, fit=args.fit)
    print(f"Pages ({len(args.pages)}):")
    for i, src in enumerate(args.pages, start=1):
        make_page(src, os.path.join(args.out, f"page-{i}.png"), anchor=args.anchor, fit=args.fit)

    print("\nDone. Now update the PAGES array in widget.html:")
    for i in range(1, len(args.pages) + 1):
        print(f"  {{file:'page-{i}.png', title:'???', place:'???'}},")


if __name__ == "__main__":
    main()
