import { createSketchbook } from "./sketchbook.js?v=7";

export function initAbout() {
  const tab = document.getElementById("tab-about");
  const mount = document.getElementById("about-book");
  const trigger = document.getElementById("polaroid-trigger");
  const backBtn = document.getElementById("about-back");
  const polaroids = document.getElementById("polaroids");

  // Clicking the stack doesn't expand it into a list — it just cycles
  // which photo is on top, like flipping through a small handheld pile:
  // the front card (data-i="0") moves to the back, everyone else shifts
  // forward one slot. The four slot positions/rotations are fixed in
  // CSS (.polaroid[data-i="N"]); only which <img> currently occupies
  // slot 0 vs slot 3 changes, so the existing transform/left/top
  // transition on .polaroid animates the "flip" for free.
  const polaroidEls = Array.from(polaroids.querySelectorAll(".polaroid"));
  function cyclePolaroids() {
    const ordered = [...polaroidEls].sort((a, b) => Number(a.dataset.i) - Number(b.dataset.i));
    const front = ordered.shift();
    ordered.forEach((el, i) => (el.dataset.i = String(i)));
    front.dataset.i = String(ordered.length);
  }
  function resetPolaroidOrder() {
    polaroidEls.forEach((el, i) => (el.dataset.i = String(i)));
  }

  const book = createSketchbook(mount, {
    dir: "assets/sketchbook-about/",
    pages: [{ file: "page-1.png", title: "", place: "" }],
    coverFront: "cover-front.png",
    coverBack: "cover-back.png",
    v: "21",
    onToggle(isOpen) {
      tab.dataset.state = isOpen ? "open" : "closed";
      if (backBtn) backBtn.hidden = !isOpen;
      // fresh order each time the book is (re)opened, so "i love the
      // metro" is always the first thing on top rather than wherever
      // a previous visit left the cycle
      if (!isOpen) resetPolaroidOrder();
    },
  });

  trigger.addEventListener("click", () => {
    if (tab.dataset.state === "open") cyclePolaroids();
  });

  backBtn?.addEventListener("click", () => {
    if (tab.dataset.state === "open") book.goTo(0);
  });
}
