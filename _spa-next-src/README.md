# SPA test site (Next.js)

Next.js (Pages Router) version of the SPA test site in `../spa/`, for checking A/B tests and heatmaps on a React app. Same screens, same `screen_change` dataLayer event, same `?delay` / `?debug` flags.

Live URL: https://lamduthach.github.io/spa-next/

See `../spa/README.md` for the test sites matrix, the dataLayer event and the GTM setup.

## What is different from the plain JavaScript site

- Screens change with `next/link` and the Next.js router (History API).
- Each screen has a **"Re-render this section"** button. It remounts the hero section, replacing its DOM the way a data refresh in a React app does. Use it to check whether an A/B test change survives a React re-render.
- `?delay=500`: on a client navigation the content appears 500 ms late, as on the plain site. On the first load the server HTML already has the content, so the content is shown, then hidden after hydration, then shown again after the delay.
- The page is remounted on every route change (`key={router.asPath}` in `pages/_app.js`), so `/products/1/` to `/products/2/` also pushes `screen_change`.

## Layout

```
_spa-next-src/            # source; Jekyll does not publish folders starting with "_"
├── pages/                # _document.js (GTM), _app.js, index, products/, feed, contact
├── components/Layout.js  # header, hero, delay, dataLayer push
├── components/Feed.js    # Feed screen, React copy of ../spa/assets/feed.js
├── lib/products.js       # product IDs 1..3
├── styles/globals.css    # ../spa/assets/style.css plus Next-only rules for the Feed layout
├── next.config.js        # static export, basePath /spa-next, trailing slash
└── build.sh              # npm ci, next build, copy out/ to ../spa-next/
```

`../_config.yml` tells Jekyll to publish the `_next` folder and the `_*.js` files in the export; without it the site loads with no JavaScript.

## Build and publish

```sh
bash _spa-next-src/build.sh   # needs Node.js; works from any directory
```

Then commit `spa-next/` (and the source) and push. `node_modules/`, `.next/` and `out/` are ignored.

## Run locally

```sh
cd _spa-next-src && npm ci && npm run dev
# open http://localhost:3000/spa-next/
```

## Versions

`next@15.5.29`, `react@19.1.10`, `react-dom@19.1.10` (exact versions). `npm audit` reports advisories in `postcss`, which Next.js uses only at build time to process this site's own CSS; the published site is static files with no Next.js server.
