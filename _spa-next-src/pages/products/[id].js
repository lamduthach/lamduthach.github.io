import Layout, { FlagLink } from '../../components/Layout';
import { PRODUCTS } from '../../lib/products';

export default function Product({ id, product }) {
  return (
    <Layout
      screenName="product_detail"
      nav="products"
      title={product.name + ' | Products | SPA Test (Next.js)'}
      hero={{
        back: <p><FlagLink href="/products/">&larr; All products</FlagLink></p>,
        title: product.name + ' plan',
        text: product.desc,
        cta: 'Choose ' + product.name,
      }}
      blocks={
        <>
          <div className="product-block"><h2>Product ID</h2><p>{id}</p></div>
          <div className="product-block"><h2>Path</h2><p>/spa-next/products/{id}/</p></div>
        </>
      }
    />
  );
}

export function getStaticPaths() {
  return { paths: Object.keys(PRODUCTS).map((id) => ({ params: { id } })), fallback: false };
}

export function getStaticProps({ params }) {
  return { props: { id: params.id, product: PRODUCTS[params.id] } };
}
