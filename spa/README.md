# SPA test site

A small single-page app (plain HTML/CSS/JS, no build step) for testing A/B tests and heatmaps on a site that changes screens with the History API instead of page loads.

Live URL: https://lamduthach.github.io/spa/

A Next.js (React) version with the same screens, events and flags is at https://lamduthach.github.io/spa-next/ (source in `../_spa-next-src/`).

## Test sites matrix

Three sample sites, differing on two axes: how the URL changes on a screen change (router) and how the screen is drawn (rendering).

| Site | Router | Rendering | Mieruca tags | What it stands for |
|---|---|---|---|---|
| 1. https://nguyenvietdiem.github.io/spa-gtm-sample/ | Hash (`#/products`) | Plain JavaScript | Production | SPA with a hash router (optional case) |
| 2. https://lamduthach.github.io/spa/ (this site) | History API (`/spa/products/`) | Plain JavaScript | Dev | SPA with the History API |
| 3. https://lamduthach.github.io/spa-next/ | History API | React (Next.js Pages Router) | Dev | Closest to a Next.js Pages Router site |

All three push the GTM custom event `screen_change` on the first load and on every screen change.

| Compare | Only difference | If it works on the first site but not on the second, the cause is |
|---|---|---|
| Site 2 vs Site 1 | Router (also tag environment) | Hash routing |
| Site 2 vs Site 3 | Rendering | React re-rendering overwrites the A/B test change |

## Structure

```
spa/
├── index.html               # SPA entry (the only one you edit)
├── products/index.html      # copies of index.html (generated)
├── products/1..3/index.html
├── contact/index.html
├── assets/app.js            # router, rendering, dataLayer pushes
├── assets/style.css
├── sync-routes.sh           # regenerates the copies
└── README.md
```

Screens: `/spa/` (Home), `/spa/products/`, `/spa/products/1/` to `/spa/products/3/` (product detail), `/spa/contact/`. Each route folder holds a copy of `index.html` so a deep link or reload returns HTTP 200 on GitHub Pages; the router picks the screen from `location.pathname`. Product IDs are listed in `PRODUCTS` in `assets/app.js` and `ROUTES` in `sync-routes.sh`; keep them in sync.

## Test flags

- `?delay=500` renders the screen content 500 ms late (any number of ms).
- `?debug=1` shows the last dataLayer push in a panel at the bottom.

Flags are kept when you navigate with the links. Every push is also logged to the console with the prefix `[SPA-TEST]`.

dataLayer event pushed on the first load and every screen change:

```js
{ event: 'screen_change', screen_name: 'home|products|product_detail|contact',
  page_path: location.pathname, page_title: document.title,
  navigation_type: 'initial' | 'spa' }
```

## GTM setup

The Mieruca tags are loaded **only through GTM**, the same way a client using GTM loads them. Both sites use container `GTM-P8BL6SNQ`, the same container as the other pages of lamduthach.github.io. The Mieruca tags fire only on the `screen_change` event, which only these two sites push, so the other pages are not affected.

1. To change the container ID:
   - this site: `index.html`, in the `<head>` snippet and the `<noscript>` block, then run `bash spa/sync-routes.sh`;
   - the Next.js site: `_spa-next-src/pages/_document.js` (`GTM_ID`), then run `bash _spa-next-src/build.sh`.
2. In the container, add one Custom HTML tag per Mieruca tag (dev environment). Paste the content of:
   - `_includes/mieruca-optimize-dev.html` (Optimize dev, ID `1404818873`);
   - `_includes/mieruca-heatmap-dev-tag.html` (Heatmap dev, ID `596826084`).
3. Add a Data Layer Variable `navigation_type`, and the trigger for the scenario under test:

| Scenario | Trigger | Question it answers |
|---|---|---|
| A. Load once | Custom Event `screen_change`, fires when `navigation_type` equals `initial` | Do the tags keep working after screen changes without firing again? |
| B. Fire on every screen change | Custom Event `screen_change`, all custom events | Does firing the tags again on each screen change (controlled by GTM) make the A/B test and heatmap work per screen? |

Use one scenario at a time (publish or preview the container with only that trigger), and record which one each result belongs to.

## Run locally

Serve the **repo root** so the path is really `/spa/`:

```sh
cd <repo root>
python3 -m http.server 8000
# open http://localhost:8000/spa/
```

## After editing index.html

```sh
bash spa/sync-routes.sh   # works from any directory
```

## Publish

Commit the `spa/` folder and push it to `lamduthach.github.io` (GitHub Pages is already enabled for this repo).

## Remove

Delete the `spa/` folder and push.
