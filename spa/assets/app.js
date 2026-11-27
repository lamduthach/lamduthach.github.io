(function () {
  'use strict';

  var BASE = '/spa/';

  var SCREENS = {
    home: {
      path: BASE,
      title: 'Home | SPA Test',
      html:
        '<section class="hero">' +
          '<h1 id="home-title">Welcome to the SPA test site</h1>' +
          '<p>This is the home screen. Use it to test A/B variants and heatmaps on a single-page app.</p>' +
          '<button id="home-cta" type="button">Get started</button>' +
          '<p class="cta-result" data-cta-result></p>' +
        '</section>' +
        '<div class="blocks">' +
          '<div class="home-block"><h2>Fast</h2><p>Screens switch without a page reload.</p></div>' +
          '<div class="home-block"><h2>Trackable</h2><p>Every screen change is pushed to the dataLayer.</p></div>' +
          '<div class="home-block"><h2>Testable</h2><p>Add ?delay=500 to simulate content that renders late.</p></div>' +
        '</div>'
    },
    products: {
      path: BASE + 'products/',
      title: 'Products | SPA Test',
      html:
        '<section class="hero">' +
          '<h1 id="products-title">Our products</h1>' +
          '<p>Three sample plans. None of them are real.</p>' +
          '<button id="products-cta" type="button">Compare plans</button>' +
          '<p class="cta-result" data-cta-result></p>' +
        '</section>' +
        '<div class="blocks">' +
          '<div class="products-block"><h2>Starter</h2><p>For small sites. 1 project.</p>' +
            '<a href="' + BASE + 'products/1/" data-link>View details</a></div>' +
          '<div class="products-block"><h2>Business</h2><p>For growing teams. 10 projects.</p>' +
            '<a href="' + BASE + 'products/2/" data-link>View details</a></div>' +
          '<div class="products-block"><h2>Enterprise</h2><p>For large sites. Unlimited projects.</p>' +
            '<a href="' + BASE + 'products/3/" data-link>View details</a></div>' +
        '</div>'
    },
    feed: {
      path: BASE + 'feed/',
      title: 'Feed | SPA Test',
      html:
        '<section class="hero">' +
          '<h1 id="feed-title">Customer reviews</h1>' +
          '<p>A long page. More comments load as you scroll.</p>' +
          '<button id="feed-cta" type="button">Write a review</button>' +
          '<p class="cta-result" data-cta-result></p>' +
        '</section>' +
        '<div data-feed></div>'
    },
    contact: {
      path: BASE + 'contact/',
      title: 'Contact | SPA Test',
      html:
        '<section class="hero">' +
          '<h1 id="contact-title">Contact us</h1>' +
          '<p>This is a test page. Nothing on it sends data anywhere.</p>' +
          '<button id="contact-cta" type="button">Send a message</button>' +
          '<p class="cta-result" data-cta-result></p>' +
        '</section>' +
        '<div class="blocks">' +
          '<div class="contact-block"><h2>Email</h2><p>example@example.com</p></div>' +
          '<div class="contact-block"><h2>Phone</h2><p>000-0000-0000</p></div>' +
          '<div class="contact-block"><h2>Office hours</h2><p>Mon–Fri, 10:00–18:00</p></div>' +
        '</div>'
    }
  };

  // Product detail screens: /spa/products/<id>/ (one screen per ID, like a
  // tour detail page). Keep the IDs in sync with ROUTES in sync-routes.sh.
  var PRODUCTS = {
    '1': { name: 'Starter', desc: 'For small sites. 1 project.' },
    '2': { name: 'Business', desc: 'For growing teams. 10 projects.' },
    '3': { name: 'Enterprise', desc: 'For large sites. Unlimited projects.' }
  };

  function productScreen(id) {
    var p = PRODUCTS[id];
    return {
      title: p.name + ' | Products | SPA Test',
      html:
        '<section class="hero">' +
          '<p><a href="' + BASE + 'products/" data-link>&larr; All products</a></p>' +
          '<h1 id="product-title">' + p.name + ' plan</h1>' +
          '<p>' + p.desc + '</p>' +
          '<button id="product-cta" type="button">Choose ' + p.name + '</button>' +
          '<p class="cta-result" data-cta-result></p>' +
        '</section>' +
        '<div class="blocks">' +
          '<div class="product-block"><h2>Product ID</h2><p>' + id + '</p></div>' +
          '<div class="product-block"><h2>Path</h2><p>' + BASE + 'products/' + id + '/</p></div>' +
        '</div>'
    };
  }

  var app = document.getElementById('app');
  var pendingRender = null;

  function params() {
    return new URLSearchParams(location.search);
  }

  function isDebug() {
    return params().get('debug') === '1';
  }

  function delayMs() {
    var n = parseInt(params().get('delay'), 10);
    return isNaN(n) || n < 0 ? 0 : n;
  }

  // Returns { name, nav, screen } for a path. name is the screen_name pushed to
  // the dataLayer; nav is the top link to highlight.
  // Unknown paths (e.g. /spa/index.html, /spa/products/9/) fall back to the
  // closest known screen.
  function resolve(pathname) {
    var m = pathname.match(/^\/spa\/products\/([^/]+)\/?$/);
    if (m && PRODUCTS[m[1]]) {
      return { name: 'product_detail', nav: 'products', screen: productScreen(m[1]) };
    }
    if (pathname.indexOf(BASE + 'products') === 0) return { name: 'products', nav: 'products', screen: SCREENS.products };
    if (pathname.indexOf(BASE + 'feed') === 0) return { name: 'feed', nav: 'feed', screen: SCREENS.feed };
    if (pathname.indexOf(BASE + 'contact') === 0) return { name: 'contact', nav: 'contact', screen: SCREENS.contact };
    return { name: 'home', nav: 'home', screen: SCREENS.home };
  }

  function pushScreenChange(name, navigationType) {
    var payload = {
      event: 'screen_change',
      screen_name: name,
      page_path: location.pathname,
      page_title: document.title,
      navigation_type: navigationType
    };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    console.log('[SPA-TEST]', payload);

    var panel = document.getElementById('debug-panel');
    if (isDebug()) {
      document.getElementById('debug-output').textContent = JSON.stringify(payload, null, 2);
      panel.hidden = false;
    } else {
      panel.hidden = true;
    }
  }

  function updateNav(name) {
    var links = document.querySelectorAll('.site-nav a[data-screen]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('data-screen') === name) {
        links[i].setAttribute('aria-current', 'page');
      } else {
        links[i].removeAttribute('aria-current');
      }
    }
  }

  // Feed screen: comments added while scrolling (see feed.js).
  var feed = null;

  function stopFeed() {
    if (feed) feed.destroy();
    feed = null;
  }

  function draw(route, navigationType) {
    document.title = route.screen.title;
    app.className = 'screen-' + route.name;
    app.innerHTML = route.screen.html;
    if (route.name === 'feed') {
      feed = window.SpaFeed.mount(app.querySelector('[data-feed]'), { delayMs: delayMs });
    }
    pushScreenChange(route.name, navigationType);
  }

  function render(navigationType) {
    var route = resolve(location.pathname);
    updateNav(route.nav);
    stopFeed();

    // A newer navigation cancels a delayed render that has not happened yet.
    if (pendingRender !== null) {
      clearTimeout(pendingRender);
      pendingRender = null;
    }

    var delay = delayMs();
    if (delay > 0) {
      app.className = '';
      app.innerHTML = '<p class="loading">Loading…</p>';
      pendingRender = setTimeout(function () {
        pendingRender = null;
        draw(route, navigationType);
      }, delay);
    } else {
      draw(route, navigationType);
    }
  }

  function navigate(href) {
    var url = new URL(href, location.href);
    // Keep test flags (?delay, ?debug) while moving between screens.
    url.search = location.search;
    if (url.pathname + url.search === location.pathname + location.search) return;
    history.pushState(null, '', url.pathname + url.search);
    window.scrollTo(0, 0);
    render('spa');
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-link]');
    if (!link) return;
    // Let the browser handle new-tab / modified clicks.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(link.getAttribute('href'));
  });

  // CTA buttons: visible feedback only, so clicks show up in heatmaps.
  app.addEventListener('click', function (e) {
    var btn = e.target.closest('button[id$="-cta"]');
    if (!btn) return;
    var out = app.querySelector('[data-cta-result]');
    if (out) out.textContent = 'Clicked "' + btn.textContent + '" at ' + new Date().toLocaleTimeString();
  });

  window.addEventListener('popstate', function () {
    render('spa');
  });

  render('initial');
})();
