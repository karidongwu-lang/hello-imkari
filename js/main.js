import { initWork } from "./work.js?v=23";
import { initArt } from "./art.js?v=20";
import { initAbout } from "./about.js?v=15";

const tabs = {
  work: document.getElementById("tab-work"),
  art: document.getElementById("tab-art"),
  about: document.getElementById("tab-about"),
};

const navGroups = document.querySelectorAll("[data-nav-group]");

function setActiveNav(name) {
  navGroups.forEach((group) => {
    group.querySelectorAll(".nav-link[data-tab]").forEach((btn) => {
      if (btn.dataset.tab === name) {
        btn.dataset.active = "true";
      } else {
        btn.removeAttribute("data-active");
      }
    });
  });
}

function showTab(name) {
  Object.entries(tabs).forEach(([key, el]) => {
    el.hidden = key !== name;
  });
  setActiveNav(name);
  window.scrollTo({ top: 0 });
  document.dispatchEvent(new CustomEvent("tabchange", { detail: { tab: name } }));
}

navGroups.forEach((group) => {
  group.addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-link[data-tab]");
    if (!btn) return;
    // (work) and (art) always land on their default landing view, no
    // matter what state they were left in — unlike (about), which
    // remembers where you left it
    if (btn.dataset.tab === "work") work.reset();
    if (btn.dataset.tab === "art") art.reset();
    showTab(btn.dataset.tab);
  });
});

const work = initWork();
const art = initArt();
initAbout();
showTab("work");
