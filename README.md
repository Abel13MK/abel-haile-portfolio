# Abel Haile — Portfolio

A responsive, animated personal portfolio for **Abel Haile**, a web developer based in Addis Ababa, Ethiopia. Built from his résumé/CV and public GitHub profile as a dark, aurora-style experience with purple/blue gradients.

**No build step, no dependencies, no framework** — hand-written HTML, CSS and vanilla JavaScript. Clone it and open `index.html`.

---

## Features

### Sections

- **Home** — hero with an animated typed role, glowing portrait, floating `developer.js` code card and a technology rail
- **About** — bio, trait chips and an **interactive self-typing code editor** (replay button, re-types on scroll, blinking caret)
- **Skills** — 10 technology cards with brand icons
- **Projects** — featured cards with animated dashboard mockups and a live GitHub repository count
- **Experience** — timeline of work, education and self-learning
- **Contact** — email / phone / location cards and a validated contact form that opens the visitor's mail client

### Interactions

- Scroll-reveal animations, 3D card tilt and magnetic buttons
- Active-section scrollspy navigation with an animated mobile menu
- Ambient particle background rendered on `<canvas>` plus a gradient wave divider
- Quick-navigation command palette (`Ctrl` / `⌘` + `K`, `Esc` to close)
- Back-to-top button and toast feedback on the contact form

### Accessibility

- **`prefers-reduced-motion` is fully respected** — all animation, typing and parallax is disabled and content renders immediately
- Keyboard-navigable command palette and visible `:focus-visible` rings
- Decorative icons are marked `aria-hidden`; the animated code editor is exposed as a labelled `role="group"` with its moving code hidden from screen readers
- Graceful degradation: a `<noscript>` fallback reveals all scroll-reveal content if JavaScript is unavailable

## Tech stack

| Layer | Choice |
| --- | --- |
| Markup | HTML5 — semantic sections, inline SVG icon sprite |
| Styling | CSS3 — custom properties, grid, flexbox, `backdrop-filter`, keyframes |
| Behaviour | Vanilla JavaScript (ES6, one IIFE, no libraries) |
| Typography | Poppins, DM Sans, Caveat, JetBrains Mono via Google Fonts |
| Live data | GitHub REST API (unauthenticated; the badge hides itself if the request fails) |

## Project structure

```
abel-haile-portfolio/
├── index.html          # the entire site: markup, SVG sprite, all sections
├── styles.css          # design tokens in :root + every component style
├── script.js           # scrollspy, reveal, tilt, typing engine, palette, particles
├── README.md
├── .gitignore
├── .gitattributes      # normalises line endings to LF
├── .nojekyll           # tells GitHub Pages to serve files as-is
└── assets/
    ├── Abel-Haile-CV.pdf
    ├── favicon.svg
    ├── helpdesk-requester-portal.jpg
    ├── it-support-desk.jpg
    └── profile.jpg
```

## Run locally

No install required. Opening `index.html` directly works, but the live GitHub repo count needs a real origin, so a local server is recommended:

```bash
python -m http.server 8080
```

Then open <http://localhost:8080>. Any static server works — VS Code's **Live Server** extension is fine too.

## Deploy to GitHub Pages

The site is already Pages-ready: every asset path is **relative**, so it works from a project subpath with no configuration.

From the terminal:

```bash
gh repo create abel-haile-portfolio --public --source=. --remote=origin --push

gh api --method POST -H "Accept: application/vnd.github+json" \
  /repos/Abel13MK/abel-haile-portfolio/pages \
  -f "source[branch]=main" -f "source[path]=/"
```

Or via the web UI: **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.

Either way it publishes to **<https://abel13mk.github.io/abel-haile-portfolio/>**.

The folder also deploys as-is to Netlify, Vercel, Cloudflare Pages or any static host.

## Customization

| What | Where |
| --- | --- |
| Name, role, bio, section copy | `index.html` |
| Downloadable CV | Replace `assets/Abel-Haile-CV.pdf` (keep the filename) |
| Social links | `index.html` — search for `github.com`, `linkedin.com`, `x.com` |
| Colours, radii, shadows, fonts | `styles.css` — the `:root` custom properties at the top |
| Typing speed of the About editor | `script.js` — the `setTimeout(step, 26)` / `230` delays |
| Hero roles in the typewriter | `script.js` — the `roles` array |

## Repository notes

- **`.gitignore` deliberately excludes** the previous design (`_old-design-backup/`) and four unused binaries (`profile.png`, `Abel-Haile-Resume.pdf` and two large UUID-named PNGs) — roughly **4.5 MB**. They stay on your disk and are simply never committed. To publish one later, delete its line from `.gitignore` and run `git add -f <file>`.
- Line endings are normalised to **LF** via `.gitattributes`, so the history stays clean across Windows, macOS and Linux.
- The old design lives in `_old-design-backup/` (local only) as a reference.

## Credits

- **Fonts** — [Google Fonts](https://fonts.google.com) (Poppins, DM Sans, Caveat, JetBrains Mono)
- **Icons** — hand-authored inline SVG sprite in `index.html`; no icon library
- **Repo count** — [GitHub REST API](https://docs.github.com/rest)

## License

The **code** is free to read and learn from — please don't republish it as your own work.

The **personal content** — the CV, the photograph, the name and all résumé data — is **all rights reserved**.
