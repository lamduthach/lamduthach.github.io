# SPA test site (state, URL never changes)

A single-page app (plain HTML/CSS/JS, no build step) whose content changes **without the URL changing**: tabs, a modal, a 3-step wizard and a section that is rebuilt from state. Use it to test A/B tests (Mieruca Optimize) and heatmaps on pages where the URL stays the same.

Live URL: https://lamduthach.github.io/spa-state/

The URL never changes: no `history.pushState`/`replaceState`, no `location.hash` change, no query change. Navigation uses `<button>`s, not links.

## Structure

```
spa-state/
├── index.html   # entry; extra CSS (tabs, modal, wizard) is inline
├── app.js       # state, rendering, dataLayer pushes
└── README.md
```

Styles are shared from `/spa/assets/style.css`. `app.js` is loaded by the absolute path `/spa-state/app.js`, so serve from the repo root.

## Screens and interactions

| Where | Interaction | What changes | `screen_change` pushed? |
|---|---|---|---|
| Header tabs (`button[role=tab][data-screen]`) | Click Home / Products / Wizard / Contact | Whole screen; the selected tab gets `aria-current="page"`; `document.title` changes | Yes (`spa`) |
| Products | `#products-cta` "Compare plans" | Opens a modal (backdrop + dialog, Close button, Esc, backdrop click) | No |
| Products | `#products-rerender` "Re-render this section" | The whole hero section (including `#products-title`) is replaced by a **new DOM node** built from state, with "Section rendered N time(s)" | No |
| Wizard | Step 1: Starter / Business / Enterprise | Marks the plan as selected (`aria-pressed`) | No |
| Wizard | Next / Back / Finish | Next and Back change the step; Finish only shows "Finished ... at <time>" | Next/Back: yes (`spa`); Finish: no |
| Home, Contact | CTA buttons | "Clicked ... at <time>" | No |

Notes:

- `#products-title` is exactly "Our products", so an A/B pattern can turn it into "Our products [B]". After "Re-render this section" the node is new and the text goes back to "Our products".
- Entering the Wizard tab always starts at step 1. The selected plan and name are kept in memory until reload. Clicking the tab that is already shown does nothing.
- Opening the Products tab resets the render counter to 1.

## Test flags

- `?delay=500` delays every screen paint (first load, tab change, wizard step) by that many ms; "Loading…" is shown while waiting. Modal, plan choice and re-render are not delayed.
- `?debug=1` shows the last dataLayer push in a panel at the bottom.

The flags are read from the query on load; the page never rewrites them. Every push is also logged to the console with the prefix `[SPA-TEST]`.

## dataLayer

```js
{ event: 'screen_change',
  screen_name: 'home' | 'products' | 'contact' |
               'wizard_step_1' | 'wizard_step_2' | 'wizard_step_3',
  page_path: '/spa-state/',          // always, the URL never changes
  page_title: document.title,        // "Products | SPA Test (state)", ...
  navigation_type: 'initial' | 'spa' }
```

Pushed on the first load (`initial`), on a tab change and on a wizard step change (`spa`). Not pushed on modal open/close, plan choice or "Re-render this section".

## GTM

Container `GTM-P8BL6SNQ`, the same as the other SPA test sites. The Mieruca tags (Optimize dev, Heatmap dev) are loaded only through GTM; see `../spa/README.md` "GTM setup". To change the container ID, edit it in the `<head>` snippet and the `<noscript>` block of `index.html`.

Because the URL is the same on every screen, a trigger based on page URL or history change will not fire here; use the `screen_change` custom event.

## Run locally

Serve the **repo root** so the absolute path `/spa-state/app.js` resolves:

```sh
cd <repo root>
python3 -m http.server 8000
# open http://localhost:8000/spa-state/
```

## Publish

Commit the `spa-state/` folder and push it to `lamduthach.github.io` (GitHub Pages is already enabled for this repo).

## Remove

Delete the `spa-state/` folder and push.
