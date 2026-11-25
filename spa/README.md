# SPA test site

A small single-page app (plain HTML/CSS/JS, no build step) for testing A/B tests and heatmaps on a site that changes screens with the History API instead of page loads.

Live URL: https://lamduthach.github.io/spa/

## Structure

```
spa/
├── index.html            # SPA entry (the only one you edit)
├── products/index.html   # copy of index.html (generated)
├── contact/index.html    # copy of index.html (generated)
├── assets/app.js         # router, rendering, dataLayer pushes
├── assets/style.css
├── sync-routes.sh        # regenerates the copies
└── README.md
```

Screens: `/spa/` (Home), `/spa/products/`, `/spa/contact/`. Each route folder holds a copy of `index.html` so a deep link or reload returns HTTP 200 on GitHub Pages; the router picks the screen from `location.pathname`.

## Test flags

- `?delay=500` renders the screen content 500 ms late (any number of ms).
- `?debug=1` shows the last dataLayer push in a panel at the bottom.

Flags are kept when you navigate with the top links. Every push is also logged to the console with the prefix `[SPA-TEST]`.

dataLayer event pushed on the first load and every screen change:

```js
{ event: 'screen_change', screen_name: 'home|products|contact',
  page_path: location.pathname, page_title: document.title,
  navigation_type: 'initial' | 'spa' }
```

## Google Tag Manager

`index.html` uses the placeholder `GTM-XXXXXXX` in two places (the `<head>` snippet and the `<noscript>` block). Replace both, then run `sync-routes.sh`.

## Run locally

Serve the **repo root** so the path is really `/spa/`:

```sh
cd <repo root>
python3 -m http.server 8000
# open http://localhost:8000/spa/
```

## After editing index.html

```sh
./spa/sync-routes.sh   # works from any directory
```

## Publish

Commit the `spa/` folder and push it to `lamduthach.github.io` (GitHub Pages is already enabled for this repo).

## Remove

Delete the `spa/` folder and push.
