const ILLUSTRATIONS = [
  "painting copy.webp",
  "headshot copy.webp",
  "bubbles copy.webp",
  "CrayonDigital copy.webp",
  "PaperMixed copy.webp",
  "birthday copy.webp",
  "card copy.webp",
  "chase copy.webp",
  "city copy.webp",
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
  "Charcoal copy.webp",
  "Crayon1 (1) copy.webp",
  "Graphite copy.webp",
  "nainai copy.webp",
  "reality copy.webp",
  "runandlive copy.webp",
  "self copy.webp",
  "sf copy.webp",
  "shoes copy.webp",
];

function src(folder, name) {
  return `art/${folder}/${encodeURIComponent(name)}`;
}

function label(name) {
  return name.replace(" copy.webp", "");
}

function makeImg(folder, name, alt) {
  const img = document.createElement("img");
  img.src = folder ? src(folder, name) : name;
  img.alt = alt ?? label(name);
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

export function initArt() {
  const tab = document.getElementById("tab-art");
  const artScatter = document.getElementById("art-scatter");
  const grid = document.getElementById("art-grid");
  const subnav = document.getElementById("art-subnav");
  const backBtn = document.getElementById("art-back");
  const lightbox = document.getElementById("art-lightbox");
  const lightboxImg = document.getElementById("art-lightbox-img");

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
    coverBtn.appendChild(makeImg(null, "assets/art-cover.png", "Sketchbook cover"));
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
        : [makeImg(null, "assets/art-cover.png", "Sketchbook cover"), ...ILLUSTRATIONS.map((name) => makeImg("illustrations", name))];
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
  }

  buildStack();

  function reset() {
    window.scrollTo({ top: 0 });
    tab.dataset.state = "cover";
    subnav.hidden = true;
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
    renderGrid(btn.dataset.sub);
  });

  subnav.querySelector('[data-sub="illustrations"]').dataset.active = "true";

  grid.addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
  });

  lightbox.addEventListener("click", () => {
    lightbox.classList.remove("open");
  });

  return { reset };
}
