import { createSketchbook } from "./sketchbook.js";

export function initAbout() {
  const tab = document.getElementById("tab-about");
  const mount = document.getElementById("about-book");
  const trigger = document.getElementById("polaroid-trigger");
  const backBtn = document.getElementById("about-back");
  const polaroids = document.getElementById("polaroids");

  // Centers the scrollable polaroid column on the middle of the right
  // page of the open spread. The mount's on-screen size/position can't
  // be known from CSS alone (it depends on the aspect-ratio math in
  // .mat/.mat-frame), so this reads the real rect and pins the column
  // there with an inline left/transform, rather than guessing a fixed
  // viewport-relative offset that would drift off the spread at other
  // viewport sizes.
  function positionPolaroidColumn() {
    if (tab.dataset.state !== "expanded") return;
    const r = mount.getBoundingClientRect();
    const rightHalfCenter = r.left + r.width * 0.75;
    polaroids.style.left = `${rightHalfCenter}px`;
    polaroids.style.transform = "translateX(-50%)";
  }
  addEventListener("resize", positionPolaroidColumn);

  // sketchbook.js's own left/right arrow-key page-turning lives on
  // `window` and knows nothing about our "expanded" lock — it isn't
  // gated by the pointer-events:none we put on the mount (that only
  // blocks pointer/touch input), so an arrow key while expanded could
  // still flip the book closed underneath the still-spread-out
  // polaroids. Swallow it in the capture phase (which always runs
  // before that bubble-phase listener) so the only way to close is
  // still the back button's staged recluster-then-close.
  addEventListener(
    "keydown",
    (e) => {
      if (tab.dataset.state === "expanded" && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.stopImmediatePropagation();
      }
    },
    true
  );

  const book = createSketchbook(mount, {
    dir: "assets/sketchbook-about/",
    pages: [{ file: "page-1.png", title: "", place: "" }],
    coverFront: "cover-front.png",
    coverBack: "cover-back.png",
    v: "12",
    onToggle(isOpen) {
      // While expanded, ignore a spurious "still open" repaint (that
      // should just stay expanded) — but if the book somehow ends up
      // closed anyway, don't leave the state stuck on "expanded" with
      // the polaroid column floating over a closed cover forever.
      if (tab.dataset.state === "expanded" && isOpen) return;
      tab.dataset.state = isOpen ? "open" : "closed";
      if (backBtn) backBtn.hidden = !isOpen;
      if (!isOpen) {
        polaroids.style.left = "";
        polaroids.style.transform = "";
      }
    },
  });

  trigger.addEventListener("click", () => {
    if (tab.dataset.state === "open") {
      tab.dataset.state = "expanded";
      if (backBtn) backBtn.hidden = false;
      positionPolaroidColumn();
    }
  });

  backBtn?.addEventListener("click", () => {
    if (tab.dataset.state === "expanded") {
      tab.dataset.state = "open";
      polaroids.style.left = "";
      polaroids.style.transform = "";
    } else if (tab.dataset.state === "open") {
      book.goTo(0);
    }
  });
}
