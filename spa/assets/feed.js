// Long "Feed" screen shared by spa, spa-hash and spa-state: comments that are
// rendered in batches while the user scrolls, to test heatmaps and A/B tests
// on content that appears after the page has loaded.
//
// SpaFeed.mount(container, { delayMs: function () { return ms; } }) renders
// the first batch at once and returns { destroy() }. Call destroy() when the
// screen is replaced so a pending batch does not land in a detached node.
//
// Later batches are added when the bottom of the list scrolls into view, or
// with the "Load more" button. Each one waits ?delay ms (like a screen paint)
// and pushes a dataLayer event; it is NOT a screen change, so no screen_change:
//   { event: 'content_append', screen_name: 'feed', batch, total }
// batch is the 1-based batch number; batch 1 is the first render (covered by
// screen_change) and is never pushed. The comments are generated from their
// index, so every run shows the same content in the same positions.
// The Next.js site (_spa-next-src/components/Feed.js) mirrors this logic.
(function () {
  'use strict';

  var BATCH_SIZE = 10;
  var MAX_ITEMS = 100;

  var NAMES = ['Aiko', 'Ben', 'Chloe', 'Daiki', 'Emma', 'Finn', 'Grace', 'Hiro', 'Ivy', 'Jun'];
  var TEXTS = [
    'Setup took ten minutes and the first report was ready the same day.',
    'Support answered quickly and fixed my question without any back and forth.',
    'The plans are easy to compare, though I would like more detail on limits.',
    'We use it across three sites and the numbers have been consistent so far.',
    'Good value for a small team. The dashboard could load a little faster.'
  ];

  function debugOn() {
    return new URLSearchParams(location.search).get('debug') === '1';
  }

  function pushAppend(batch, total) {
    var payload = { event: 'content_append', screen_name: 'feed', batch: batch, total: total };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    console.log('[SPA-TEST]', payload);

    var panel = document.getElementById('debug-panel');
    if (panel && debugOn()) {
      document.getElementById('debug-output').textContent = JSON.stringify(payload, null, 2);
      panel.hidden = false;
    }
  }

  function commentNode(i) {
    var text = TEXTS[i % TEXTS.length];
    var repeat = 1 + (i % 3);
    var body = '';
    for (var r = 0; r < repeat; r++) body += (r ? ' ' : '') + text;

    var month = (i % 12) + 1;
    var day = ((i * 7) % 28) + 1;
    var date = '2025-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;

    var el = document.createElement('article');
    el.className = 'comment';
    el.setAttribute('data-comment-id', String(i));

    var author = document.createElement('h3');
    author.className = 'comment-author';
    author.textContent = NAMES[i % NAMES.length] + ' #' + i;
    var meta = document.createElement('p');
    meta.className = 'comment-meta';
    meta.textContent = date;
    var p = document.createElement('p');
    p.className = 'comment-text';
    p.textContent = body;
    var like = document.createElement('button');
    like.type = 'button';
    like.className = 'comment-like';
    like.setAttribute('data-likes', '0');
    like.textContent = 'Like (0)';

    el.appendChild(author);
    el.appendChild(meta);
    el.appendChild(p);
    el.appendChild(like);
    return el;
  }

  function mount(container, opts) {
    var delayMs = (opts && opts.delayMs) || function () { return 0; };

    var list = document.createElement('div');
    list.className = 'feed-list';
    var status = document.createElement('p');
    status.className = 'feed-status';
    status.setAttribute('role', 'status');
    var more = document.createElement('button');
    more.type = 'button';
    more.id = 'feed-load-more';
    more.textContent = 'Load more';
    var sentinel = document.createElement('div');
    sentinel.className = 'feed-sentinel';
    container.appendChild(list);
    container.appendChild(status);
    container.appendChild(more);
    container.appendChild(sentinel);

    var total = 0;
    var batch = 0;
    var loading = false;
    var destroyed = false;
    var timer = null;
    var observer = null;

    function append() {
      var end = Math.min(total + BATCH_SIZE, MAX_ITEMS);
      for (var i = total + 1; i <= end; i++) list.appendChild(commentNode(i));
      total = end;
      batch += 1;
    }

    function refresh() {
      var done = total >= MAX_ITEMS;
      more.hidden = done || loading;
      status.textContent = loading ? 'Loading…' : (done ? 'End of feed' : '');
      if (observer) {
        // Observe again: a new callback fires even if the sentinel never left the viewport.
        observer.unobserve(sentinel);
        if (!done) observer.observe(sentinel);
      }
    }

    function loadMore() {
      if (destroyed || loading || total >= MAX_ITEMS) return;
      loading = true;
      refresh();
      timer = setTimeout(function () {
        timer = null;
        loading = false;
        append();
        refresh();
        pushAppend(batch, total);
      }, delayMs());
    }

    list.addEventListener('click', function (e) {
      var btn = e.target.closest('.comment-like');
      if (!btn) return;
      var n = parseInt(btn.getAttribute('data-likes'), 10) + 1;
      btn.setAttribute('data-likes', String(n));
      btn.textContent = 'Like (' + n + ')';
    });
    more.addEventListener('click', loadMore);

    append();
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) loadMore();
        }
      });
    }
    refresh();

    return {
      destroy: function () {
        destroyed = true;
        if (timer !== null) clearTimeout(timer);
        if (observer) observer.disconnect();
      }
    };
  }

  window.SpaFeed = { mount: mount };
})();
