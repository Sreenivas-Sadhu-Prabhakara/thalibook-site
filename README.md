# ThaliBook — explainer site

A standalone marketing/explainer page for **ThaliBook**, the order book for
Indian caterers and event cooks.

> **The market list writes itself.** — pricing on discovery, subscription basis

This is *not* the product UI. It is a polished, self-contained landing page that
makes the idea instantly clear to a non-technical caterer and to an investor
skimming for 30 seconds.

## What the product does

A catering quote is just headcount × per-plate, and the shopping list is fully
determined by the menu and the headcount — yet both get re-calculated by hand for
every single event. ThaliBook turns that into an automatic flow:

- **Per-plate quoting** — headcount × per-plate, computed live, enquiry → quoted → booked.
- **Built-in recipe book** — common Indian dishes loaded with per-plate ingredient quantities.
- **Auto ingredient shopping list** — on booking, Σ(per-plate qty × headcount) across the menu.
- **Advance & balance tracking** — record the advance, carry the balance, fire a reminder.
- **This-week consolidated list** — every booked event in the next 7 days summed into one market run.
- **Events calendar & dashboard** — upcoming functions, booked value, advance in hand, balance due.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup — all sections, inline SVG only. |
| `styles.css` | All styling. Palette built around the saffron accent `#ea580c`. |
| `app.js` | Sticky-nav highlight, smooth scroll, and the animated hero booking widget whose shopping list generates itself. No dependencies. |
| `favicon.svg` | Thali-plate mark. |
| `og.svg` / `og.png` | 1200×630 social share image. |

## Design notes

- Palette: saffron accent `#ea580c`, deep roast-brown ink, warm off-white paper,
  a soft saffron tint, and a burnt-sienna warning colour for enquiry/due.
- **Signature:** money and quantities are always set in tabular monospace, so the
  whole page reads like a caterer's order book. The hero widget is a live booking
  where an event's per-ingredient quantities fill in the moment the advance is
  recorded — Σ(per-plate qty × headcount) across the menu.
- Fully self-contained: no CDNs, no external fonts, images or scripts. System
  font stack only. Renders correctly opened as a local `file://` and deploys to
  any static host unchanged.
- Responsive down to mobile with no horizontal page scroll; the wide dashboard
  table scrolls inside its own container.
- Respects `prefers-reduced-motion` (the hero animation freezes on its end-state).

## Run it

Just open `index.html` in a browser. No build step. To serve locally:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Regenerate the OG image

```sh
rsvg-convert -w 1200 -h 630 og.svg -o og.png
```

## Deploy

Pushed to GitHub, this deploys via GitHub Actions Pages
(`.github/workflows/deploy-pages.yml`). `.nojekyll` ensures files are served
verbatim. No configuration required for any other static host (Netlify,
Cloudflare Pages, S3).

---

A **KARYA** studio build · sreeni.nintendo@gmail.com
