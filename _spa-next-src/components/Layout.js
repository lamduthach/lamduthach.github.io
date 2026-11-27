import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Module state lives for the whole page load (not reset by client navigation).
let hydrated = false;   // first client render finished
let firstPush = true;   // next screen_change is the initial one

function readParams() {
  const p = new URLSearchParams(window.location.search);
  const n = parseInt(p.get('delay'), 10);
  return { delay: isNaN(n) || n < 0 ? 0 : n, debug: p.get('debug') === '1' };
}

const NAV = [
  { key: 'home', href: '/', label: 'Home' },
  { key: 'products', href: '/products/', label: 'Products' },
  { key: 'feed', href: '/feed/', label: 'Feed' },
  { key: 'contact', href: '/contact/', label: 'Contact' },
];

// Link that keeps ?delay / ?debug while moving between screens, like the
// plain JS site. The query is added after mount so the server HTML and the
// first client render match (no hydration mismatch).
export function FlagLink({ href, ...rest }) {
  const [search, setSearch] = useState('');
  useEffect(() => setSearch(window.location.search), []);
  return <Link href={href + search} {...rest} />;
}

export default function Layout({ screenName, nav, title, hero, blocks }) {
  // phase: 'ssr' (server HTML / hydration), 'loading' (?delay running),
  // 'done' (final content; screen_change is pushed once, here).
  // On client navigation the delay starts at once; on the first load the
  // server HTML has the content, so ?delay hides it after hydration instead.
  const [phase, setPhase] = useState(() => (hydrated && readParams().delay > 0 ? 'loading' : 'ssr'));
  const [heroVersion, setHeroVersion] = useState(0);
  const [ctaText, setCtaText] = useState('');
  const [lastPush, setLastPush] = useState(null);
  const ready = phase !== 'loading';
  // Lets a screen (the Feed) show its own dataLayer pushes in the debug panel.
  const reportPush = (payload) => {
    if (readParams().debug) setLastPush(payload);
  };

  useEffect(() => {
    hydrated = true;
    const { delay } = readParams();
    if (delay === 0) {
      setPhase('done');
      return undefined;
    }
    setPhase('loading');
    const t = setTimeout(() => setPhase('done'), delay);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 'done') return;
    const payload = {
      event: 'screen_change',
      screen_name: screenName,
      page_path: window.location.pathname,
      page_title: title,
      navigation_type: firstPush ? 'initial' : 'spa',
    };
    firstPush = false;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    console.log('[SPA-TEST]', payload);
    if (readParams().debug) setLastPush(payload);
  }, [phase, screenName, title]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header className="site-header">
        <FlagLink className="brand" href="/">SPA Test (Next.js)</FlagLink>
        <nav className="site-nav" aria-label="Main">
          {NAV.map((n) => (
            <FlagLink key={n.key} href={n.href} aria-current={n.key === nav ? 'page' : undefined}>
              {n.label}
            </FlagLink>
          ))}
        </nav>
      </header>

      <main id="app" className={ready ? 'screen-' + screenName : ''} aria-live="polite">
        {!ready ? (
          <p className="loading">Loading…</p>
        ) : (
          <>
            {/* key: "Re-render" remounts this section, replacing its DOM the way
                a data refresh in a React app does. Use it to check whether an
                A/B test change survives a React re-render. */}
            <section className="hero" key={heroVersion}>
              {hero.back}
              <h1 id={screenName + '-title'}>{hero.title}</h1>
              <p>{hero.text}</p>
              <button id={screenName + '-cta'} type="button"
                onClick={() => setCtaText('Clicked "' + hero.cta + '" at ' + new Date().toLocaleTimeString())}>
                {hero.cta}
              </button>{' '}
              <button id={screenName + '-rerender'} type="button" onClick={() => setHeroVersion((v) => v + 1)}>
                Re-render this section
              </button>
              <p className="cta-result" data-cta-result>{ctaText}</p>
              <p className="rerender-count">Section rendered {heroVersion + 1} time(s)</p>
            </section>
            <div className="blocks">{typeof blocks === 'function' ? blocks(reportPush) : blocks}</div>
          </>
        )}
      </main>

      {lastPush && (
        <div id="debug-panel">
          <strong>Last dataLayer push</strong>
          <pre>{JSON.stringify(lastPush, null, 2)}</pre>
        </div>
      )}
    </>
  );
}

