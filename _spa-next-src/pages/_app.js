import { useRouter } from 'next/router';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  // key: remount the page on every route change (also /products/1/ -> /2/),
  // so each screen pushes its own screen_change event.
  return <Component key={router.asPath} {...pageProps} />;
}
