// Sketchbook flipbook engine — adapted from sketchbook-template/widget.html.
// Same turn/curl/tilt/zoom math as the source template, just wrapped in a
// factory so multiple independent books can be mounted on one page (no
// shared ids/globals) and scoped so only the visible instance reacts to
// window-level input.

const MARKUP = `
<div class="sb-wrap" data-role="wrap">
  <div class="sb-stage" data-role="stage">
    <button class="sb-arrow left" data-role="prev" aria-label="previous page">
      <svg viewBox="0 0 14 44" width="14" height="44" fill="none" aria-hidden="true"><polyline points="11,3 3,22 11,41" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="sb-3d" data-role="3d">
      <div class="sb-tilt" data-role="tilt">
        <div class="sb-cast ambient" aria-hidden="true"></div>
        <div class="sb-cast contact" aria-hidden="true"></div>
        <div class="sb-cast hair" aria-hidden="true"></div>
        <div class="sb-book" data-role="book"></div>
      </div>
    </div>
    <button class="sb-arrow right" data-role="next" aria-label="next page">
      <svg viewBox="0 0 14 44" width="14" height="44" fill="none" aria-hidden="true"><polyline points="3,3 11,22 3,41" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  </div>
  <div class="sb-captions" data-role="captions"></div>
  <div class="sb-tools" role="group" aria-label="view controls">
    <button class="tool" data-role="zoom-out" aria-label="zoom out"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="8.6" cy="8.6" r="5.6"/><path d="M12.8 12.8 17.4 17.4M6.2 8.6h4.8"/></svg></button>
    <span class="zoom-read" data-role="zoom-read">100%</span>
    <button class="tool" data-role="zoom-in" aria-label="zoom in"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="8.6" cy="8.6" r="5.6"/><path d="M12.8 12.8 17.4 17.4M6.2 8.6h4.8M8.6 6.2v4.8"/></svg></button>
  </div>
  <p class="sb-hint" data-role="hint">Tap the cover to open</p>
</div>
`;

export function createSketchbook(mount, { dir, pages, coverFront, coverBack, onToggle, v }) {
  // cache-bust: image URLs are otherwise identical across asset
  // regenerations, so browsers can keep serving a stale cached copy
  const qs = v ? `?v=${encodeURIComponent(v)}` : "";
  mount.innerHTML = MARKUP;
  const q = (role) => mount.querySelector(`[data-role="${role}"]`);

  const wrap = q("wrap");
  const stage = q("stage");
  const sb3d = q("3d");
  const book = q("book");
  const capBox = q("captions");
  const hint = q("hint");
  const prevBtn = q("prev");
  const nextBtn = q("next");
  const zOutBtn = q("zoom-out");
  const zInBtn = q("zoom-in");
  const zRead = q("zoom-read");

  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isVisible = () => mount.offsetParent !== null;

  const PAGES = pages.map((p) => ({ ...p, url: dir + p.file + qs }));
  const COVER_FRONT = { file: coverFront, title: "", place: "", cover: true, url: dir + coverFront + qs };
  const COVER_BACK = { file: coverBack, title: "", place: "", cover: true, url: dir + coverBack + qs };
  const SPREADS = [COVER_FRONT, ...PAGES, COVER_BACK];
  const TOTAL = SPREADS.length;

  function isClosed(i) {
    return i === 0 || i === TOTAL - 1;
  }
  function sideSign(i) {
    return i === 0 ? -1 : i === TOTAL - 1 ? 1 : 0;
  }
  function setFootprint(footprint, sign) {
    sb3d.style.setProperty("--footprint", footprint.toFixed(3));
    sb3d.style.setProperty("--fpL", sign < 0 ? footprint.toFixed(3) : "0");
    sb3d.style.setProperty("--fpR", sign > 0 ? footprint.toFixed(3) : "0");
    sb3d.style.setProperty("--shift", (sign * footprint * 25).toFixed(2) + "%");
  }

  const N = 18;
  const SPAN = 0.5;
  const BETA = 0.6;
  const COVER_N = 18;
  const COVER_BETA = 0.6;
  let idx = 0,
    turn = null;
  let strips = [];

  function el(t, c) {
    const e = document.createElement(t);
    if (c) e.className = c;
    return e;
  }
  function imgEl(i, side) {
    const im = new Image();
    im.className = "sb-half-img " + side;
    im.draggable = false;
    im.alt = "";
    im.src = SPREADS[i].url;
    return im;
  }
  function halfEl(pos, i) {
    const d = el("div", "sb-half " + pos);
    d.appendChild(imgEl(i, pos));
    d.appendChild(el("div", "gutter-shade " + pos));
    return d;
  }

  function buildCurl(dir_, from, to, n) {
    strips = [];
    const c = el("div", "curl " + dir_);
    c.style.setProperty("--n", n);
    c.style.setProperty("--span", SPAN);
    let host = c;
    for (let i = 0; i < n; i++) {
      const s = el("div", "strip");
      s.style.setProperty("--i", i);
      const gut = "calc(var(--bw) * 0.5)";
      const sw = "calc(var(--bw) * " + SPAN + " / " + n + ")";
      const A = "calc(-1 * (" + gut + " + " + i + " * " + sw + "))";
      const B = "calc(" + (i + 1) + " * " + sw + " - " + gut + ")";
      const f = el("div", "face front"),
        b = el("div", "face back");
      const dress = (e, url, px) => {
        e.style.backgroundImage = "url(" + url + ")";
        e.style.backgroundPositionX = px;
      };
      dress(f, SPREADS[from].url, dir_ === "next" ? A : B);
      dress(b, SPREADS[to].url, dir_ === "next" ? B : A);
      f.appendChild(el("div", "sh"));
      f.appendChild(el("div", "gl"));
      b.appendChild(el("div", "sh"));
      b.appendChild(el("div", "gl"));
      s.appendChild(f);
      s.appendChild(b);
      if (i === n - 1) s.classList.add("edge");
      host.appendChild(s);
      host = s;
      strips.push(s);
    }
    return c;
  }
  function applyTurn(t) {
    const n = turn.n,
      beta0 = turn.beta;
    const th = Math.PI * t;
    const beta = beta0 * Math.sin(Math.PI * t);
    const D = 180 / Math.PI;
    const tt = th + beta,
      td = (2 * beta) / n;
    sb3d.style.setProperty("--tt", (tt * D).toFixed(2) + "deg");
    sb3d.style.setProperty("--td", (td * D).toFixed(3) + "deg");
    sb3d.style.setProperty("--shade", Math.sin(Math.PI * t).toFixed(3));
    if (turn.cover) {
      const footprint = isClosed(turn.from) ? 1 - t : t;
      const sign = isClosed(turn.from) ? sideSign(turn.from) : sideSign(turn.to);
      setFootprint(footprint, sign);
    } else {
      setFootprint(0, 0);
    }
    fadeCaption(t);
    for (let i = 0; i < strips.length; i++) {
      const l1 = Math.abs(Math.cos(tt - i * td));
      const l2 = Math.abs(Math.cos(tt - (i + 1) * td));
      const st = strips[i].style;
      st.setProperty("--lit", l1.toFixed(3));
      st.setProperty("--a1", ((1 - l1) * 0.62).toFixed(3));
      st.setProperty("--a2", ((1 - l2) * 0.62).toFixed(3));
    }
  }
  function paint() {
    book.textContent = "";
    if (!turn) {
      const f = el("div", "sb-full");
      const im = new Image();
      im.src = SPREADS[idx].url;
      im.alt = SPREADS[idx].title || "";
      im.draggable = false;
      f.appendChild(im);
      book.appendChild(f);
      sb3d.style.setProperty("--shade", "0");
      setFootprint(isClosed(idx) ? 1 : 0, sideSign(idx));
    } else {
      const next = turn.dir === "next";
      book.appendChild(halfEl("left", next ? turn.from : turn.to));
      book.appendChild(halfEl("right", next ? turn.to : turn.from));
      book.appendChild(buildCurl(turn.dir, turn.from, turn.to, turn.n));
      applyTurn(turn.t);
    }
    // click/drag zones are appended before the onToggle callback runs, so
    // a caller error there can't leave the book with no way to open it
    const a = el("button", "sb-zone sb-prev"),
      b = el("button", "sb-zone sb-next");
    a.setAttribute("aria-label", "previous page");
    b.setAttribute("aria-label", "next page");
    book.appendChild(a);
    book.appendChild(b);

    const closedNow = isClosed(turn ? turn.to : idx);
    wrap.classList.toggle("closed", closedNow);
    if (!hint.classList.contains("gone")) {
      hint.textContent = closedNow ? "Tap the cover to open" : "Drag the page to turn";
    }
    if (onToggle) onToggle(!closedNow);
    layout();
    caption();
    marks();
  }
  function caption() {
    capBox.textContent = "";
    capOut = capIn = null;
    if (turn) {
      const fromT = SPREADS[turn.from].title,
        toT = SPREADS[turn.to].title;
      if (fromT) {
        capOut = el("p", "sb-caption live");
        capOut.textContent = fromT;
        capBox.appendChild(capOut);
      }
      if (toT) {
        capIn = el("p", "sb-caption live");
        capIn.textContent = toT;
        capBox.appendChild(capIn);
      }
      fadeCaption(turn.t);
    } else {
      const t = SPREADS[idx].title;
      if (t) {
        const p = el("p", "sb-caption");
        p.textContent = t;
        capBox.appendChild(p);
      }
    }
  }
  let capOut = null,
    capIn = null;
  function fadeCaption(t) {
    if (!capOut || !capIn) return;
    const out = 1 - Math.max(0, Math.min(1, (t - 0.1) / 0.28));
    const inn = Math.max(0, Math.min(1, (t - 0.56) / 0.3));
    capOut.style.opacity = out.toFixed(3);
    capIn.style.opacity = inn.toFixed(3);
  }
  function layout() {
    sb3d.style.setProperty("--bw", book.clientWidth + "px");
  }
  addEventListener("resize", () => {
    if (isVisible()) layout();
  });

  let spring = null;
  function animateTo(target, onDone, stiff, damp) {
    spring = { kind: "spring", v: 0, target: target, done: onDone, k: stiff || 150, c: damp || 22 };
    kick();
  }
  let raf = null,
    last = 0;
  function tick(now) {
    raf = null;
    const dt = Math.min(0.032, (now - last) / 1000 || 0.016);
    last = now;
    if (spring && turn) {
      const s = spring;
      const x = turn.t - s.target;
      s.v += (-s.k * x - s.c * s.v) * dt;
      turn.t += s.v * dt;
      if (Math.abs(turn.t - s.target) < 0.002 && Math.abs(s.v) < 0.02) {
        turn.t = s.target;
        spring = null;
        applyTurn(turn.t);
        const d = s.done;
        d && d();
      } else applyTurn(turn.t);
    }
    viewSpring();
    if ((spring || viewActive) && raf === null) raf = requestAnimationFrame(tick);
  }
  function kick() {
    if (raf === null) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  }

  const TILT_X = 4.5,
    TILT_Y = 7;
  const ZOOM_MIN = 0.9,
    ZOOM_MAX = 1.5;
  const view = { rx: 0, ry: 0, z: 1, trx: 0, try_: 0, tz: 1 };
  let viewActive = false;
  function applyView() {
    sb3d.style.setProperty("--rx", view.rx.toFixed(2) + "deg");
    sb3d.style.setProperty("--ry", view.ry.toFixed(2) + "deg");
    sb3d.style.setProperty("--zoom", view.z.toFixed(3));
  }
  function viewSpring() {
    const e = 0.14;
    let moved = false;
    for (const [k, t] of [
      ["rx", "trx"],
      ["ry", "try_"],
      ["z", "tz"],
    ]) {
      const d = view[t] - view[k];
      if (Math.abs(d) > 0.0006) {
        view[k] += d * e;
        moved = true;
      } else view[k] = view[t];
    }
    if (moved) applyView();
    viewActive = moved;
    return moved;
  }
  function setView(rx, ry, z) {
    view.trx = Math.max(-TILT_X, Math.min(TILT_X, rx));
    view.try_ = Math.max(-TILT_Y, Math.min(TILT_Y, ry));
    view.tz = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));
    viewActive = true;
    kick();
    syncZoom();
  }
  function tiltTo(cx, cy) {
    if (drag) return;
    const r = book.getBoundingClientRect();
    if (!r.width) return;
    const nx = Math.max(-1, Math.min(1, (cx - (r.left + r.width / 2)) / (r.width * 0.62)));
    const ny = Math.max(-1, Math.min(1, (cy - (r.top + r.height / 2)) / (r.height * 0.9)));
    setView(-ny * TILT_X, nx * TILT_Y, view.tz);
  }
  addEventListener(
    "pointermove",
    (e) => {
      if (!isVisible() || e.pointerType === "touch") return;
      tiltTo(e.clientX, e.clientY);
    },
    { passive: true }
  );
  addEventListener("pointerout", (e) => {
    if (!isVisible()) return;
    if (!e.relatedTarget) setView(0, 0, view.tz);
  });
  addEventListener("blur", () => {
    if (isVisible()) setView(0, 0, view.tz);
  });
  stage.addEventListener("dblclick", () => setView(view.trx, view.try_, 1));

  let drag = null;
  function bookRect() {
    return book.getBoundingClientRect();
  }
  function hideHint() {
    hint.classList.add("gone");
  }

  stage.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const onBook = e.target.closest(".sb-zone");
    stage.setPointerCapture(e.pointerId);
    hideHint();
    if (!onBook) return;
    const r = bookRect();
    let dir_ = (e.clientX - r.left) / r.width > 0.5 ? "next" : "prev";
    if (idx === 0) dir_ = "next";
    else if (idx === TOTAL - 1) dir_ = "prev";
    startTurn(dir_, 0);
    drag = { dir: dir_, x0: e.clientX, w: r.width, moved: 0, vel: 0, tPrev: performance.now() };
  });
  stage.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x0;
    drag.moved = Math.max(drag.moved, Math.abs(dx));
    const raw = (drag.dir === "next" ? -dx : dx) / (drag.w * 0.62);
    const t = Math.max(0, Math.min(1, raw));
    const now = performance.now();
    drag.vel = (t - (turn ? turn.t : 0)) / Math.max(0.001, (now - drag.tPrev) / 1000);
    drag.tPrev = now;
    if (turn) {
      turn.t = t;
      applyTurn(t);
    }
  });
  function endDrag() {
    if (!drag) return;
    const d = drag;
    drag = null;
    if (!turn) return;
    if (d.moved < 6) {
      commit();
      return;
    }
    const go = turn.t > 0.42 || d.vel > 1.1;
    if (go) commit();
    else cancel();
  }
  stage.addEventListener("dragstart", (e) => e.preventDefault());
  stage.addEventListener("selectstart", (e) => e.preventDefault());
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  function startTurn(dir_, t) {
    spring = null;
    if (turn) {
      idx = turn.to;
      turn = null;
    }
    const from = idx;
    const to = dir_ === "next" ? Math.min(from + 1, TOTAL - 1) : Math.max(from - 1, 0);
    if (to === from) return;
    const cover = isClosed(from) || isClosed(to);
    turn = { dir: dir_, from: from, to: to, t: t || 0, n: cover ? COVER_N : N, beta: cover ? COVER_BETA : BETA, cover: cover };
    paint();
  }
  function commit() {
    if (!turn) return;
    if (REDUCED) {
      idx = turn.to;
      turn = null;
      paint();
      return;
    }
    animateTo(
      1,
      () => {
        idx = turn.to;
        turn = null;
        paint();
      },
      170,
      26
    );
    kick();
  }
  function cancel() {
    if (!turn) return;
    animateTo(
      0,
      () => {
        turn = null;
        paint();
      },
      150,
      24
    );
    kick();
  }
  function step(dir_) {
    if (turn) {
      idx = turn.to;
      turn = null;
    }
    startTurn(dir_, 0);
    commit();
  }
  function goTo(i) {
    i = Math.max(0, Math.min(TOTAL - 1, i));
    if (i === idx) return;
    if (turn) {
      idx = turn.to;
      turn = null;
    }
    if (Math.abs(i - idx) === 1) {
      step(i > idx ? "next" : "prev");
      return;
    }
    idx = i;
    paint();
  }
  prevBtn.onclick = () => step("prev");
  nextBtn.onclick = () => step("next");

  // Robust fallback for turning a page by clicking: the primary path is
  // stage's pointerdown -> hit-test against .sb-zone, but that hit-test
  // lives inside a nested perspective/preserve-3d/translateZ transform
  // stack, which some browsers (seen in Chrome, not Safari) resolve
  // incorrectly for real pointer input even though it visually renders
  // in the right place. A plain click on the flat, untransformed mount
  // element doesn't depend on that hit-test at all. Guarded by `!turn`
  // so it's a no-op if the primary path already handled it (turn is set
  // synchronously by startTurn, before this click fires).
  //
  // This used to only handle "click the closed cover to open it" (the
  // only turn a single-page book like work/about's ever needs), which
  // is exactly why a multi-page book (the art book, 25 real pages) was
  // the first place a plain click failing to turn INTERIOR pages ever
  // surfaced — general next/prev needs the same flat fallback, picking
  // a direction from which half of the mount was clicked, same as
  // stage's own pointerdown handler does.
  mount.addEventListener("click", (e) => {
    if (turn) return;
    if (isClosed(idx)) {
      hideHint();
      step("next");
      return;
    }
    const r = mount.getBoundingClientRect();
    if (!r.width) return;
    const dir_ = (e.clientX - r.left) / r.width > 0.5 ? "next" : "prev";
    if ((dir_ === "next" && idx >= TOTAL - 1) || (dir_ === "prev" && idx <= 0)) return;
    hideHint();
    step(dir_);
  });
  addEventListener("keydown", (e) => {
    if (!isVisible()) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    e.preventDefault();
    hideHint();
    step(e.key === "ArrowRight" ? "next" : "prev");
  });

  function syncZoom() {
    zRead.textContent = Math.round(view.tz * 100) + "%";
    zOutBtn.disabled = view.tz <= ZOOM_MIN + 0.001;
    zInBtn.disabled = view.tz >= ZOOM_MAX - 0.001;
  }
  zInBtn.onclick = () => {
    setView(view.trx, view.try_, view.tz * 1.16);
    hideHint();
  };
  zOutBtn.onclick = () => {
    setView(view.trx, view.try_, view.tz / 1.16);
    hideHint();
  };

  function marks() {
    const atFront = idx <= 0 && !turn,
      atBack = idx >= TOTAL - 1 && !turn;
    prevBtn.disabled = atFront;
    nextBtn.disabled = atBack;
  }

  (async function boot() {
    idx = 0;
    paint();
    applyView();
    await Promise.all(
      SPREADS.map((p) => {
        const im = new Image();
        im.src = p.url;
        return im.decode ? im.decode().catch(() => {}) : new Promise((r) => (im.onload = im.onerror = r));
      })
    );
    if (document.fonts && document.fonts.ready) await document.fonts.ready.catch(() => {});
    syncZoom();
    mount.dataset.ready = "1";
  })();

  return { goTo, step };
}
