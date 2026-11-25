import Layout, { FlagLink } from '../../components/Layout';
import { PRODUCTS } from '../../lib/products';

export default function Products() {
  return (
    <Layout
      screenName="products"
      nav="products"
      title="Products | SPA Test (Next.js)"
      hero={{ title: 'Our products', text: 'Three sample plans. None of them are real.', cta: 'Compare plans' }}
      blocks={Object.entries(PRODUCTS).map(([id, p]) => (
        <div className="products-block" key={id}>
          <h2>{p.name}</h2>
          <p>{p.desc}</p>
          <FlagLink href={'/products/' + id + '/'}>View details</FlagLink>
        </div>
      ))}
    />
  );
}
