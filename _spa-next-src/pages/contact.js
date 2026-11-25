import Layout from '../components/Layout';

export default function Contact() {
  return (
    <Layout
      screenName="contact"
      nav="contact"
      title="Contact | SPA Test (Next.js)"
      hero={{ title: 'Contact us', text: 'This is a test page. Nothing on it sends data anywhere.', cta: 'Send a message' }}
      blocks={
        <>
          <div className="contact-block"><h2>Email</h2><p>example@example.com</p></div>
          <div className="contact-block"><h2>Phone</h2><p>000-0000-0000</p></div>
          <div className="contact-block"><h2>Office hours</h2><p>Mon–Fri, 10:00–18:00</p></div>
        </>
      }
    />
  );
}
