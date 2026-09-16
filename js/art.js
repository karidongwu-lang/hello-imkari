import { createSketchbook } from "./sketchbook.js?v=7";

const ART_COVER_SRC = "assets/art-cover.JPG";
const ART_BOOK_PAGE_COUNT = 25;

const ILLUSTRATIONS = [
  "painting copy.webp",
  "headshot copy.webp",
  "bubbles copy.webp",
  "CrayonDigital copy.webp",
  "PaperMixed copy.webp",
  "birthday copy.webp",
  "card copy.webp",
  "chase copy.webp",
  "fantasy copy.webp",
  "figure copy.webp",
  "home copy.webp",
  "mothersday copy.webp",
  "symbols copy.webp",
];

// the first three are the ones peeking out of the stack (stars 39) —
// keeping them first here too means they land in the first columns right
// after the cover, matching stars 40.
const SCATTER_ROTATIONS = [10.28, 1.52, 1.52];
const COLUMNS = 3;

const SKETCHES = [
  "Acrylic copy.webp",
  "Crayon1 (1) copy.webp",
  "Graphite copy.webp",
  "nainai copy.webp",
  "reality copy.webp",
  "runandlive copy.webp",
  "self copy.webp",
  "sf copy.webp",
  "shoes copy.webp",
];

// title/medium/year for the lightbox caption, keyed by a normalized
// filename so it lines up regardless of the " copy"/"(1)" suffixes or
// casing our own asset files happen to have. ("city" and "Charcoal"
// used to be in ILLUSTRATIONS/SKETCHES above with no entry here — no
// metadata existed for those two, so they were dropped from the grids
// entirely rather than showing a blank caption.)
const ART_META = {
  painting: { title: "Painting", medium: "Acrylic", year: "2024" },
  headshot: { title: "Headshot", medium: "Acrylic Paint", year: "2024" },
  bubbles: { title: "Bubbles", medium: "Procreate on iPad", year: "2021" },
  crayondigital: { title: "Slice", medium: "Multimedia", year: "2023" },
  papermixed: { title: "Luck", medium: "Multimedia", year: "2023" },
  birthday: { title: "Birthday", medium: "Procreate on iPad", year: "2023" },
  card: { title: "Card", medium: "Procreate on iPad", year: "2026" },
  chase: { title: "Chase", medium: "Procreate on iPad", year: "2024" },
  fantasy: { title: "Fantasy", medium: "Mixed Media", year: "2025" },
  figure: { title: "Figure", medium: "Procreate on iPad", year: "2022" },
  home: { title: "Crush", medium: "Procreate on iPad", year: "2024" },
  mothersday: { title: "Mom", medium: "Procreate on iPad", year: "2025" },
  symbols: { title: "#@*!!", medium: "Procreate on iPad", year: "2023" },
  acrylic: { title: "Fruits Study", medium: "Acrylic paint", year: "2023" },
  crayon1: { title: "Profile Study", medium: "Crayon", year: "2023" },
  graphite: { title: "Garage Floor Study", medium: "Graphite", year: "2024" },
  nainai: { title: "Nainai", medium: "Procreate on iPad", year: "2025" },
  reality: { title: "Reality", medium: "Procreate on iPad", year: "2024" },
  runandlive: { title: "Run and Live", medium: "Public Mural", year: "2024" },
  self: { title: "Adolescent Inspirations", medium: "Mixed Media", year: "2025" },
  sf: { title: "San Francisco", medium: "Procreate on iPad", year: "2023" },
  shoes: { title: "Shoes Study", medium: "Graphite", year: "2023" },
};

function normalizeKey(name) {
  return name
    .replace(/\.webp$/i, "")
    .replace(/ copy$/i, "")
    .replace(/\s*\(\d+\)\s*$/, "")
    .trim()
    .toLowerCase();
}

function src(folder, name) {
  return `art/${folder}/${encodeURIComponent(name)}`;
}

// Fires the actual byte fetch immediately, without creating any DOM
// (an Image() object never inserted anywhere still triggers and caches
// the request) — so by the time a real <img> or the flip-book widget
// asks for the same URL later, the browser already has it and there's
// no visible load-in delay. Deliberately NOT instantiating the art
// flip-book widget itself here (see openArtBook() below) — only
// prefetching its bytes — since createSketchbook() attaches live
// window-level pointermove/keydown listeners keyed off the mount's
// offsetParent, and .art-book-lightbox only hides via opacity (not
// display:none), so an eagerly-created instance would think it's
// visible the whole time the site is open.
function preloadImage(url) {
  const im = new Image();
  im.src = url;
}

function label(name) {
  return name.replace(" copy.webp", "");
}

function makeImg(folder, name, alt) {
  const img = document.createElement("img");
  img.src = folder ? src(folder, name) : name;
  const meta = ART_META[normalizeKey(name)];
  img.alt = alt ?? meta?.title ?? label(name);
  if (meta) {
    img.dataset.title = meta.title;
    img.dataset.medium = meta.medium;
    img.dataset.year = meta.year;
  }
  // the cover's rounded-right-edge styling normally comes from its
  // .art-cover button wrapper (border-radius + overflow:hidden), but
  // expandFromStack() moves just the bare <img> out into the grid,
  // leaving that wrapper behind — so the corner rounding has to live on
  // the image itself too, or it goes square once it lands in the grid.
  if (!folder && name === ART_COVER_SRC) img.classList.add("art-cover-thumb");
  return img;
}

function waitFor(img) {
  if (img.complete && img.naturalWidth) return Promise.resolve();
  if (img.decode) return img.decode().catch(() => {});
  return new Promise((resolve) => {
    img.onload = img.onerror = resolve;
  });
}

// Three fixed-width columns, each image sized to its own natural aspect
// ratio (no cropping). Every column has the same width, so an image's
// natural height/width ratio is a direct stand-in for its rendered
// height — comparing accumulated ratios per column is the same as
// comparing accumulated pixel heights, without needing to measure any
// actual layout first. Placed into whichever column is currently
// shortest, in order, so the columns stay roughly balanced.
function layoutMasonry(container, images) {
  container.innerHTML = "";
  const cols = Array.from({ length: COLUMNS }, () => {
    const col = document.createElement("div");
    col.className = "art-col";
    container.appendChild(col);
    return col;
  });
  const colRatioHeight = new Array(COLUMNS).fill(0);

  images.forEach((img) => {
    const ratio = (img.naturalHeight || 1) / (img.naturalWidth || 1);
    let shortest = 0;
    for (let i = 1; i < COLUMNS; i++) {
      if (colRatioHeight[i] < colRatioHeight[shortest]) shortest = i;
    }
    cols[shortest].appendChild(img);
    colRatioHeight[shortest] += ratio;
  });
}

// The illustrations/sketches grids and the 25-page flip-book are all
// built lazily (only once the visitor actually expands the stack,
// switches sub-nav, or opens the book) so the DOM/layout work doesn't
// happen before it's needed — but that also meant the corresponding
// IMAGE BYTES weren't even requested until that exact moment, so the
// first expand/switch/open always had a visible load-in stall. Kicking
// off every request right away means they're already sitting in the
// browser's cache by the time any of those lazy build steps actually
// run — but "right away" is deliberately AFTER the browser's gone
// idle (below), not at the same instant as page load: this tab isn't
// the default landing view, so firing 40+ requests for it at the very
// same tick as the (visible, above-the-fold) work tab's own cover
// image/notecards just made everything compete for the same handful
// of concurrent connections, slowing down the part actually on screen
// first. Deferring these lets the critical, visible content win that
// race, while still getting everything else loaded in the background
// well before a visitor would actually click into the art tab.
function preloadArtAssets() {
  ILLUSTRATIONS.forEach((name) => preloadImage(src("illustrations", name)));
  SKETCHES.forEach((name) => preloadImage(src("sketches", name)));
  const bookDir = "assets/sketchbook-art/";
  preloadImage(bookDir + "cover-front.webp");
  preloadImage(bookDir + "cover-back.webp");
  for (let i = 1; i <= ART_BOOK_PAGE_COUNT; i++) preloadImage(`${bookDir}page-${i}.webp`);
}

export function initArt() {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(preloadArtAssets, { timeout: 2000 });
  } else {
    setTimeout(preloadArtAssets, 300);
  }
  const tab = document.getElementById("tab-art");
  const artMat = document.getElementById("art-mat");
  const artScatter = document.getElementById("art-scatter");
  const grid = document.getElementById("art-grid");
  const cta = document.getElementById("art-cta");
  const logo = document.getElementById("art-logo");
  const subnav = document.getElementById("art-subnav");
  const backBtn = document.getElementById("art-back");
  const lightbox = document.getElementById("art-lightbox");
  const lightboxImg = document.getElementById("art-lightbox-img");
  const lightboxTitle = document.getElementById("art-lightbox-title");
  const lightboxMeta = document.getElementById("art-lightbox-meta");

  // 3D pointer-tilt for the scattered cover stack, matching the
  // sketchbook widget's own tilt (js/sketchbook.js tiltTo/setView) so
  // the art landing page feels just as interactive as work/about.
  const TILT_X = 4.5,
    TILT_Y = 7;
  function tiltTo(cx, cy) {
    if (tab.dataset.state !== "cover") return;
    const r = artMat.getBoundingClientRect();
    if (!r.width) return;
    const nx = Math.max(-1, Math.min(1, (cx - (r.left + r.width / 2)) / (r.width * 0.62)));
    const ny = Math.max(-1, Math.min(1, (cy - (r.top + r.height / 2)) / (r.height * 0.9)));
    artScatter.style.setProperty("--art-rx", (-ny * TILT_X).toFixed(2) + "deg");
    artScatter.style.setProperty("--art-ry", (nx * TILT_Y).toFixed(2) + "deg");
  }
  function resetTilt() {
    artScatter.style.setProperty("--art-rx", "0deg");
    artScatter.style.setProperty("--art-ry", "0deg");
  }
  addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "touch") return;
      tiltTo(e.clientX, e.clientY);
    },
    { passive: true }
  );
  addEventListener("pointerout", (e) => {
    if (!e.relatedTarget) resetTilt();
  });

  logo?.addEventListener("click", () => {
    document.querySelector('[data-nav-group] .nav-link[data-tab="work"]')?.click();
  });

  function buildStack() {
    artScatter.innerHTML = "";
    ILLUSTRATIONS.slice(0, 3).forEach((name, i) => {
      const img = makeImg("illustrations", name);
      img.className = "scatter-img";
      img.dataset.slot = String(i);
      artScatter.appendChild(img);
    });
    const coverBtn = document.createElement("button");
    coverBtn.className = "art-cover";
    coverBtn.type = "button";
    coverBtn.setAttribute("aria-label", "View all art");
    coverBtn.appendChild(makeImg(null, ART_COVER_SRC, "Sketchbook cover"));
    artScatter.appendChild(coverBtn);
    coverBtn.addEventListener("click", expandFromStack);
  }

  // Plain (re)build — used for switching sub-nav sections once already
  // expanded. The stack -> grid transition itself uses expandFromStack
  // below instead, so the cover and peeking images actually fly into
  // place rather than a new grid just appearing over them.
  async function renderGrid(section) {
    const imgs =
      section === "sketches"
        ? SKETCHES.map((name) => makeImg("sketches", name))
        : [makeImg(null, ART_COVER_SRC, "Sketchbook cover"), ...ILLUSTRATIONS.map((name) => makeImg("illustrations", name))];
    await Promise.all(imgs.map(waitFor));
    layoutMasonry(grid, imgs);
  }

  function flip(el, oldRect, rotationDeg) {
    requestAnimationFrame(() => {
      const newRect = el.getBoundingClientRect();
      const dx = oldRect.left + oldRect.width / 2 - (newRect.left + newRect.width / 2);
      const dy = oldRect.top + oldRect.height / 2 - (newRect.top + newRect.height / 2);
      const scale = newRect.width ? oldRect.width / newRect.width : 1;
      el.style.transition = "none";
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rotationDeg}deg) scale(${scale})`;
      el.getBoundingClientRect(); // force reflow so the jump above isn't animated
      requestAnimationFrame(() => {
        el.style.transition = "transform 0.8s var(--ease)";
        el.style.transform = "translate(0, 0) rotate(0deg) scale(1)";
        // once landed, drop the inline transform/transition/z-index
        // entirely so the CSS hover effect (which the flip's inline
        // transform would otherwise outrank) can take over normally
        el.addEventListener(
          "transitionend",
          () => {
            el.style.transition = "";
            el.style.transform = "";
            el.style.zIndex = "";
            el.style.position = "";
          },
          { once: true }
        );
      });
    });
  }

  async function expandFromStack() {
    const coverImg = artScatter.querySelector(".art-cover img");
    const scatterImgs = Array.from(artScatter.querySelectorAll(".scatter-img"));
    const heroEls = [coverImg, ...scatterImgs];
    const heroRotations = [0, ...SCATTER_ROTATIONS];
    const oldRects = heroEls.map((el) => el.getBoundingClientRect());

    const restImgs = ILLUSTRATIONS.slice(3).map((name) => makeImg("illustrations", name));

    // wait for the new images before touching the hero elements at all —
    // stripping their positioning early leaves them rendering "naked" at
    // full natural size for however long loading takes, which is the
    // huge flash/jank: a multi-megapixel photo briefly laid out with no
    // sizing at all before landing in its grid cell.
    await Promise.all(restImgs.map(waitFor));

    heroEls.forEach((el) => {
      el.classList.remove("scatter-img");
      el.removeAttribute("style");
    });
    // the sketchbook cover must stay visibly on top of the other three
    // images while they're all animating past each other
    coverImg.style.position = "relative";
    coverImg.style.zIndex = "5";

    tab.dataset.state = "expanded";
    subnav.hidden = false;
    if (backBtn) backBtn.hidden = false;

    layoutMasonry(grid, [...heroEls, ...restImgs]);

    heroEls.forEach((el, i) => flip(el, oldRects[i], heroRotations[i]));

    restImgs.forEach((img, i) => {
      img.style.opacity = "0";
      img.style.transition = `opacity 0.6s var(--ease) ${0.1 + i * 0.03}s`;
      requestAnimationFrame(() => {
        img.style.opacity = "1";
      });
    });

    subnav.querySelectorAll(".nav-link").forEach((b) => b.removeAttribute("data-active"));
    subnav.querySelector('[data-sub="illustrations"]').dataset.active = "true";
    cta.hidden = false;
  }

  buildStack();

  function reset() {
    window.scrollTo({ top: 0 });
    tab.dataset.state = "cover";
    subnav.hidden = true;
    cta.hidden = true;
    resetTilt();
    if (backBtn) backBtn.hidden = true;
    grid.innerHTML = "";
    buildStack();
  }

  backBtn?.addEventListener("click", reset);

  subnav.addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-link");
    if (!btn) return;
    subnav.querySelectorAll(".nav-link").forEach((b) => b.removeAttribute("data-active"));
    btn.dataset.active = "true";
    cta.hidden = btn.dataset.sub !== "illustrations";
    window.scrollTo({ top: 0 });
    renderGrid(btn.dataset.sub);
  });

  // the CTA sits down near the bottom of the (often long, scrolled-down)
  // illustrations grid, so switching sections without also resetting
  // scroll landed visitors mid-way down the sketches grid instead of at
  // its top — same fix as the sub-nav click above, just for this
  // second entry point into the same section switch.
  cta.addEventListener("click", () => {
    subnav.querySelectorAll(".nav-link").forEach((b) => b.removeAttribute("data-active"));
    subnav.querySelector('[data-sub="sketches"]').dataset.active = "true";
    cta.hidden = true;
    window.scrollTo({ top: 0 });
    renderGrid("sketches");
  });

  subnav.querySelector('[data-sub="illustrations"]').dataset.active = "true";

  // The sketchbook cover tile opens a real flippable sketchbook instead
  // of the plain image lightbox — built once (lazily, on first open)
  // and reused after that, since createSketchbook() attaches its own
  // window-level listeners and re-running it on the same mount would
  // stack up duplicates rather than replace them.
  const bookLightbox = document.getElementById("art-book-lightbox");
  const bookMount = document.getElementById("art-book-mount");
  const bookClose = document.getElementById("art-book-close");
  let artBook = null;

  function openArtBook() {
    if (!artBook) {
      artBook = createSketchbook(bookMount, {
        dir: "assets/sketchbook-art/",
        pages: Array.from({ length: ART_BOOK_PAGE_COUNT }, (_, i) => ({ file: `page-${i + 1}.webp`, title: "", place: "" })),
        coverFront: "cover-front.webp",
        coverBack: "cover-back.webp",
        v: "13",
      });
    } else {
      artBook.goTo(0);
    }
    bookLightbox.classList.add("open");
  }

  bookClose.addEventListener("click", () => bookLightbox.classList.remove("open"));
  bookLightbox.addEventListener("click", (e) => {
    if (e.target === bookLightbox) bookLightbox.classList.remove("open");
  });

  // Lets the lightbox step to the next/previous piece without closing
  // and reopening — the sketchbook cover tile is excluded since it
  // opens a different overlay entirely (openArtBook), not this one.
  const lightboxPrev = document.getElementById("art-lightbox-prev");
  const lightboxNext = document.getElementById("art-lightbox-next");
  const lightboxCloseBtn = document.getElementById("art-lightbox-close");
  let lightboxIndex = -1;
  function galleryImages() {
    return Array.from(grid.querySelectorAll("img")).filter((img) => !img.src.endsWith(ART_COVER_SRC));
  }
  function applyLightboxImg(img) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxTitle.textContent = img.dataset.title || "";
    lightboxMeta.textContent = img.dataset.medium && img.dataset.year ? `${img.dataset.medium} · ${img.dataset.year}` : "";
  }
  function stepLightbox(dir) {
    const imgs = galleryImages();
    if (!imgs.length || lightboxIndex < 0) return;
    lightboxIndex = (lightboxIndex + dir + imgs.length) % imgs.length;
    applyLightboxImg(imgs[lightboxIndex]);
  }

  grid.addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (!img) return;
    if (img.src.endsWith(ART_COVER_SRC)) {
      openArtBook();
      return;
    }
    lightboxIndex = galleryImages().indexOf(img);
    applyLightboxImg(img);
    lightbox.classList.add("open");
  });

  lightboxPrev.addEventListener("click", () => stepLightbox(-1));
  lightboxNext.addEventListener("click", () => stepLightbox(1));
  lightboxCloseBtn.addEventListener("click", () => lightbox.classList.remove("open"));
  addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "ArrowRight") stepLightbox(1);
    else if (e.key === "ArrowLeft") stepLightbox(-1);
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target.closest(".art-lightbox-arrow, #art-lightbox-close")) return;
    lightbox.classList.remove("open");
  });

  // both lightboxes live outside #tab-art (siblings at the end of
  // <body>), so switching tabs doesn't hide them on its own — close
  // them explicitly, especially the sketchbook one since it keeps its
  // own window-level listeners alive while open
  document.addEventListener("tabchange", (e) => {
    if (e.detail.tab !== "art") {
      lightbox.classList.remove("open");
      bookLightbox.classList.remove("open");
    }
  });

  return { reset };
}
