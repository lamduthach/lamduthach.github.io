import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout
      screenName="home"
      nav="home"
      title="Home | SPA Test (Next.js)"
      hero={{
        title: 'Welcome to the SPA test site',
        text: 'This is the home screen of the Next.js version. Use it to test A/B variants and heatmaps on a React single-page app.',
        cta: 'Get started',
      }}
      blocks={
        <>
          <div className="home-block"><h2>Fast</h2><p>Screens switch with next/link, without a page reload.</p></div>
          <div className="home-block"><h2>Trackable</h2><p>Every screen change is pushed to the dataLayer.</p></div>
          <div className="home-block"><h2>Testable</h2><p>Add ?delay=500 to simulate content that renders late.</p></div>
        </>
      }
    />
  );
}
