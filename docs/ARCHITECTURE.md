# BlackPaw's Forge — Architecture & Design

## Overview

BlackPaw's Forge is a static portfolio site for an offensive security operator and toolsmith. Built with Astro 6, deployed via GitHub Pages. Terminal/boot-sequence aesthetic with blood-red-on-black CRT cyberpunk design language.

**URL:** https://blackpaw21.github.io/TheForge/  
**Repo:** https://github.com/BlackPaw21/TheForge  
**Stack:** Astro 6, TypeScript, CSS, GitHub Pages (static export)

---

## Project Structure

```
src/
├── components/
│   ├── Hero.astro          # Terminal boot sequence + hero content
│   ├── Nav.astro            # Fixed-top terminal prompt nav
│   ├── About.astro          # Bio, animated stat counters
│   ├── Arsenal.astro        # Project card grid from JSON
│   ├── DemoTerminal.astro   # Interactive HellCat terminal demo
│   ├── Experience.astro     # Timeline component
│   ├── Skills.astro         # Skill category grid from JSON
│   ├── Contact.astro        # Terminal-style contact links
│   └── originkit/
│       ├── chromatic-waves.tsx # WebGL background (React + ogl, Originkit)
│       └── encrypt-button.tsx  # Scramble/sweep CTA button (React + framer-motion, Originkit)
├── layouts/
│   └── Base.astro           # HTML shell, waves background, CRT overlays, cursor
├── pages/
│   └── index.astro          # Page composition
├── styles/
│   └── global.css           # Variables, reset, animations, buttons
└── data/
    ├── projects.json        # Arsenal project data
    ├── skills.json          # Skill categories
    └── experience.json      # Timeline entries
```

---

## Design System

### Colors

| Token | Value | Usage |
|---|---|---|
| `--void` | `#0d0d0d` | Page background (matches waves bg) |
| `--surface` | `#111111` | Card/window backgrounds |
| `--elevated` | `#151515` | Hover state surfaces |
| `--blood` | `#ff2020` | Primary accent, text highlights |
| `--blood-dark` | `#cc1a1a` | Button fills, scrollbars |
| `--text` | `#e0e0e0` | Body text |
| `--text-bright` | `#ffffff` | Headings |
| `--muted` | `#888888` | Secondary text, labels |
| `--border` | `#1a1a1a` | Card borders, dividers |

### Typography

- **Display:** Bebas Neue (headings, large text)
- **Mono:** JetBrains Mono (body, terminal elements, buttons)

### Effects

- **CRT Scanlines:** Fixed overlay, repeating linear gradient, 4s breathing pulse
- **Grain Noise:** 256x256 random noise canvas, tiled, 2.5% opacity
- **Vignette:** Radial gradient from transparent center to black edges
- **Chromatic Waves Background:** WebGL (React + ogl) perlin-noise wave field rendered as a dot-matrix palette; full-page layer spanning the document height (body is the positioning context), re-sized via ResizeObserver and scrolls with the page (Originkit component; themed props: `bgColor` `#0d0d0d`, palette `['#6B0000']`, `frequency` 10, `gamma` 10, `paletteBias` -4, `cellSize` 10 — sparse 1–2px dots with the wave reading as dot-density clusters; the noise render target is clamped to 4096px per side — the WebGL1 spec-minimum — so the full-page canvas stays within GPU texture/renderbuffer limits, including retina-scale canvases)
- **Encrypt Button CTA:** React + framer-motion scramble-on-hover button used for the hero "VIEW ARSENAL →" action (Originkit component; themed props: fill `#cc1a1a`, hover fill transparent, text `#0d0d0d` → `#ff2020` on hover, 4px `#C80000` border, rounded 25, JetBrains Mono 700 24px, sweep disabled; colors revert instantly on mouse-leave — `transition: { duration: 0 }` on the hover state so no animation must finish before the color returns)
- **Custom Cursor:** 24px circle, shrinks to 6px filled dot on hover over interactive elements, smooth lerp follow
- **Glitch Text:** CSS keyframe animation with clip-path slices and hue-shift color channels

---

## Components

### Hero (`Hero.astro`)

Two-phase load sequence:

1. **Boot Phase:** macOS-style terminal window with traffic light dots and "forge-boot" titlebar. 8 lines of kernel boot messages typed character-by-character (72 chars/sec). Lines: OK status, kernel version, security modules, encrypted channel, environment start, divider, welcome banner.

2. **Content Phase:** After 850ms pause, boot window fades out. Hero content fades in with staggered reveals: "SYS://FORGE.LOCAL" tag, "BLACKPAW'S" (15vw Bebas Neue, white, single-entry glitch animation), "FORGE" (blood red with subtle glow, periodic glitch loop every 8-12s), tagline, and a VIEW ARSENAL CTA.

### Nav (`Nav.astro`)

Fixed-top bar with terminal prompt logo (`root@forge:~$ BLACKPAW.▊` with blinking cursor). Links: Arsenal, About, Timeline, Contact. Active section highlighting via IntersectionObserver. Mobile hamburger toggle at 768px breakpoint.

### About (`About.astro`)

Short bio positioning the operator as self-taught, production-depth solo creator across Windows internals, RF sensing, web tools, and autonomous infra. Two stat counters (12 Projects, 8 Tools Shipped) animating from 0 on scroll into view.

### Arsenal (`Arsenal.astro`)

7 project cards in a responsive grid (auto-fill, 340px min). Each card shows:

- **Index:** Zero-padded bracket number `[01]-[07]`
- **Name:** Display font project title
- **Tagline:** Italic one-liner value proposition
- **Description:** Technical detail
- **Tags:** Category labels in monospace
- **Footer:** Terminal command link `cd forge/arsenal && cat project-name.md →`

Cards use flexbox with `margin-top: auto` on footer for uniform bottom alignment. Hover: red glow, slight lift (-2px), red left accent bar, blood-colored index.

### DemoTerminal (`DemoTerminal.astro`)

Scroll-triggered live terminal demonstration. Shows a HellCat password cracking session:

1. Types `hellcat --hash-mode md5 --target acme-corps-hashes.txt` character by character
2. Displays a styled ASCII box with session parameters (mode, hashes loaded, GPU)
3. Shows real-time cracking stats (42.5 GH/s, 67.61% progress)
4. Outputs recovery results (138/142 passwords found, written to cracked_acme.txt)
5. Demonstrates `cat cracked_acme.txt | head -3` with recovered credentials

Uses ANSI escape code to HTML conversion for colored terminal output.

### Experience (`Experience.astro`)

Alternating left/right timeline with blood-red dots and hover glow. 6 entries spanning 2025-2026 covering Windows modding, RF sensing, web products, game dev, RL robotics, and security research infrastructure.

### Skills (`Skills.astro`)

9 skill categories in a responsive grid: Languages, Platforms, Offensive Security, Windows Internals, Web Full-Stack, RF & Embedded, Design, Game Dev, Infrastructure. Each category shows domain-specific tags.

### Contact (`Contact.astro`)

Terminal-prompt styled contact links with `$` prefix, uppercase label, handle, and arrow. Entries: GitHub (@BlackPaw21), Email (with COPY button using clipboard API), Ko-fi (donate). Hover reveals red left accent bar and arrow slide.

### Base (`Base.astro`)

Layout shell providing:

- Chromatic Waves WebGL background (Originkit `chromatic-waves`, React + ogl, 30fps, dpr capped at 2, render target clamped to 4096px)
- CRT effects (scanlines with breathing animation, grain noise, vignette)
- Custom cursor with smooth lerp and hover detection
- Global scroll reveal via IntersectionObserver on `.reveal` elements
- Footer with copyright and back-to-top button

---

## Animations

| Animation | Duration | Trigger | Description |
|---|---|---|---|
| Boot typewriter | 72 chars/sec | Page load | Characters typed per second during boot |
| Boot line delay | 150ms | Between lines | Pause between kernel messages |
| Boot glow wait | 850ms | After boot | Final pause before content reveal |
| Hero entry | 800ms | Boot complete | Fade + slide up content |
| FORGE glitch | 600ms | Every 8-12s | Clip-path slice + hue shift on FORGE text |
| Scanline pulse | 4s | Continuous | Opacity oscillation on scanlines |
| Scroll reveal | 500ms | On scroll | Fade + slide up with cubic-bezier ease |
| Card hover | 300ms | Mouse enter | Border glow, lift, accent bar |
| Cursor follow | 16ms | Continuous | Lerp position at 0.3 factor |
| Stat counter | 1200ms | Scroll into view | Number count-up animation |
| Demo terminal | Varies | Scroll into view | Character-by-character typing |
| Nav cursor blink | 1s | Continuous | Step-end opacity toggle |

---

## Data Flow

All content data is stored in `src/data/*.json` files:
- `projects.json` — 7 projects with name, description, tagline, tags, repo_url
- `skills.json` — 9 skill categories with items array
- `experience.json` — 6 timeline entries with year, role, org, description

Astro components import these JSON files at build time and render them into static HTML. Zero runtime data fetching.

---

## Deployment

Build: `npx astro build` → outputs to `dist/`  
Base path: `/TheForge/` (GitHub Pages subpath)  
Deployment: Push to `main` branch, GitHub Actions or manual Pages deploy

---

## Responsive Breakpoints

| Breakpoint | Container Padding | Section Padding | Hero Inner Padding |
|---|---|---|---|
| > 600px | 24px | 100px vertical | 60px 24px |
| 401-600px | 32px | 60px vertical | 40px 32px |
| ≤ 400px | 24px | 48px vertical | 32px 24px |

### Mobile Hero Text Sizes

| Element | 401-600px | ≤ 400px |
|---|---|---|
| Tag (SYS://FORGE.LOCAL) | 24px | 22px |
| Name (BLACKPAW'S) | clamp(86px, 26vw, 144px) | 62px |
| Role (FORGE) | clamp(53px, 14vw, 77px) | 43px |
| Tagline | 14px | 12px |

Mobile keeps the same left-aligned, side-by-side layout as desktop — only padding and font-sizes scale.

## Development

```bash
npx astro dev --host    # Local dev server
npx astro build         # Static export to dist/
npx astro preview       # Preview built output
```
