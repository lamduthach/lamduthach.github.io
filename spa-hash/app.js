// Hash router version of ../spa/assets/app.js: same screens, same
// screen_change event and flags, but the screen is in location.hash
// (#/products), so the path never changes and no pushState is used.
(function () {
  'use strict';

  var SCREENS = {
    home: {
      title: 'Home | SPA Test (hash)',
      html:
        '<section class="hero">' +
          '<h1 id="home-title">Welcome to the SPA test site</h1>' +
          '<p>This is the home screen of the hash router version. Use it to test A/B variants and heatmaps on a single-page app.</p>' +
          '<button id="home-cta" type="button">Get started</button>' +
          '<p class="cta-result" data-cta-result></p>' +
        '</section>' +
        '<div class="blocks">' +
          '<div class="home-block"><h2>Fast</h2><p>Screens switch with a hash change, without a page reload.</p></div>' +
          '<div class="home-block"><h2>Trackable</h2><p>Every screen change is pushed to the dataLayer.</p></div>' +
          '<div class="home-block"><h2>Testable</h2><p>Add ?delay=500 to simulate content that renders late.</p></div>' +
        '</div>'
    },
    products: {
      title: 'Products | SPA Test (hash)',
      html:
        '<section class="hero">' +
          '<h1 id="products-title">Our products</h1>' +
          '<p>Three sample plans. None of them are real.</p>' +
          '<button id="products-cta" type="button">Compare plans</button>' +
          '<p class="cta-result" data-cta-result></p>' +
        '</section>' +
        '<div class="blocks">' +
          '<div class="products-block"><h2>Starter</h2><p>For small sites. 1 project.</p>' +
            '<a href="#/products/1">View details</a></div>' +
          '<div class="products-block"><h2>Business</h2><p>For growing teams. 10 projects.</p>' +
            '<a href="#/products/2">View details</a></div>' +
          '<div class="products-block"><h2>Enterprise</h2><p>For large sites. Unlimited projects.</p>' +
            '<a href="#/products/3">View details</a></div>' +
        '</div>'
    },
    feed: {
      title: 'Feed | SPA Test (hash)',
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
      title: 'Contact | SPA Test (hash)',
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

  var PRODUCTS = {
    '1': { name: 'Starter', desc: 'For small sites. 1 project.' },
    '2': { name: 'Business', desc: 'For growing teams. 10 projects.' },
    '3': { name: 'Enterprise', desc: 'For large sites. Unlimited projects.' }
  };

  function productScreen(id) {
    var p = PRODUCTS[id];
    return {
      title: p.name + ' | Products | SPA Test (hash)',
      html:
        '<section class="hero">' +
          '<p><a href="#/products">&larr; All products</a></p>' +
          '<h1 id="product-title">' + p.name + ' plan</h1>' +
          '<p>' + p.desc + '</p>' +
          '<button id="product-cta" type="button">Choose ' + p.name + '</button>' +
          '<p class="cta-result" data-cta-result></p>' +
        '</section>' +
        '<div class="blocks">' +
          '<div class="product-block"><h2>Product ID</h2><p>' + id + '</p></div>' +
          '<div class="product-block"><h2>Path</h2><p>#/products/' + id + '</p></div>' +
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

  // Screen path from the hash: "#/products/1" -> "/products/1"; no hash -> "/".
  function hashPath() {
    var h = location.hash.replace(/^#/, '');
    return h.charAt(0) === '/' ? h : '/';
  }

  // Returns { name, nav, screen }. Unknown hashes fall back to the closest
  // known screen.
  function resolve(path) {
    var m = path.match(/^\/products\/([^/]+)\/?$/);
    if (m && PRODUCTS[m[1]]) {
      return { name: 'product_detail', nav: 'products', screen: productScreen(m[1]) };
    }
    if (path.indexOf('/products') === 0) return { name: 'products', nav: 'products', screen: SCREENS.products };
    if (path.indexOf('/feed') === 0) return { name: 'feed', nav: 'feed', screen: SCREENS.feed };
    if (path.indexOf('/contact') === 0) return { name: 'contact', nav: 'contact', screen: SCREENS.contact };
    return { name: 'home', nav: 'home', screen: SCREENS.home };
  }

  function pushScreenChange(name, navigationType) {
    var payload = {
      event: 'screen_change',
      screen_name: name,
      // Path plus hash, since the path alone is the same on every screen.
      page_path: location.pathname + location.hash,
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

  // Feed screen: comments added while scrolling (see ../spa/assets/feed.js).
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
    var route = resolve(hashPath());
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

  // CTA buttons: visible feedback only, so clicks show up in heatmaps.
  app.addEventListener('click', function (e) {
    var btn = e.target.closest('button[id$="-cta"]');
    if (!btn) return;
    var out = app.querySelector('[data-cta-result]');
    if (out) out.textContent = 'Clicked "' + btn.textContent + '" at ' + new Date().toLocaleTimeString();
  });

  // Links are plain "#/..." anchors: the browser changes the hash (keeping
  // ?delay / ?debug in the query) and fires hashchange, also on Back/Forward.
  window.addEventListener('hashchange', function () {
    window.scrollTo(0, 0);
    render('spa');
  });

  render('initial');
})();
