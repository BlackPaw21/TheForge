# BlackPaw's Forge

Offensive security research, tools, and tooling — portfolio site with a terminal/boot-sequence aesthetic: blood-red-on-black CRT cyberpunk.

**Live:** https://blackpaw21.github.io/TheForge/

## Stack

- [Astro 6](https://astro.build) — static export
- TypeScript (strict)
- Vanilla CSS (design tokens, no framework)
- GitHub Pages via GitHub Actions

## Development

```sh
npm install        # install dependencies
npm run dev        # dev server at localhost:4321
npm run build      # static export to dist/
npm run preview    # preview the production build
```

## Structure

```
src/
├── components/    # Hero, Nav, About, Arsenal, DemoTerminal, Experience, Skills, Contact
├── layouts/       # Base.astro — HTML shell, CRT effects, custom cursor
├── pages/         # index.astro — single landing page
├── styles/        # global.css — design tokens, animations, buttons
└── data/          # projects.json, skills.json, experience.json
```

All content lives in `src/data/*.json` — edit those to change projects, skills, or the timeline.

## Deployment

Push to `main` → `.github/workflows/deploy.yml` builds with Node 22 and deploys to GitHub Pages (base path `/TheForge/`).

## Design

Full design system (tokens, effects, breakpoints, animation table) is documented in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
