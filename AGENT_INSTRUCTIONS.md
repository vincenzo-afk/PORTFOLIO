# Instructions for the AI Agent

You are finishing an interactive, book-themed portfolio website. The
structure, animation engine, and visual design are already built and
working. **Your job is almost entirely content — not rebuilding the app.**

Read this whole file before changing anything.

## 1. What already exists (do not rebuild this)

- `index.html` — page skeleton: closed book cover, open-book reading view,
  Table of Contents panel, search panel, lightbox, top toolbar.
- `css/style.css` — full visual design: leather cover, cream paper, gold
  accents, the 3D page-flip mechanic, dark mode, responsive breakpoints,
  print styles, reduced-motion support.
- `js/book.js` — the "engine": turns the data in `js/data.js` into pages,
  handles the physical page-flip animation, keyboard/swipe/wheel navigation,
  table of contents, search index, bookmarks (localStorage), dark mode,
  sound toggle, fullscreen, and the printable résumé generator.
- `js/data.js` — **the only file with real-world content in it**, currently
  filled with placeholder/fake data.

This is a from-scratch vanilla HTML/CSS/JS build — no React, no build step,
no npm install required. Keep it that way unless the user explicitly asks
you to change the tech stack.

## 2. Your primary task: replace fake data with real data

Open `js/data.js`. It is one big `DATA` object, organized by chapter, with a
comment above every field explaining what it is. Ask the user for their real
information (or use what they've provided) and replace every field:

- `site` — name, subtitle, tagline
- `foreword` — a short opening quote + paragraph
- `whoAmI` — intro, bio, vision, goals (array), philosophy
- `about` — education (array of {year, title, place, detail}), journey,
  growth, skillsSnapshot (array of {label, value 0-100} for the skill bars)
- `projects` — array of {title, subtitle, description, tech (array), github,
  demo, learned}. **The book automatically creates one page per project** —
  add or remove array items freely, no other code changes needed.
- `technologies` — an object where each key is a category name and the value
  is an array of strings. Add/remove categories freely.
- `experience` — array of {type, title, org, period, detail}
- `certificates` — array of {title, issuer, year, image}. Put real files in
  `assets/certificates/` and point `image` at them.
- `research` — interests (array), future (paragraph), experiments (array)
- `photography` — array of {caption, image}. Optional chapter — see below to
  remove it entirely if the user doesn't want it.
- `contact` — email, github, linkedin, resume (path to a real PDF), note
- `closing` — the final "story is still being written" line, keep or edit

**Do not touch `js/book.js` for ordinary content changes.** Adding a project,
a certificate, a tech category, or an experience entry only requires editing
the arrays/objects in `data.js` — the page count, table of contents, and
search index update automatically.

## 3. When you DO need to touch book.js or style.css

Only for structural changes, e.g.:

- **Adding a whole new chapter type** (not just a new item in an existing
  array) — e.g. a "Publications" chapter. Steps:
  1. Add the data to `DATA` in `data.js`.
  2. Write a `renderX()` function in `book.js` near the other `render*`
     functions, following the existing pattern (return an HTML string built
     from `DATA`, using the `esc()` helper for any user-supplied text to
     avoid HTML injection).
  3. Add `{ chapter: "Your Chapter", title: "...", render: renderX }` to the
     `PAGES` array in the right position.
  4. Optionally add a line to `VERSO_QUOTES` for that chapter's left-page
     pull-quote.
  5. Add matching CSS classes to `style.css` if the new chapter needs layout
     beyond what's already defined (timeline, chip-row, grid, etc. are all
     reusable — check the existing classes before adding new ones).

- **Removing the Photography chapter** (marked optional in the brief): delete
  its entry from the `PAGES` array in `book.js` (search for
  `renderPhotography`) and remove the `photography` block from `data.js`.

- **Changing the color palette / fonts**: everything is driven by CSS custom
  properties at the top of `style.css` under `:root`. Change values there,
  not throughout the file.

## 4. Things to verify before calling it done

- [ ] No placeholder text like "Aarav Mehta", "Northstar Systems", or
      `example.com` links remain anywhere in `data.js`.
- [ ] Real images exist at every path referenced in `certificates` and
      `photography`, or those chapters are removed/adjusted.
- [ ] `contact.resume` points to a real PDF that exists in `assets/`, OR you
      confirm with the user that they're relying on the "Printable Résumé"
      button instead (which needs no PDF file).
- [ ] `index.html`'s `<title>` and `<meta name="description">` reflect the
      real name/subtitle, not the placeholder ones.
- [ ] Test keyboard nav (arrow keys), swipe on a touch device or emulator,
      the TOC panel, search, dark mode toggle, and bookmark toggle after
      your changes — these all read live from `PAGES`, so a broken data
      field can produce a blank page rather than a loud error. Check the
      browser console for errors from `renderX()` functions if a page looks
      empty.
- [ ] Run it through a static server (`python3 -m http.server` or similar)
      rather than opening the file directly, to avoid `file://` quirks.

## 5. Design constraints to respect

The brief this was built from asked specifically for:
- No frameworks (React/Vue/Angular) — keep it vanilla JS.
- A warm, library/leather/gold palette — don't drift into templated
  cream-and-terracotta or dark-mode-with-neon-accent defaults if you're
  asked to "improve the design."
- Realistic, physics-feeling page turns — not a slide/fade carousel.
- Full keyboard, screen reader, and reduced-motion support — don't remove
  the `aria-*` attributes, the `sr-announcer` live region, or the
  `prefers-reduced-motion` handling while making other changes.

See `DOCS.md` for a deeper explanation of how the page-flip animation and
pagination system work internally, if you need to modify them.
