# 📖 Interactive Book Portfolio

A personal portfolio built to feel like an interactive hardcover book, not a
website. Vanilla HTML/CSS/JS — no frameworks, no build step.

**Everything you see right now is fake placeholder content** (name: "Aarav
Mehta", fictional projects, fictional employers). It exists so the whole
experience — layout, animation, spacing — is already correct and demonstrable.
Swap it for your real information by editing exactly one file: `js/data.js`.

👉 **If you're using an AI coding agent to finish this project, give it
`AGENT_INSTRUCTIONS.md` first.** It's written specifically for that workflow.

---

## Quick start

No build tools needed. Any static file server works:

```bash
# Option A — Python
python3 -m http.server 8000

# Option B — Node
npx serve .

# Option C — VS Code
# Right-click index.html → "Open with Live Server"
```

Then open `http://localhost:8000`. Opening `index.html` directly by
double-clicking it will mostly work, but some browsers restrict local
`fetch`/module behavior over `file://`, so a local server is recommended.

---

## Project structure

```
index.html              The whole page skeleton (cover, book, panels, lightbox)
css/style.css            All visual design: cover, page-flip 3D, panels, themes, responsive, print
js/data.js               ALL CONTENT — name, bio, projects, skills, experience, etc. Edit this.
js/book.js                The book "engine" — pagination, flip animation, nav, search, bookmarks.
                           You generally should NOT need to edit this to update content.
assets/
  images/                 Photography chapter placeholders — replace with real photos
  certificates/           Certificate chapter placeholders — replace with real certificate images
  resume.pdf              NOT included — add your real résumé PDF here (see below)
AGENT_INSTRUCTIONS.md     Step-by-step brief for an AI coding agent finishing this with your real data
DOCS.md                   Architecture notes, how the page-flip works, how to extend chapters
```

## How content is organized

Every chapter in `js/data.js` is a plain JS object or array — no HTML in
there, just data:

```js
whoAmI: {
  intro: "...",
  bio: "...",
  vision: "...",
  goals: ["...", "..."],
  philosophy: "..."
}
```

`js/book.js` turns that data into actual book pages. You almost never need to
touch `book.js` unless you're adding a brand-new chapter type (see DOCS.md).

## Replacing placeholder assets

1. Put real certificate images in `assets/certificates/` and update the
   `image` paths (and titles/issuers/years) in `DATA.certificates`.
2. Put real photos in `assets/images/` and update `DATA.photography`.
3. Add your real résumé at `assets/resume.pdf` and make sure
   `DATA.contact.resume` points to it. (There's also a "Printable Résumé"
   button that auto-generates a print-ready résumé straight from your data —
   no PDF file required if you'd rather rely on that.)
4. Update `DATA.site.name` and the cover title in `index.html`'s `<title>`
   and `<meta name="description">` tags.

## Browser support & performance

- Uses CSS 3D transforms (`perspective`, `preserve-3d`, `backface-visibility`)
  — supported in all evergreen browsers.
- Respects `prefers-reduced-motion` (flip becomes near-instant, all CSS
  animations disabled).
- No external JS dependencies. Google Fonts is the only external network
  request; everything still works offline if you self-host or remove that
  `<link>`.

## Known placeholders to swap before shipping

- [ ] `js/data.js` — every field, see comments inside the file
- [ ] `assets/certificates/*` and `assets/images/*`
- [ ] `assets/resume.pdf`
- [ ] Favicon (currently none set)
- [ ] `<title>` / `<meta name="description">` in `index.html`
- [ ] Social links (GitHub/LinkedIn) in `DATA.contact`
