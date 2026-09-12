// Renders a project from window.PROJECTS (js/projects.js) into a
// container, using the "prv-*" markup/CSS ported from the other Kari Wu
// portfolio build's case-study.html template (see css/case-study.css).
// Adapted for in-page use: no page <title>/meta writes, no dark mode, no
// separate-page "next project" nav (this site reveals the case study in
// place under the sticky hero rather than navigating to a new URL).

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s ?? "";
  return d.innerHTML;
}

function paras(str) {
  if (!str) return "";
  return str
    .split("\n\n")
    .map((t) => {
      t = t.trim();
      return t ? `<p>${esc(t)}</p>` : "";
    })
    .join("");
}

function imgRow(images) {
  if (!images || !images.length) return "";
  if (images.length === 1) {
    const img = images[0];
    return (
      `<img class="prv-img" src="${img.src}" alt="${esc(img.caption || "")}" loading="lazy" />` +
      (img.caption ? `<p class="prv-img-caption">${esc(img.caption)}</p>` : "")
    );
  }
  let html = '<div class="prv-img-row">';
  images.forEach((img) => {
    html +=
      '<div class="prv-img-wrap">' +
      `<img src="${img.src}" alt="${esc(img.caption || "")}" loading="lazy" />` +
      (img.caption ? `<p class="prv-img-caption">${esc(img.caption)}</p>` : "") +
      "</div>";
  });
  html += "</div>";
  return html;
}

function imgGrid(images) {
  if (!images || !images.length) return "";
  let html = '<div class="prv-img-grid">';
  images.forEach((img) => {
    html += `<img src="${img.src}" alt="${esc(img.caption || "")}" loading="lazy" />`;
  });
  html += "</div>";
  return html;
}

function fmtCat(cat) {
  if (cat === "ui-projects") return "UI Design";
  if (cat === "product-design") return "Product Design";
  if (cat === "branding-concepts") return "Branding";
  return cat;
}

let spyCleanup = null;

export function renderCaseStudy(mainEl, sidebarEl, p) {
  if (spyCleanup) {
    spyCleanup();
    spyCleanup = null;
  }
  if (!p) {
    mainEl.innerHTML = "";
    sidebarEl.innerHTML = "";
    return;
  }

  const s = p.sections || {};
  const sidebarItems = [{ id: "hero", label: "Overview" }];
  let sectionsHTML = "";
  let num = 1;

  function makeSection(id, numLabel, sidebarLabel, heading, contentHTML) {
    sidebarItems.push({ id, label: sidebarLabel });
    return (
      `<section id="${id}" class="prv-section">` +
      '<div class="prv-container">' +
      `<div class="prv-section-num">${String(num++).padStart(2, "0")} — ${esc(numLabel)}</div>` +
      `<h2>${esc(heading)}</h2>` +
      contentHTML +
      "</div>" +
      "</section>"
    );
  }

  if (p.projects && p.projects.length) {
    // multi-project case study (Build Our Bridges' two sub-projects)
    p.projects.forEach((proj, i) => {
      const shortLabel = proj.label.replace(/^Project \d+ — /, "");
      const id = "project-" + i;
      sidebarItems.push({ id, label: shortLabel });

      let content = `<div class="prv-project-label">${esc(proj.label)}</div>`;
      if (proj.problem) content += paras(proj.problem);
      if (proj.solution) content += paras(proj.solution);

      if (proj.process) {
        content += paras(proj.process.text);
        if (proj.process.planningImage) {
          content += `<img class="prv-img" src="${proj.process.planningImage}" alt="Planning" loading="lazy" />`;
        }
        if (proj.process.brandImages && proj.process.brandImages.length) {
          content += imgRow(proj.process.brandImages);
        }
        if (proj.process.images && proj.process.images.length) {
          content += imgRow(proj.process.images);
        }
        if (proj.process.screenImages && proj.process.screenImages.length) {
          content += imgRow(proj.process.screenImages);
        }
      }

      if (proj.takeaways) content += paras(proj.takeaways);

      sectionsHTML += `<section id="${id}" class="prv-section"><div class="prv-container">${content}</div></section>`;
      num++;
    });
  } else {
    if (s.context) {
      sectionsHTML += makeSection("context", "Context", "Context", s.context.split("\n\n")[0].trim(), paras(s.context));
    }
    if (s.problem) {
      sectionsHTML += makeSection("problem", "The Problem", "Problem", s.problem.split("\n\n")[0].trim(), paras(s.problem));
    }
    if (s.solution) {
      let solContent = paras(s.solution);
      if (p.demoVideo) {
        solContent += `<video class="prv-video" src="${p.demoVideo}" autoplay muted loop playsinline controls></video>`;
      }
      sectionsHTML += makeSection("solution", "Solution", "Solution", s.solution.split("\n\n")[0].trim(), solContent);
    }
    if (s.process && s.process.images && s.process.images.length) {
      const procContent = paras(s.process.text) + imgRow(s.process.images);
      sectionsHTML += makeSection("process", "Process", "Process", "Process", procContent);
    }
    if (s.customSections && s.customSections.length) {
      s.customSections.forEach((cs, i) => {
        const id = "custom-" + i;
        let imgHTML = cs.layout === "grid" ? imgGrid(cs.images) : imgRow(cs.images);
        if (cs.subRow && cs.subRow.length) imgHTML += imgRow(cs.subRow);
        sidebarItems.push({ id, label: cs.label });
        sectionsHTML +=
          `<section id="${id}" class="prv-section">` +
          '<div class="prv-container">' +
          `<div class="prv-section-num">${String(num++).padStart(2, "0")} — ${esc(cs.label)}</div>` +
          `<h2>${esc(cs.label)}</h2>` +
          imgHTML +
          "</div>" +
          "</section>";
      });
    }
    if (s.takeaways) {
      let takContent = paras(s.takeaways);
      if (s.takeawayImage) {
        takContent += `<img class="prv-img" src="${s.takeawayImage}" alt="${esc(s.takeawayImageCaption || "")}" loading="lazy" />`;
        if (s.takeawayImageCaption) takContent += `<p class="prv-img-caption">${esc(s.takeawayImageCaption)}</p>`;
      }
      sectionsHTML += makeSection("reflections", "Reflections", "Reflections", "Reflections", takContent);
    }
  }

  const heroHTML =
    '<section id="hero" style="padding-top:16px;">' +
    '<div class="prv-container">' +
    '<div class="prv-hero">' +
    '<div class="prv-hero-meta">' +
    `<span class="prv-hero-tag">${esc(fmtCat(p.category))}</span>` +
    '<span class="prv-hero-tag" style="color:var(--cs-muted);">·</span>' +
    '<span class="prv-hero-tag" style="color:var(--cs-muted);font-weight:500;text-transform:none;letter-spacing:0;">Case Study</span>' +
    "</div>" +
    `<h1>${esc(p.title)}</h1>` +
    `<div class="prv-hero-summary">${esc(p.blurb)}</div>` +
    '<div class="prv-hero-attrs">' +
    `<div><div class="prv-attr-label">Project</div><div class="prv-attr-val">${esc(p.title)}</div></div>` +
    `<div><div class="prv-attr-label">Role</div><div class="prv-attr-val">${esc(p.role)}</div></div>` +
    `<div><div class="prv-attr-label">Timeline</div><div class="prv-attr-val">${esc(p.timeline)}</div></div>` +
    "</div>" +
    "</div>" +
    "</div>" +
    `<img class="prv-hero-img" src="${p.heroImage}" alt="${esc(p.title)}" />` +
    "</section>";

  const allProjects = window.PROJECTS || [];
  const idx = allProjects.findIndex((x) => x.id === p.id);
  const prevProject = allProjects.length ? allProjects[(idx - 1 + allProjects.length) % allProjects.length] : null;
  const nextProject = allProjects.length ? allProjects[(idx + 1) % allProjects.length] : null;

  const footerHTML =
    (prevProject || nextProject) &&
    '<section class="prv-section">' +
      '<div class="prv-container prv-project-nav-row">' +
      (prevProject
        ? `<button type="button" class="prv-project-btn prv-project-btn--prev" data-project-nav="${esc(prevProject.id)}">` +
          '<span class="prv-project-nav-label">← Previous project</span>' +
          `<span class="prv-project-nav-title">${esc(prevProject.title)}</span>` +
          "</button>"
        : "<span></span>") +
      (nextProject
        ? `<button type="button" class="prv-project-btn prv-project-btn--next" data-project-nav="${esc(nextProject.id)}">` +
          '<span class="prv-project-nav-label">Next project →</span>' +
          `<span class="prv-project-nav-title">${esc(nextProject.title)}</span>` +
          "</button>"
        : "<span></span>") +
      "</div>" +
      "</section>";

  mainEl.className = "case-study prv-page";
  mainEl.innerHTML = heroHTML + sectionsHTML + (footerHTML || "");

  sidebarEl.innerHTML = sidebarItems
    .map((item, i) => `<a href="#${item.id}"${i === 0 ? ' class="active"' : ""}>${esc(item.label)}</a>`)
    .join("");

  const ids = sidebarItems.map((x) => x.id);
  const links = Array.from(sidebarEl.querySelectorAll("a"));
  function updateSpy() {
    const threshold = window.scrollY + 96 + 24;
    let activeIdx = 0;
    ids.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= threshold) activeIdx = i;
    });
    links.forEach((a, i) => a.classList.toggle("active", i === activeIdx));
  }
  window.addEventListener("scroll", updateSpy, { passive: true });
  updateSpy();
  spyCleanup = () => window.removeEventListener("scroll", updateSpy);

  // jump-links are relative to the whole page's scroll position, same
  // scroll container the case study itself lives in
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(a.getAttribute("href").slice(1));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
