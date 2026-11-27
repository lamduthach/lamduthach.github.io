import Layout from '../components/Layout';
import Feed from '../components/Feed';

export default function FeedPage() {
  return (
    <Layout
      screenName="feed"
      nav="feed"
      title="Feed | SPA Test (Next.js)"
      hero={{ title: 'Customer reviews', text: 'A long page. More comments load as you scroll.', cta: 'Write a review' }}
      blocks={(reportPush) => <Feed reportPush={reportPush} />}
    />
  );
}
