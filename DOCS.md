# Architecture Notes

## Mental model

The book is a flat array of **pages** (`PAGES` in `js/book.js`), built once
at load time from `DATA` (`js/data.js`). Each entry is:

```js
{ chapter: "Projects", title: "Wayfarer", render: () => "<h2>...</h2>..." }
```

`render()` returns an HTML string. Nothing is templated with a framework —
it's just string building with an `esc()` helper for safety, matching the
"handcrafted vanilla JS" constraint from the brief.

`CHAPTERS` (used for the Table of Contents) is derived automatically by
scanning `PAGES` for where the `chapter` value changes — you never maintain
it by hand.

## The page-flip mechanic

This is the part most worth understanding before touching it.

At any moment the book shows a **spread**: a left page and a right page,
split by a `.spine` divider. There are three DOM layers involved:

```
#page-left            — static, always shows a decorative "verso" page
#page-right-static     — static, shows the CURRENT right-hand content
#page-flip             — animated sheet with a FRONT and BACK face
```

`#page-flip` is positioned exactly over the right slot, with
`transform-origin: left center` — i.e. it pivots around the spine, like a
real page. It has two faces (`#flip-front` / `#flip-back`), each
`backface-visibility: hidden`, with the back face pre-rotated 180° in CSS so
it reads correctly once the whole sheet reaches 180°.

**Going to the next page:**
1. `flip-front` is filled with the *current* right-hand content (what's
   about to be "turned").
2. `flip-back` and the underlying `#page-left` are both filled with a
   decorative verso design for that same page (this is what the reader will
   see on the left once the sheet settles there).
3. `#page-right-static` is updated *immediately* to the *next* page's
   content — this is safe because `#page-flip` fully covers it until the
   rotation swings away.
4. `#page-flip` animates `rotateY(0deg) → rotateY(-180deg)`. Because it
   pivots on the spine (the shared edge between the left and right slots),
   rotating it the full 180° visually sweeps it from "lying flat on the
   right, facing the reader" to "lying flat on the left, facing the reader"
   — exactly like a real turning page. `page-right-static` is revealed
   underneath as the sheet lifts away from the right position.
5. On `transitionend`, `#page-flip` is reset and hidden (`visibility:
   hidden` when not `.is-flipping`), `currentIndex` advances, and the
   now-static layers already show the correct settled state — no flash.

**Going to the previous page** is the mirror image: the sheet starts at
-180° (matching what's currently on the left) and animates back to 0°,
revealing a new decorative left page underneath as it lifts, and landing
back on the right showing the target page's real content.

**Non-adjacent jumps** (clicking a Table of Contents entry or a search
result) skip the physical flip — physically flipping through N pages would
be slow and visually noisy — and instead use a quick cross-fade
(`.spread.jump-fade`), then a full `renderInitial()` re-render.

## Why the left page isn't independently "real" content

Real books show independent content on both sides of every sheet. Modeling
that fully (every page having a distinct recto and verso with its own
content) roughly doubles the content-authoring burden for a portfolio where
the left page's job is mostly atmospheric. Instead, the left page always
shows a **decorative verso**: the chapter name, a short pull-quote (see
`VERSO_QUOTES`), and the page number. This keeps the physical illusion
intact while keeping content authoring to "one real page per idea," which is
what `data.js` expects.

If you want fully independent left/right content later, the place to change
is `renderVerso()` — instead of a decorative design, have it call a `render`
function the same way right pages do, and restructure `PAGES` as spreads
`{ left, right }` instead of a flat list. This is a bigger change and isn't
necessary for the current brief.

## State & persistence

- **Bookmarks** — a `Set` of page indices, persisted to
  `localStorage['book_bookmarks']`.
- **Theme** (light/dark reading mode) — persisted to
  `localStorage['book_theme']`.
- **Ambient page sound** — persisted to `localStorage['book_sound']`; the
  sound itself is a tiny synthesized noise burst via the Web Audio API
  (no audio file dependency).
- Nothing else persists — the book always opens back on the cover on a
  fresh visit. If you want "resume where I left off," store `currentIndex`
  the same way bookmarks are stored and read it in `openBook()`.

## Accessibility notes

- `#sr-announcer` is an `aria-live="polite"` region updated on every page
  change, so screen reader users hear the new chapter/page without needing
  to re-navigate into the content.
- All icon-only buttons have `title` and/or `aria-label`.
- `prefers-reduced-motion: reduce` cuts the flip duration to ~60ms and
  disables the decorative CSS animations (dust drift, cover hover, skill-bar
  fill transition) via the media query at the bottom of `style.css`.
- Keyboard map: `←/→` page turn, `T` table of contents, `/` search, `D` dark
  mode, `F` fullscreen, `B` bookmark, `Esc` close panel/lightbox/book.

## Responsive behavior

Below `860px` width, the book drops the two-page spread and shows a single
page at a time (the left decorative page is hidden, the right page/flip
layers take the full width). This keeps the flip animation working
identically — it just always operates on a full-width single page instead of
half a spread.

## Extending: adding a whole new chapter

See the equivalent section in `AGENT_INSTRUCTIONS.md` — same steps, whether
a human or an agent is doing it.
