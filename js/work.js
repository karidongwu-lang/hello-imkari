import { lerp, clamp } from "./util.js?v=1";
import { createSketchbook } from "./sketchbook.js?v=7";
import { renderCaseStudy } from "./case-study.js?v=4";

// Percentages are relative to the full .mat box.
const REST = { cx: 50, cy: 56, w: 22, rot: 0 };
// Once the mat-frame is fully stuck, only its bottom strip is visible
// on screen — 10.4% of the viewport height, matching
// css/styles.css's .mat-frame--sticky top offset — so the "parked"
// spot must sit near the mat's own bottom edge (not its top) for the
// card to land inside that strip.
const PARKED = { cx: 7, cy: 102, w: 26, rot: -12 };
const STUCK_STRIP_VH = 0.104;
function stuckStripPx() {
  return window.innerHeight * STUCK_STRIP_VH;
}

export function initWork() {
  const tab = document.getElementById("tab-work");
  const matFrame = document.getElementById("work-hero");
  const mat = document.getElementById("work-mat");
  const mount = document.getElementById("work-book");
  const notecardsEl = document.getElementById("notecards");
  const caseStudy = document.getElementById("case-study");
  const caseStudySidebar = document.getElementById("case-study-sidebar");
  const headline = document.getElementById("work-headline");
  const backBtn = document.getElementById("work-back");

  let bookOpen = false;
  let selectedCard = null;
  let isActiveTab = false;

  const book = createSketchbook(mount, {
    dir: "assets/sketchbook-work/",
    pages: [{ file: "page-1.webp", title: "", place: "" }],
    coverFront: "cover-front.webp",
    coverBack: "cover-back.webp",
    v: "17",
    onToggle(isOpen) {
      bookOpen = isOpen;
      tab.dataset.state = selectedCard ? "selected" : isOpen ? "open" : "closed";
      if (isOpen && !selectedCard) notecardsEl.classList.add("show");
      else if (!isOpen) notecardsEl.classList.remove("show");
      if (backBtn) backBtn.hidden = !isOpen && !selectedCard;
    },
  });

  // Same slight pointer-tilt the sketchbooks (and the art landing page)
  // have, but only while the picked card is still resting in the
  // middle — once scrolling starts parking it into the corner, the lerp
  // in applyScroll takes over the rest of its transform and the card is
  // too small there for a tilt to read as anything but noise.
  const TILT_X = 4.5,
    TILT_Y = 7;
  function resetTilt(card) {
    card?.style.setProperty("--card-rx", "0deg");
    card?.style.setProperty("--card-ry", "0deg");
  }
  function tiltTo(cx, cy) {
    if (tab.dataset.state !== "selected" || !selectedCard || scrollProgress() > 0.05) return;
    const r = mat.getBoundingClientRect();
    if (!r.width) return;
    const nx = Math.max(-1, Math.min(1, (cx - (r.left + r.width / 2)) / (r.width * 0.62)));
    const ny = Math.max(-1, Math.min(1, (cy - (r.top + r.height / 2)) / (r.height * 0.9)));
    selectedCard.style.setProperty("--card-rx", (-ny * TILT_X).toFixed(2) + "deg");
    selectedCard.style.setProperty("--card-ry", (nx * TILT_Y).toFixed(2) + "deg");
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
    if (!e.relatedTarget) resetTilt(selectedCard);
  });

  function selectProject(id, card) {
    resetTilt(selectedCard);
    selectedCard = card || null;
    tab.dataset.state = "selected";
    caseStudy.hidden = false;
    caseStudy.dataset.slug = id;
    const project = (window.PROJECTS || []).find((p) => p.id === id);
    renderCaseStudy(caseStudy, caseStudySidebar, project);
    mount.classList.add("dropped");
    if (backBtn) backBtn.hidden = false;

    notecardsEl.querySelectorAll(".notecard").forEach((c) => {
      if (c === card) {
        c.classList.add("notecard--selected");
        c.classList.remove("notecard--dropped");
      } else {
        c.classList.add("notecard--dropped");
      }
    });

    // settles at the centered/straightened spot (stars 34) and stays
    // there — the lock-in (stars 35) only happens once the visitor
    // actually scrolls, not automatically
  }

  function deselectCard() {
    window.scrollTo({ top: 0 });
    selectedCard = null;
    tab.dataset.state = "open";
    caseStudy.hidden = true;
    caseStudySidebar.classList.remove("visible");
    matFrame.classList.remove("stuck-flush");
    renderCaseStudy(caseStudy, caseStudySidebar, null);
    mount.classList.remove("dropped");
    if (backBtn) backBtn.hidden = false;
    notecardsEl.querySelectorAll(".notecard").forEach((c) => {
      c.classList.remove("notecard--selected", "notecard--dropped");
      c.style.left = c.style.top = c.style.width = c.style.transform = c.style.transition = "";
      resetTilt(c);
    });
    headline.style.opacity = "";
  }

  // Used by the case study's "next/previous project" footer buttons —
  // jumps straight to the target project already fully parked/scrolled
  // in, rather than replaying the whole cover-open-select reveal, since
  // the visitor is already deep in a case study when they click it.
  // Falls back to a card-less selection for projects with no matching
  // notecard (3miu/blink aren't among the 3 notecards on the mat).
  function goToProject(id) {
    const card = notecardsEl.querySelector(`.notecard[data-card="${id}"]`);
    selectProject(id, card);
    // Landing exactly on caseStudy.offsetTop put the hero title right
    // behind the still-visible sticky mat strip (the mat sits above the
    // content, z-index-wise, at whatever scroll position lands there) —
    // scroll so the title itself clears that strip, however tall it
    // currently is. The title sits closer to the top of the hero than
    // the strip is tall, so this needs LESS scroll than offsetTop, not
    // more — the floor below only guarantees the card stays fully
    // parked (scrollProgress() == 1), it isn't "at least offsetTop".
    const h1 = caseStudy.querySelector("h1");
    const h1Top = h1 ? h1.getBoundingClientRect().top + window.scrollY : caseStudy.offsetTop;
    const parkedFloor = window.innerHeight - stuckStripPx();
    const target = Math.max(parkedFloor, h1Top - stuckStripPx() - 16);
    window.scrollTo({ top: target });
    requestAnimationFrame(applyScroll);
  }

  notecardsEl.addEventListener("click", (e) => {
    const card = e.target.closest(".notecard");
    if (!card) return;
    if (card === selectedCard) {
      // clicking the already-centered card is the explicit "go" gesture
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      return;
    }
    if (!bookOpen || selectedCard) return;
    selectProject(card.dataset.card, card);
  });

  caseStudy.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-project-nav]");
    if (btn) goToProject(btn.dataset.projectNav);
  });

  backBtn?.addEventListener("click", () => {
    if (tab.dataset.state === "selected") deselectCard();
    else if (bookOpen) book.goTo(0);
  });

  // Tied to the sticky hero's own collapse distance (its CSS pins it at
  // `top: calc(-100vh + 10.4vh)`), not to the spacer's height — so the
  // notecard-parking animation always finishes exactly as the mat
  // finishes visually collapsing, regardless of how tall the spacer is.
  function scrollProgress() {
    const dist = Math.max(1, window.innerHeight - stuckStripPx());
    return clamp(window.scrollY / dist, 0, 1);
  }

  // Sidebar only appears once the hero image has scrolled out of view
  // (per request), and its vertical position tracks the parked
  // notecard's actual bottom edge live rather than a guessed constant,
  // so it can never drift back into overlapping the card.
  function updateSidebar() {
    const heroImg = caseStudy.querySelector(".prv-hero-img");
    const pastHero = !!heroImg && heroImg.getBoundingClientRect().bottom <= stuckStripPx() + 10;
    caseStudySidebar.classList.toggle("visible", pastHero);
    if (!pastHero) return;
    const anchorBottom = selectedCard ? selectedCard.getBoundingClientRect().bottom : stuckStripPx();
    caseStudySidebar.style.top = `${Math.max(96, anchorBottom + 24)}px`;
  }

  function applyScroll() {
    if (!isActiveTab || tab.dataset.state !== "selected") {
      return;
    }
    const p = scrollProgress();

    headline.style.opacity = String(1 - p);
    // the parked card docks in the same bottom-left corner as the back
    // button, so hide it once the card has moved in close enough to overlap
    if (backBtn) backBtn.hidden = p > 0.15;

    if (selectedCard) {
      selectedCard.style.transition = p > 0 && p < 1 ? "none" : "";
      selectedCard.style.left = `${lerp(REST.cx, PARKED.cx, p)}%`;
      selectedCard.style.top = `${lerp(REST.cy, PARKED.cy, p)}%`;
      selectedCard.style.width = `${lerp(REST.w, PARKED.w, p)}%`;
      selectedCard.style.transform = `translate(-50%, -50%) rotate(${lerp(REST.rot, PARKED.rot, p)}deg) rotateX(var(--card-rx, 0deg)) rotateY(var(--card-ry, 0deg))`;
    }

    // only flush the frame's bottom padding once truly parked — doing
    // it for the whole "selected" state (rather than gating on scroll
    // progress) pushed the still full-size resting mat down out of view
    // the instant a card was picked, before any scrolling happened
    matFrame.classList.toggle("stuck-flush", p >= 0.98);

    updateSidebar();
  }

  window.addEventListener("scroll", () => requestAnimationFrame(applyScroll), { passive: true });
  window.addEventListener("resize", () => requestAnimationFrame(applyScroll));

  document.addEventListener("tabchange", (e) => {
    isActiveTab = e.detail.tab === "work";
    if (isActiveTab) requestAnimationFrame(applyScroll);
  });

  // clicking (work) in the nav should always land back on the default
  // closed-cover view, regardless of whatever state was left behind
  function reset() {
    window.scrollTo({ top: 0 });
    if (selectedCard) deselectCard();
    if (bookOpen) book.goTo(0);
  }

  return { reset };
}
