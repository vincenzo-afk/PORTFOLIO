/**
 * book.js
 * ---------------------------------------------------------------------------
 * The book engine. Handles:
 *   - page composition from DATA (see data.js)
 *   - the realistic two-layer page-flip animation
 *   - navigation (arrows, keyboard, swipe, wheel, TOC, search)
 *   - bookmarks, dark mode, sound toggle, fullscreen, reduced motion
 *   - lightbox for certificates / photography
 *   - printable résumé generation
 *
 * You should not need to edit this file to update content — see data.js.
 * ---------------------------------------------------------------------------
 */
(() => {
  "use strict";

  // ======================================================================
  // 1. PAGE DEFINITIONS — composes DATA into the linear list of leaves
  // ======================================================================

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  const para = (t) => `<p>${esc(t).trim().replace(/\s+/g, " ")}</p>`;

  function renderWhoAmI1() {
    const d = DATA.whoAmI;
    return `
      <h2 class="page-title">Who Am I</h2>
      <p class="drop-cap">${esc(d.intro).trim().replace(/\s+/g, " ")}</p>
      ${para(d.bio)}
      <div class="margin-note">"${esc(DATA.foreword.quote)}"</div>
    `;
  }

  function renderWhoAmI2() {
    const d = DATA.whoAmI;
    return `
      <h3 class="page-subtitle">Vision</h3>
      ${para(d.vision)}
      <h3 class="page-subtitle">Goals</h3>
      <ul class="quill-list">${d.goals.map(g => `<li>${esc(g)}</li>`).join("")}</ul>
      <h3 class="page-subtitle">Philosophy</h3>
      <p class="highlight">${esc(d.philosophy)}</p>
    `;
  }

  function renderAbout1() {
    const d = DATA.about;
    return `
      <h2 class="page-title">About Me</h2>
      <h3 class="page-subtitle">Education</h3>
      <div class="timeline">
        ${d.education.map(e => `
          <div class="timeline-item">
            <div class="timeline-year">${esc(e.year)}</div>
            <div class="timeline-body">
              <div class="timeline-title">${esc(e.title)}</div>
              <div class="timeline-place">${esc(e.place)}</div>
              <div class="timeline-detail">${esc(e.detail)}</div>
            </div>
          </div>`).join("")}
      </div>
    `;
  }

  function renderAbout2() {
    const d = DATA.about;
    return `
      <h3 class="page-subtitle">Journey</h3>
      ${para(d.journey)}
      <h3 class="page-subtitle">Personal Growth</h3>
      ${para(d.growth)}
      <h3 class="page-subtitle">Skills</h3>
      <div class="skill-bars">
        ${d.skillsSnapshot.map(s => `
          <div class="skill-row">
            <span class="skill-label">${esc(s.label)}</span>
            <div class="skill-track"><div class="skill-fill" data-fill="${s.value}"></div></div>
          </div>`).join("")}
      </div>
    `;
  }

  function renderProject(p, idx, total) {
    return `
      <h2 class="page-title">Projects</h2>
      <div class="entry-count">Entry ${idx + 1} of ${total}</div>
      <h3 class="project-title">${esc(p.title)}</h3>
      <p class="project-subtitle">${esc(p.subtitle)}</p>
      ${para(p.description)}
      <div class="chip-row">${p.tech.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
      <div class="link-row">
        ${p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener">GitHub ↗</a>` : ""}
        ${p.demo ? `<a href="${esc(p.demo)}" target="_blank" rel="noopener">Live Demo ↗</a>` : ""}
      </div>
      <div class="margin-note">Lesson learned — ${esc(p.learned)}</div>
    `;
  }

  function renderTechnologies() {
    const groups = DATA.technologies;
    return `
      <h2 class="page-title">Technologies</h2>
      <div class="tech-groups">
        ${Object.entries(groups).map(([group, items]) => `
          <div class="tech-group">
            <h4>${esc(group)}</h4>
            <div class="chip-row">${items.map(i => `<span class="chip chip-tech">${esc(i)}</span>`).join("")}</div>
          </div>`).join("")}
      </div>
    `;
  }

  function renderExperience() {
    return `
      <h2 class="page-title">Experience</h2>
      <div class="exp-list">
        ${DATA.experience.map(e => `
          <div class="exp-item">
            <div class="exp-type">${esc(e.type)}</div>
            <div class="exp-title">${esc(e.title)}</div>
            <div class="exp-org">${esc(e.org)} &middot; <span class="exp-period">${esc(e.period)}</span></div>
            <div class="exp-detail">${esc(e.detail)}</div>
          </div>`).join("")}
      </div>
    `;
  }

  function renderCertificates() {
    return `
      <h2 class="page-title">Certificates</h2>
      <p class="chapter-intro">Click any document to open a larger preview.</p>
      <div class="cert-grid">
        ${DATA.certificates.map((c, i) => `
          <button class="cert-card" data-lightbox="cert" data-idx="${i}">
            <span class="cert-clip" aria-hidden="true"></span>
            <span class="cert-title">${esc(c.title)}</span>
            <span class="cert-meta">${esc(c.issuer)} &middot; ${esc(c.year)}</span>
          </button>`).join("")}
      </div>
    `;
  }

  function renderResearch() {
    const d = DATA.research;
    return `
      <h2 class="page-title">Research</h2>
      <h3 class="page-subtitle">Current Interests</h3>
      <ul class="quill-list">${d.interests.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
      <h3 class="page-subtitle">Future Work</h3>
      ${para(d.future)}
      <h3 class="page-subtitle">Experiments</h3>
      <ul class="quill-list dim">${d.experiments.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
    `;
  }

  function renderPhotography() {
    return `
      <h2 class="page-title">Photography</h2>
      <p class="chapter-intro">A few frames from outside the terminal.</p>
      <div class="photo-grid">
        ${DATA.photography.map((p, i) => `
          <button class="photo-frame" data-lightbox="photo" data-idx="${i}">
            <span class="photo-placeholder" aria-hidden="true">🖼</span>
            <span class="photo-caption">${esc(p.caption)}</span>
          </button>`).join("")}
      </div>
    `;
  }

  function renderContact() {
    const d = DATA.contact;
    return `
      <h2 class="page-title handwritten">Get in Touch</h2>
      ${para(d.note)}
      <div class="contact-list">
        <div class="contact-row"><span class="contact-label">Email</span><a href="mailto:${esc(d.email)}">${esc(d.email)}</a></div>
        <div class="contact-row"><span class="contact-label">GitHub</span><a href="${esc(d.github)}" target="_blank" rel="noopener">${esc(d.github.replace('https://',''))}</a></div>
        <div class="contact-row"><span class="contact-label">LinkedIn</span><a href="${esc(d.linkedin)}" target="_blank" rel="noopener">${esc(d.linkedin.replace('https://',''))}</a></div>
        <div class="contact-row"><span class="contact-label">Résumé</span><a href="${esc(d.resume)}" target="_blank" rel="noopener">Download PDF ↗</a></div>
      </div>
      <div class="qr-block">
        <div class="qr-placeholder" aria-hidden="true">▦</div>
        <span>Scan to save contact</span>
      </div>
    `;
  }

  function renderClosing() {
    const d = DATA.closing;
    return `
      <div class="closing-page">
        <div class="closing-ornament">&#10082;</div>
        <p class="closing-line">${esc(d.line)}</p>
        <p class="closing-sub">${esc(d.sub)}</p>
      </div>
    `;
  }

  function renderForeword() {
    return `
      <h2 class="page-title">Foreword</h2>
      <blockquote class="pull-quote">${esc(DATA.foreword.quote)}</blockquote>
      ${para(DATA.foreword.body)}
    `;
  }

  // The linear list of leaves. `chapter` groups pages for the TOC/progress UI.
  const PAGES = [
    { chapter: "Foreword",     title: "Foreword",      render: renderForeword },
    { chapter: "Who Am I",     title: "Who Am I",       render: renderWhoAmI1 },
    { chapter: "Who Am I",     title: "Vision & Goals",  render: renderWhoAmI2 },
    { chapter: "About Me",     title: "Education",       render: renderAbout1 },
    { chapter: "About Me",     title: "Journey & Skills", render: renderAbout2 },
    ...DATA.projects.map((p, i) => ({
      chapter: "Projects", title: p.title, render: () => renderProject(p, i, DATA.projects.length)
    })),
    { chapter: "Technologies", title: "Technologies",   render: renderTechnologies },
    { chapter: "Experience",   title: "Experience",     render: renderExperience },
    { chapter: "Certificates", title: "Certificates",   render: renderCertificates },
    { chapter: "Research",     title: "Research",       render: renderResearch },
    { chapter: "Photography",  title: "Photography",    render: renderPhotography },
    { chapter: "Contact",      title: "Get in Touch",   render: renderContact },
    { chapter: "The Future",   title: "The Future",     render: renderClosing }
  ];

  // Chapter start indices, derived automatically for the TOC.
  const CHAPTERS = [];
  PAGES.forEach((p, i) => {
    if (!CHAPTERS.length || CHAPTERS[CHAPTERS.length - 1].chapter !== p.chapter) {
      CHAPTERS.push({ chapter: p.chapter, index: i });
    }
  });

  // Decorative verso (left-hand page) content — pull quotes per chapter.
  const VERSO_QUOTES = {
    "Foreword": "Turn the page whenever you're ready.",
    "Who Am I": "Simple systems fail in simple ways.",
    "About Me": "The biggest lessons rarely arrive on schedule.",
    "Projects": "Every project taught me something the plan didn't.",
    "Technologies": "Tools change. Judgment about when to use them doesn't.",
    "Experience": "Most of this happened between deadlines, not because of them.",
    "Certificates": "Paper proof of stubborn curiosity.",
    "Research": "The interesting part is always the part that doesn't work yet.",
    "Photography": "A record of looking up from the screen.",
    "Contact": "Chapters are more fun with company.",
    "The Future": "To be continued."
  };

  function renderVerso(pageIndex) {
    if (pageIndex < 0) {
      return `
        <div class="verso-cover-inner">
          <div class="verso-portrait" aria-hidden="true">${esc(DATA.site.name.split(" ").map(w => w[0]).join(""))}</div>
          <p class="verso-name">${esc(DATA.site.name)}</p>
          <p class="verso-role">Engineer &amp; Researcher</p>
        </div>`;
    }
    const page = PAGES[pageIndex];
    const quote = VERSO_QUOTES[page.chapter] || "";
    return `
      <div class="verso-inner">
        <p class="verso-chapter">${esc(page.chapter)}</p>
        <div class="verso-rule"></div>
        <p class="verso-quote">&ldquo;${esc(quote)}&rdquo;</p>
        <p class="verso-pageno">${pageIndex + 1}</p>
      </div>`;
  }

  // ======================================================================
  // 2. STATE
  // ======================================================================

  const state = {
    currentIndex: -1,      // -1 = book closed
    bookOpen: false,
    animating: false,
    bookmarks: new Set(JSON.parse(localStorage.getItem("book_bookmarks") || "[]")),
    theme: localStorage.getItem("book_theme") || "light",
    soundOn: localStorage.getItem("book_sound") === "1",
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  // ======================================================================
  // 3. DOM REFS
  // ======================================================================

  const $ = (sel) => document.querySelector(sel);
  const els = {
    body: document.body,
    closedBook: $("#closed-book"),
    coverHit: $("#cover-hit"),
    openBook: $("#open-book"),
    pageLeft: $("#page-left"),
    pageRightStatic: $("#page-right-static"),
    pageFlip: $("#page-flip"),
    flipFront: $("#flip-front"),
    flipBack: $("#flip-back"),
    spread: $("#spread"),
    navPrev: $("#nav-prev"),
    navNext: $("#nav-next"),
    closeBookBtn: $("#btn-close-book"),
    chapterLabel: $("#chapter-label"),
    pageIndicator: $("#page-indicator"),
    progressFill: $("#progress-fill"),
    tocBtn: $("#btn-toc"),
    tocPanel: $("#toc-panel"),
    tocList: $("#toc-list"),
    searchBtn: $("#btn-search"),
    searchPanel: $("#search-panel"),
    searchInput: $("#search-input"),
    searchResults: $("#search-results"),
    scrim: $("#panel-scrim"),
    bookmarkBtn: $("#btn-bookmark"),
    bookmarkRibbon: $("#bookmark-ribbon"),
    themeBtn: $("#btn-theme"),
    soundBtn: $("#btn-sound"),
    fullscreenBtn: $("#btn-fullscreen"),
    printBtn: $("#btn-print-resume"),
    lightbox: $("#lightbox"),
    lightboxInner: $("#lightbox-inner"),
    lightboxClose: $("#lightbox-close"),
    announcer: $("#sr-announcer")
  };

  // ======================================================================
  // 4. RENDERING
  // ======================================================================

  function setStaticContent(el, html) {
    el.innerHTML = `<div class="page-content">${html}</div>`;
  }

  function announce(msg) { els.announcer.textContent = msg; }

  function updateChrome() {
    const page = state.currentIndex >= 0 ? PAGES[state.currentIndex] : null;
    els.chapterLabel.textContent = page ? page.chapter : "The Cover";
    els.pageIndicator.textContent = page
      ? `${page.chapter} — Page ${state.currentIndex + 1} of ${PAGES.length}`
      : "Cover";
    const pct = page ? Math.round(((state.currentIndex + 1) / PAGES.length) * 100) : 0;
    els.progressFill.style.width = pct + "%";
    const bookmarked = state.currentIndex >= 0 && state.bookmarks.has(state.currentIndex);
    els.bookmarkBtn.setAttribute("aria-pressed", String(bookmarked));
    els.bookmarkRibbon.hidden = !bookmarked;
    els.navPrev.disabled = state.currentIndex <= 0;
    els.navNext.disabled = state.currentIndex >= PAGES.length - 1;
    animateSkillBars();
  }

  function animateSkillBars() {
    document.querySelectorAll(".skill-fill").forEach(el => {
      const v = el.getAttribute("data-fill");
      requestAnimationFrame(() => { el.style.width = v + "%"; });
    });
  }

  function renderInitial(index) {
    state.currentIndex = index;
    setStaticContent(els.pageLeft, renderVerso(index - 1));
    setStaticContent(els.pageRightStatic, PAGES[index].render());
    els.pageFlip.style.transform = "rotateY(0deg)";
    els.pageFlip.classList.remove("flip-next-anim", "flip-prev-anim");
    updateChrome();
  }

  // ======================================================================
  // 5. PAGE FLIP ANIMATION
  // ======================================================================

  function playPageSound() {
    if (!state.soundOn) return;
    try {
      const ctx = playPageSound._ctx || (playPageSound._ctx = new (window.AudioContext || window.webkitAudioContext)());
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-4 * i / bufferSize);
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 800;
      const gain = ctx.createGain();
      gain.gain.value = 0.18;
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start();
    } catch (e) { /* audio unsupported — silently ignore */ }
  }

  function flipStep(direction) {
    if (state.animating) return;
    const newIndex = direction === "next" ? state.currentIndex + 1 : state.currentIndex - 1;
    if (newIndex < 0 || newIndex >= PAGES.length) return;

    state.animating = true;
    playPageSound();
    const duration = state.reducedMotion ? 60 : 720;
    els.pageFlip.style.setProperty("--flip-duration", duration + "ms");

    if (direction === "next") {
      setStaticContent(els.flipFront, PAGES[state.currentIndex].render());
      setStaticContent(els.flipBack, renderVerso(state.currentIndex));
      setStaticContent(els.pageLeft, renderVerso(state.currentIndex));
      setStaticContent(els.pageRightStatic, PAGES[newIndex].render());
      els.pageFlip.style.transition = "none";
      els.pageFlip.style.transform = "rotateY(0deg)";
      els.pageFlip.classList.add("is-flipping");
      // force reflow then animate
      void els.pageFlip.offsetWidth;
      els.pageFlip.style.transition = `transform var(--flip-duration) cubic-bezier(.4,.05,.2,1)`;
      els.pageFlip.style.transform = "rotateY(-180deg)";
    } else {
      setStaticContent(els.flipBack, renderVerso(newIndex));
      setStaticContent(els.flipFront, PAGES[newIndex].render());
      setStaticContent(els.pageLeft, renderVerso(newIndex - 1));
      els.pageFlip.style.transition = "none";
      els.pageFlip.style.transform = "rotateY(-180deg)";
      els.pageFlip.classList.add("is-flipping");
      void els.pageFlip.offsetWidth;
      els.pageFlip.style.transition = `transform var(--flip-duration) cubic-bezier(.4,.05,.2,1)`;
      els.pageFlip.style.transform = "rotateY(0deg)";
    }

    const onDone = () => {
      els.pageFlip.removeEventListener("transitionend", onDone);
      if (direction === "prev") {
        setStaticContent(els.pageRightStatic, PAGES[newIndex].render());
      }
      els.pageFlip.classList.remove("is-flipping");
      state.currentIndex = newIndex;
      state.animating = false;
      updateChrome();
      announce(`${PAGES[newIndex].chapter}, page ${newIndex + 1} of ${PAGES.length}`);
    };
    els.pageFlip.addEventListener("transitionend", onDone, { once: true });
    if (state.reducedMotion) setTimeout(onDone, duration + 20);
  }

  function jumpTo(newIndex) {
    if (newIndex === state.currentIndex || newIndex < 0 || newIndex >= PAGES.length) return;
    if (state.animating) return;
    // Non-adjacent jump: soft cross-fade instead of a physical flip.
    els.spread.classList.add("jump-fade");
    setTimeout(() => {
      renderInitial(newIndex);
      els.spread.classList.remove("jump-fade");
      announce(`${PAGES[newIndex].chapter}, page ${newIndex + 1} of ${PAGES.length}`);
    }, 180);
  }

  // ======================================================================
  // 6. OPEN / CLOSE BOOK
  // ======================================================================

  function openBook() {
    state.bookOpen = true;
    els.closedBook.hidden = true;
    els.openBook.hidden = false;
    els.openBook.classList.add("opening");
    renderInitial(0);
    setTimeout(() => els.openBook.classList.remove("opening"), 900);
  }

  function closeBook() {
    state.bookOpen = false;
    els.openBook.hidden = true;
    els.closedBook.hidden = false;
    state.currentIndex = -1;
    updateChrome();
    closeAllPanels();
  }

  // ======================================================================
  // 7. TABLE OF CONTENTS
  // ======================================================================

  function buildTOC() {
    els.tocList.innerHTML = CHAPTERS.map(c => `
      <li>
        <button class="toc-item" data-index="${c.index}">
          <span class="toc-chapter">${esc(c.chapter)}</span>
          <span class="toc-page">${c.index + 1}</span>
        </button>
      </li>`).join("");
  }

  els.tocList?.addEventListener("click", (e) => {
    const btn = e.target.closest(".toc-item");
    if (!btn) return;
    if (!state.bookOpen) openBook();
    jumpTo(parseInt(btn.dataset.index, 10));
    closePanel(els.tocPanel, els.tocBtn);
  });

  // ======================================================================
  // 8. SEARCH
  // ======================================================================

  const SEARCH_INDEX = PAGES.map((p, i) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = p.render();
    return { index: i, chapter: p.chapter, title: p.title, text: (tmp.textContent || "").toLowerCase() };
  });

  els.searchInput?.addEventListener("input", () => {
    const q = els.searchInput.value.trim().toLowerCase();
    if (!q) { els.searchResults.innerHTML = ""; return; }
    const hits = SEARCH_INDEX.filter(p => p.text.includes(q) || p.title.toLowerCase().includes(q)).slice(0, 12);
    els.searchResults.innerHTML = hits.length
      ? hits.map(h => `
          <li>
            <button class="search-result" data-index="${h.index}">
              <span class="sr-title">${esc(h.title)}</span>
              <span class="sr-chapter">${esc(h.chapter)} &middot; p.${h.index + 1}</span>
            </button>
          </li>`).join("")
      : `<li class="search-empty">No matches.</li>`;
  });

  els.searchResults?.addEventListener("click", (e) => {
    const btn = e.target.closest(".search-result");
    if (!btn) return;
    if (!state.bookOpen) openBook();
    jumpTo(parseInt(btn.dataset.index, 10));
    closePanel(els.searchPanel, els.searchBtn);
  });

  // ======================================================================
  // 9. PANELS (TOC / SEARCH)
  // ======================================================================

  function openPanel(panel, btn) {
    closeAllPanels();
    panel.hidden = false;
    els.scrim.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    if (panel === els.searchPanel) els.searchInput.focus();
  }
  function closePanel(panel, btn) {
    panel.hidden = true;
    if (btn) btn.setAttribute("aria-expanded", "false");
    if (els.tocPanel.hidden && els.searchPanel.hidden) els.scrim.hidden = true;
  }
  function closeAllPanels() {
    closePanel(els.tocPanel, els.tocBtn);
    closePanel(els.searchPanel, els.searchBtn);
  }

  els.tocBtn?.addEventListener("click", () => {
    buildTOC();
    els.tocPanel.hidden ? openPanel(els.tocPanel, els.tocBtn) : closePanel(els.tocPanel, els.tocBtn);
  });
  els.searchBtn?.addEventListener("click", () => {
    els.searchPanel.hidden ? openPanel(els.searchPanel, els.searchBtn) : closePanel(els.searchPanel, els.searchBtn);
  });
  document.querySelectorAll(".panel-close").forEach(btn => {
    btn.addEventListener("click", () => closePanel(document.getElementById(btn.dataset.close),
      btn.dataset.close === "toc-panel" ? els.tocBtn : els.searchBtn));
  });
  els.scrim?.addEventListener("click", closeAllPanels);

  // ======================================================================
  // 10. BOOKMARKS
  // ======================================================================

  els.bookmarkBtn?.addEventListener("click", () => {
    if (state.currentIndex < 0) return;
    if (state.bookmarks.has(state.currentIndex)) state.bookmarks.delete(state.currentIndex);
    else state.bookmarks.add(state.currentIndex);
    localStorage.setItem("book_bookmarks", JSON.stringify([...state.bookmarks]));
    updateChrome();
  });

  // ======================================================================
  // 11. THEME / SOUND / FULLSCREEN
  // ======================================================================

  function applyTheme() {
    els.body.classList.toggle("theme-dark", state.theme === "dark");
    els.themeBtn.setAttribute("aria-pressed", String(state.theme === "dark"));
  }
  els.themeBtn?.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("book_theme", state.theme);
    applyTheme();
  });

  function applySound() { els.soundBtn.setAttribute("aria-pressed", String(state.soundOn)); }
  els.soundBtn?.addEventListener("click", () => {
    state.soundOn = !state.soundOn;
    localStorage.setItem("book_sound", state.soundOn ? "1" : "0");
    applySound();
  });

  els.fullscreenBtn?.addEventListener("click", () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  });

  // ======================================================================
  // 12. LIGHTBOX (certificates / photography)
  // ======================================================================

  els.openBook?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lightbox]");
    if (!btn) return;
    const kind = btn.dataset.lightbox;
    const idx = parseInt(btn.dataset.idx, 10);
    const item = kind === "cert" ? DATA.certificates[idx] : DATA.photography[idx];
    els.lightboxInner.innerHTML = kind === "cert"
      ? `<div class="lightbox-cert">
           <div class="lightbox-cert-icon">🎓</div>
           <h3>${esc(item.title)}</h3>
           <p>${esc(item.issuer)} &middot; ${esc(item.year)}</p>
         </div>`
      : `<div class="lightbox-photo">
           <div class="lightbox-photo-placeholder">🖼</div>
           <p>${esc(item.caption)}</p>
         </div>`;
    els.lightbox.hidden = false;
  });
  els.lightboxClose?.addEventListener("click", () => els.lightbox.hidden = true);
  els.lightbox?.addEventListener("click", (e) => { if (e.target === els.lightbox) els.lightbox.hidden = true; });

  // ======================================================================
  // 13. PRINTABLE RÉSUMÉ
  // ======================================================================

  els.printBtn?.addEventListener("click", () => {
    const w = window.open("", "_blank");
    const d = DATA;
    w.document.write(`
      <html><head><title>${esc(d.site.name)} — Résumé</title>
      <style>
        body{font-family:Georgia,serif;max-width:720px;margin:40px auto;color:#222;line-height:1.5}
        h1{margin-bottom:0} h2{border-bottom:1px solid #999;padding-bottom:4px;margin-top:28px}
        .muted{color:#666}
        ul{margin:6px 0} li{margin-bottom:4px}
      </style></head><body>
      <h1>${esc(d.site.name)}</h1>
      <p class="muted">${esc(d.contact.email)} &middot; ${esc(d.contact.github)} &middot; ${esc(d.contact.linkedin)}</p>
      <h2>Summary</h2><p>${esc(d.whoAmI.intro)}</p>
      <h2>Education</h2>
      ${d.about.education.map(e => `<p><strong>${esc(e.title)}</strong> — ${esc(e.place)} (${esc(e.year)})<br><span class="muted">${esc(e.detail)}</span></p>`).join("")}
      <h2>Experience</h2>
      ${d.experience.map(e => `<p><strong>${esc(e.title)}</strong> — ${esc(e.org)} (${esc(e.period)})<br>${esc(e.detail)}</p>`).join("")}
      <h2>Projects</h2>
      ${d.projects.map(p => `<p><strong>${esc(p.title)}</strong> — ${esc(p.subtitle)}<br><span class="muted">${esc(p.tech.join(", "))}</span></p>`).join("")}
      <h2>Technologies</h2>
      ${Object.entries(d.technologies).map(([g, items]) => `<p><strong>${esc(g)}:</strong> ${esc(items.join(", "))}</p>`).join("")}
      </body></html>
    `);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  });

  // ======================================================================
  // 14. NAVIGATION WIRING
  // ======================================================================

  els.coverHit?.addEventListener("click", openBook);
  els.closeBookBtn?.addEventListener("click", closeBook);
  els.navNext?.addEventListener("click", () => flipStep("next"));
  els.navPrev?.addEventListener("click", () => flipStep("prev"));

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") {
      if (e.key === "Escape") { closeAllPanels(); e.target.blur(); }
      return;
    }
    switch (e.key) {
      case "ArrowRight": if (state.bookOpen) flipStep("next"); break;
      case "ArrowLeft": if (state.bookOpen) flipStep("prev"); break;
      case "Escape":
        if (!els.tocPanel.hidden || !els.searchPanel.hidden) closeAllPanels();
        else if (!els.lightbox.hidden) els.lightbox.hidden = true;
        else if (state.bookOpen) closeBook();
        break;
      case "t": case "T": els.tocBtn.click(); break;
      case "/": e.preventDefault(); els.searchBtn.click(); break;
      case "d": case "D": els.themeBtn.click(); break;
      case "f": case "F": els.fullscreenBtn.click(); break;
      case "b": case "B": if (state.bookOpen) els.bookmarkBtn.click(); break;
      case "Enter": case " ": if (!state.bookOpen && document.activeElement === els.coverHit) openBook(); break;
    }
  });

  // Touch swipe
  let touchStartX = null;
  els.spread?.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  els.spread?.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 60) flipStep(dx < 0 ? "next" : "prev");
    touchStartX = null;
  }, { passive: true });

  // Mouse wheel (throttled)
  let wheelLock = false;
  els.spread?.addEventListener("wheel", (e) => {
    if (wheelLock) return;
    if (Math.abs(e.deltaY) < 24) return;
    wheelLock = true;
    flipStep(e.deltaY > 0 ? "next" : "prev");
    setTimeout(() => wheelLock = false, 500);
  }, { passive: true });

  // ======================================================================
  // 15. INIT
  // ======================================================================

  applyTheme();
  applySound();
  buildTOC();
  updateChrome();

  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
    state.reducedMotion = e.matches;
  });

})();
