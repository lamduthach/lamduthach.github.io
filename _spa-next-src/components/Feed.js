import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

// React version of ../../spa/assets/feed.js: same comments, same batches,
// same content_append event. Keep the data and sizes in sync with that file.
const BATCH_SIZE = 10;
const MAX_ITEMS = 100;

const NAMES = ['Aiko', 'Ben', 'Chloe', 'Daiki', 'Emma', 'Finn', 'Grace', 'Hiro', 'Ivy', 'Jun'];
const TEXTS = [
  'Setup took ten minutes and the first report was ready the same day.',
  'Support answered quickly and fixed my question without any back and forth.',
  'The plans are easy to compare, though I would like more detail on limits.',
  'We use it across three sites and the numbers have been consistent so far.',
  'Good value for a small team. The dashboard could load a little faster.',
];

function readParams() {
  const p = new URLSearchParams(window.location.search);
  const n = parseInt(p.get('delay'), 10);
  return { delay: isNaN(n) || n < 0 ? 0 : n };
}

function Comment({ i }) {
  const [likes, setLikes] = useState(0);
  const text = TEXTS[i % TEXTS.length];
  const body = Array.from({ length: 1 + (i % 3) }, () => text).join(' ');
  const month = (i % 12) + 1;
  const day = ((i * 7) % 28) + 1;
  const date = '2025-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
  return (
    <article className="comment" data-comment-id={i}>
      <h3 className="comment-author">{NAMES[i % NAMES.length] + ' #' + i}</h3>
      <p className="comment-meta">{date}</p>
      <p className="comment-text">{body}</p>
      <button type="button" className="comment-like" onClick={() => setLikes((n) => n + 1)}>
        {'Like (' + likes + ')'}
      </button>
    </article>
  );
}

export default function Feed({ reportPush }) {
  const [total, setTotal] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef(null);
  const observer = useRef(null);
  const batch = useRef(1);
  const timer = useRef(null);
  // Refs, not state: the observer and the button can both call loadMore()
  // before React re-renders, and state would still hold the old values.
  const busy = useRef(false);
  const count = useRef(BATCH_SIZE);
  const done = total >= MAX_ITEMS;

  // Observe again after every batch: a new callback fires even if the
  // sentinel never left the viewport.
  const observeSentinel = (n) => {
    const io = observer.current;
    if (!io || !sentinel.current) return;
    io.unobserve(sentinel.current);
    if (n < MAX_ITEMS) io.observe(sentinel.current);
  };

  const loadMore = () => {
    if (busy.current || count.current >= MAX_ITEMS) return;
    busy.current = true;
    setLoading(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      const next = Math.min(count.current + BATCH_SIZE, MAX_ITEMS);
      count.current = next;
      batch.current += 1;
      busy.current = false;
      // Update the DOM in this same task, as feed.js does, so the observer
      // never sees the old layout after the batch is counted.
      flushSync(() => {
        setTotal(next);
        setLoading(false);
      });
      observeSentinel(next);
      const payload = { event: 'content_append', screen_name: 'feed', batch: batch.current, total: next };
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
      console.log('[SPA-TEST]', payload);
      if (reportPush) reportPush(payload);
    }, readParams().delay);
  };
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  // One observer for the whole life of the feed.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) loadMoreRef.current();
    });
    observer.current = io;
    if (sentinel.current) io.observe(sentinel.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div>
      <div className="feed-list">
        {Array.from({ length: total }, (_, k) => <Comment key={k + 1} i={k + 1} />)}
      </div>
      <p className="feed-status" role="status">{loading ? 'Loading…' : done ? 'End of feed' : ''}</p>
      {!done && !loading && (
        <button id="feed-load-more" type="button" onClick={loadMore}>Load more</button>
      )}
      <div className="feed-sentinel" ref={sentinel} />
    </div>
  );
}
