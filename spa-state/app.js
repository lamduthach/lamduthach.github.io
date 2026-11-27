// State-driven version of ../spa/assets/app.js: the screen changes but the
// URL NEVER does. No history.pushState/replaceState, no location.hash or query
// changes; navigation is done with <button>s, not links.
//
// dataLayer `screen_change` is pushed ONLY when the screen changes:
//   - first load                   (navigation_type 'initial')
//   - tab change                   ('spa')
//   - wizard step change           ('spa')
// It is NOT pushed when the screen stays the same:
//   - opening/closing the "Compare plans" modal
//   - choosing a plan in the wizard
//   - "Re-render this section" on Products
// page_path is always /spa-state/ because the URL does not change.
(function () {
  'use strict';

  var TITLE_SUFFIX = ' | SPA Test (state)';
  var TITLES = {
    home: 'Home',
    products: 'Products',
    wizard: 'Wizard',
    contact: 'Contact'
  };

  var PLANS = ['Starter', 'Business', 'Enterprise'];

  var state = {
    screen: 'home',
    step: 1,
    plan: '',
    userName: '',
    renderCount: 1
  };

  var app = document.getElementById('app');
  var pendingRender = null;
  var modalOpener = null;

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

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---- Screens, built from state -------------------------------------------

  function homeHtml() {
    return '<section class="hero">' +
        '<h1 id="home-title">Welcome to the SPA test site</h1>' +
        '<p>This is the home screen of the state version. The screen changes, the URL never does.</p>' +
        '<button id="home-cta" type="button">Get started</button>' +
        '<p class="cta-result" data-cta-result></p>' +
      '</section>' +
      '<div class="blocks">' +
        '<div class="home-block"><h2>Fast</h2><p>Screens switch without a page reload or a URL change.</p></div>' +
        '<div class="home-block"><h2>Trackable</h2><p>Every screen change is pushed to the dataLayer.</p></div>' +
        '<div class="home-block"><h2>Testable</h2><p>Add ?delay=500 to simulate content that renders late.</p></div>' +
      '</div>';
  }

  function contactHtml() {
    return '<section class="hero">' +
        '<h1 id="contact-title">Contact us</h1>' +
        '<p>This is a test page. Nothing on it sends data anywhere.</p>' +
        '<button id="contact-cta" type="button">Send a message</button>' +
        '<p class="cta-result" data-cta-result></p>' +
      '</section>' +
      '<div class="blocks">' +
        '<div class="contact-block"><h2>Email</h2><p>example@example.com</p></div>' +
        '<div class="contact-block"><h2>Phone</h2><p>000-0000-0000</p></div>' +
        '<div class="contact-block"><h2>Office hours</h2><p>Mon–Fri, 10:00–18:00</p></div>' +
      '</div>';
  }

  // The hero is rebuilt as a brand new DOM node from state on every
  // "Re-render this section", so changes made to the old node are lost.
  function productsHeroNode() {
    var section = document.createElement('section');
    section.className = 'hero';
    section.id = 'products-hero';
    section.innerHTML =
      '<h1 id="products-title">Our products</h1>' +
      '<p>Three sample plans. None of them are real.</p>' +
      '<button id="products-cta" type="button">Compare plans</button> ' +
      '<button id="products-rerender" type="button">Re-render this section</button>' +
      '<p class="cta-result" data-render-count>Section rendered ' + state.renderCount +
        ' time(s)</p>';
    return section;
  }

  function productsBlocksHtml() {
    return '<div class="blocks">' +
        '<div class="products-block"><h2>Starter</h2><p>For small sites. 1 project.</p></div>' +
        '<div class="products-block"><h2>Business</h2><p>For growing teams. 10 projects.</p></div>' +
        '<div class="products-block"><h2>Enterprise</h2><p>For large sites. Unlimited projects.</p></div>' +
      '</div>';
  }

  function wizardHtml() {
    var body = '';
    var back = state.step > 1 ? '<button id="wizard-back" type="button" data-action="back">Back</button>' : '';
    var next = state.step < 3
      ? '<button id="wizard-next" type="button" data-action="next">Next</button>'
      : '<button id="wizard-finish" type="button" data-action="finish">Finish</button>';

    if (state.step === 1) {
      body = '<h2 id="wizard-step-title">Step 1: choose a plan</h2><div class="wizard-plans">';
      for (var i = 0; i < PLANS.length; i++) {
        body += '<button type="button" data-plan="' + PLANS[i] + '" aria-pressed="' +
          (state.plan === PLANS[i]) + '">' + PLANS[i] + '</button>';
      }
      body += '</div>';
    } else if (state.step === 2) {
      body = '<h2 id="wizard-step-title">Step 2: your name</h2>' +
        '<label class="wizard-field">Name' +
          '<input id="wizard-name" type="text" autocomplete="off" value="' + escapeHtml(state.userName) + '">' +
        '</label>';
    } else {
      body = '<h2 id="wizard-step-title">Step 3: confirm</h2>' +
        '<p>Plan: <strong>' + (state.plan ? escapeHtml(state.plan) : 'none selected') + '</strong></p>' +
        '<p>Name: <strong>' + (state.userName ? escapeHtml(state.userName) : 'not entered') + '</strong></p>';
    }

    return '<section class="hero">' +
        '<h1 id="wizard-title">Wizard</h1>' +
        '<p class="wizard-steps">Step ' + state.step + ' of 3</p>' +
        body +
        '<div class="wizard-nav">' + back + next + '</div>' +
        '<p class="cta-result" data-cta-result></p>' +
      '</section>';
  }

  function screenName() {
    return state.screen === 'wizard' ? 'wizard_step_' + state.step : state.screen;
  }

  // ---- dataLayer / debug panel ---------------------------------------------

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

  // ---- Rendering -----------------------------------------------------------

  function updateTabs() {
    var tabs = document.querySelectorAll('.site-nav button[data-screen]');
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i].getAttribute('data-screen') === state.screen;
      tabs[i].setAttribute('aria-selected', String(on));
      if (on) {
        tabs[i].setAttribute('aria-current', 'page');
      } else {
        tabs[i].removeAttribute('aria-current');
      }
    }
  }

  function draw(navigationType) {
    document.title = TITLES[state.screen] + TITLE_SUFFIX;
    app.className = 'screen-' + state.screen;

    if (state.screen === 'home') {
      app.innerHTML = homeHtml();
    } else if (state.screen === 'contact') {
      app.innerHTML = contactHtml();
    } else if (state.screen === 'wizard') {
      app.innerHTML = wizardHtml();
    } else {
      state.renderCount = 1;
      app.innerHTML = productsBlocksHtml();
      app.insertBefore(productsHeroNode(), app.firstChild);
    }
    pushScreenChange(screenName(), navigationType);
  }

  // Every screen paint (first load, tab change, wizard step) goes through here.
  function render(navigationType) {
    closeModal();
    updateTabs();

    // A newer paint cancels a delayed one that has not happened yet.
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
        draw(navigationType);
      }, delay);
    } else {
      draw(navigationType);
    }
  }

  function showScreen(name) {
    // Clicking the tab already shown is not a screen change.
    if (name === state.screen) return;
    state.screen = name;
    state.step = 1;
    render('spa');
  }

  function goToStep(step) {
    state.step = step;
    render('spa');
  }

  // ---- Modal (no screen change, no dataLayer push) -------------------------

  function openModal(opener) {
    if (document.getElementById('plans-modal')) return;
    modalOpener = opener;
    var backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'plans-modal';
    backdrop.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
        '<h2 id="modal-title">Compare plans</h2>' +
        '<table>' +
          '<tr><th>Plan</th><th>Projects</th></tr>' +
          '<tr><td>Starter</td><td>1</td></tr>' +
          '<tr><td>Business</td><td>10</td></tr>' +
          '<tr><td>Enterprise</td><td>Unlimited</td></tr>' +
        '</table>' +
        '<button id="modal-close" type="button">Close</button>' +
      '</div>';
    document.body.appendChild(backdrop);
    document.getElementById('modal-close').focus();
  }

  function closeModal() {
    var backdrop = document.getElementById('plans-modal');
    if (!backdrop) return;
    backdrop.parentNode.removeChild(backdrop);
    // The opener may have been replaced by "Re-render this section".
    if (modalOpener && document.body.contains(modalOpener)) modalOpener.focus();
    modalOpener = null;
  }

  // ---- Events --------------------------------------------------------------

  document.querySelector('.site-nav').addEventListener('click', function (e) {
    var tab = e.target.closest('button[data-screen]');
    if (tab) showScreen(tab.getAttribute('data-screen'));
  });

  app.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;

    if (btn.id === 'products-cta') {
      openModal(btn);
    } else if (btn.id === 'products-rerender') {
      // Same screen, new DOM node: no dataLayer push.
      state.renderCount += 1;
      var old = app.querySelector('#products-hero');
      old.parentNode.replaceChild(productsHeroNode(), old);
    } else if (btn.hasAttribute('data-plan')) {
      // Same screen: only update the pressed state, no dataLayer push.
      state.plan = btn.getAttribute('data-plan');
      var plans = app.querySelectorAll('button[data-plan]');
      for (var i = 0; i < plans.length; i++) {
        plans[i].setAttribute('aria-pressed', String(plans[i] === btn));
      }
    } else if (btn.getAttribute('data-action') === 'next') {
      goToStep(state.step + 1);
    } else if (btn.getAttribute('data-action') === 'back') {
      goToStep(state.step - 1);
    } else if (btn.getAttribute('data-action') === 'finish') {
      var done = app.querySelector('[data-cta-result]');
      if (done) done.textContent = 'Finished "' + (state.plan || 'no plan') + '" at ' + new Date().toLocaleTimeString();
    } else if (/-cta$/.test(btn.id)) {
      // CTA buttons: visible feedback only, so clicks show up in heatmaps.
      var out = app.querySelector('[data-cta-result]');
      if (out) out.textContent = 'Clicked "' + btn.textContent + '" at ' + new Date().toLocaleTimeString();
    }
  });

  app.addEventListener('input', function (e) {
    if (e.target.id === 'wizard-name') state.userName = e.target.value;
  });

  document.addEventListener('click', function (e) {
    if (e.target.id === 'plans-modal' || e.target.id === 'modal-close') closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  render('initial');
})();
