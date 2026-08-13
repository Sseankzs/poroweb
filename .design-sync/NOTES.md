# design-sync notes — poroweb

## Repo shape

- This is a **Next.js app, not a component library**: no Storybook, no `dist/`,
  no library entry, `package.json` still named `my-v0-project`. The converter
  runs in **synth-entry mode** off `components/` (`cfg.srcDir`).
- `node_modules/my-v0-project` is a **junction back to the repo root**, created
  by hand so the converter can resolve `PKG_DIR` (npm won't self-install a repo
  into itself). It is not in the lockfile — **recreate it on a fresh clone**:
  `New-Item -ItemType Junction -Path node_modules\my-v0-project -Target .`
  (POSIX: `ln -s ../. node_modules/my-v0-project`). Without it the build dies
  with `ENOENT … node_modules/my-v0-project/package.json`.

## CSS and fonts

- **`cssEntry` points at build output, not source.** `app/globals.css` is
  Tailwind v4 source (`@import 'tailwindcss'`) and is useless to the converter.
  The real stylesheet is the compiled chunk Next emits.
- Regenerate before every sync (the filename is content-hashed, so it changes):
  ```sh
  npm run build
  mkdir -p .design-sync/.cache/css .design-sync/.cache/media
  cp .next/static/chunks/*.css .design-sync/.cache/css/compiled.css   # pick the ~28KB one
  cp .next/static/media/*.woff2 .design-sync/.cache/media/
  ```
- The `media/` copy is required: the compiled CSS references `url(../media/*.woff2)`,
  so the fonts only resolve when `compiled.css` sits in a sibling `css/` dir.
  Skipping it produces `[FONT_DANGLING]` and every design renders in a fallback font.

## Previews

- **The DS is dark-only and the cards force `body{background:#fff}`.** Any
  component without its own opaque background must supply the canvas in its
  preview, or it renders near-white on white. Affects `Button` (ghost/link
  variants vanish), `Header`, and `FeaturesSection` (the only section with no
  background class — it inherits the page canvas by design).
  Fix used: wrap in `<div style={{background:'var(--background)', color:'var(--foreground)'}}>`.
- `Header` is `position: fixed`; its preview wrapper needs `transform: translateZ(0)`
  to create a containing block, else it escapes the card.
- The five page sections take no props and are full-bleed → `cardMode: "single"`
  with explicit viewports. `Button` uses `cardMode: "column"`.

## Weak type contracts

- Synth-entry mode produces `[key: string]: unknown` for every component, which
  is useless to the design agent. All six have hand-written `cfg.dtsPropsFor`
  bodies. **If a component's real props change, update `dtsPropsFor` by hand** —
  nothing derives it.

## Known render warns

- None outstanding. Last run: 6/6 render clean, 0 bad, 0 thin.

## Re-sync risks

- **The compiled-CSS copy goes stale silently.** It lives in gitignored
  `.cache/`, so a fresh clone has no CSS at all and a stale copy ships the old
  palette while everything still exits 0. Always re-run the regenerate block above.
- **The junction is gitignored** and must be recreated per clone (see above).
- **`dtsPropsFor` is hand-maintained** and will drift from the source as
  components gain props — nothing checks it.
- **Fonts are Next-hashed filenames** (`4fa387ec…woff2`). They change whenever
  Next or the font config changes; stale copies in `.cache/media/` would leave
  dangling `url()`s.
- Previews import from `"my-v0-project"` — renaming the package in
  `package.json` breaks all six preview files and the junction name.
- Playwright is installed in `.ds-sync/` **without browsers**; the render check
  runs against system Chrome via `DS_CHROMIUM_PATH`. On another machine either
  set that variable or run `npx playwright install chromium`.
