# Poro Bot UI — conventions

A small, **dark-only** design system from the Poro Bot marketing site. Brand
colours are pumpkin `--brand-pumpkin` (#fe7f2d) on charcoal `--brand-charcoal`
(#233d4d); surfaces are a ramp along charcoal's hue and pumpkin is reserved for
accents and calls to action.

## Setup — paint the canvas yourself

There is **no provider or theme wrapper**. Tokens are plain CSS custom
properties on `:root`, so any component works as soon as `styles.css` is loaded.

What you must do instead: **give your root element the canvas.** The design
system is dark-only and the app normally paints it on `body`. Drop a component
onto an unpainted white page and `ghost`/`link` buttons and any section without
its own background render near-white on white.

```jsx
<div style={{ background: "var(--background)", color: "var(--foreground)" }}>
  {/* everything goes in here */}
</div>
```

Equivalently, put `bg-background` on that root element.

## Styling idiom — Tailwind utilities, but a compiled subset

Components are styled with Tailwind v4 utility classes bound to the tokens.
**Important:** `_ds_bundle.css` is a *compiled* stylesheet containing only the
utilities this system actually uses — it is not a full Tailwind build. A class
that isn't in the list below will not resolve.

Colour utilities that ship:

| Backgrounds | Text | Borders |
|---|---|---|
| `bg-background` `bg-card` `bg-secondary` `bg-accent` `bg-primary` `bg-destructive` | `text-accent` `text-accent-foreground` `text-muted-foreground` `text-primary` `text-primary-foreground` `text-secondary-foreground` `text-white` | `border-border` `border-b` `border-t` |

For anything outside that list — including `text-foreground`, which is applied
to `body` and therefore never emitted as a class — **use the token directly**:
`style={{ color: "var(--foreground)" }}`.

Available tokens: `--background` `--foreground` `--card` `--card-foreground`
`--primary` `--primary-foreground` `--secondary` `--secondary-foreground`
`--muted` `--muted-foreground` `--accent` `--accent-foreground` `--destructive`
`--border` `--input` `--ring` `--radius` plus the two brand values above.

Layout, spacing and typography utilities behave as normal Tailwind.

## Composition

`Button` is the only component with an API: `variant`
(`default` | `secondary` | `outline` | `ghost` | `link` | `destructive`), `size`
(`default` | `xs` | `sm` | `lg` | `icon` | `icon-xs` | `icon-sm` | `icon-lg`),
and `asChild` to render a link with button styling. An SVG child is auto-sized —
don't set its dimensions.

`Header`, `HeroSection`, `GamesSection`, `FeaturesSection` and `Footer` take
**no props**. They are full-width page sections with fixed copy, meant to be
stacked in that order. Treat them as page furniture, not configurable parts —
for new content, build it from `Button` plus the tokens above. `Header` is
`position: fixed`, so it needs a spacer or padded page top beneath it.

Section rhythm alternates surfaces: `bg-background` → `bg-card` →
`bg-background` → `bg-card`.

## Where the truth lives

Read the real files before styling: `styles.css` and its two imports
(`fonts/fonts.css`, `_ds_bundle.css`) are the complete style surface a design
receives. Per-component `.prompt.md` and `.d.ts` carry the API.

## Example

```jsx
<div className="bg-background" style={{ color: "var(--foreground)" }}>
  <section className="border-b border-border bg-card py-24">
    <div className="mx-auto max-w-6xl px-6">
      <h2 className="mb-4 text-3xl font-bold tracking-tight">Latest patch</h2>
      <p className="text-muted-foreground">Posted to your channel within hours.</p>
      <Button className="mt-6">View on GitHub</Button>
      <Button variant="ghost" className="mt-6 ml-2">Dismiss</Button>
    </div>
  </section>
</div>
```
