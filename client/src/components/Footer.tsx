import React from 'react';
import logo from '../assets/localish-logo.png';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#EFE2CC',
        padding: '2rem 3rem',
        marginTop: '4rem',
        borderTop: '1px solid #ddd',
        fontFamily: 'Montserrat, sans-serif',
        color: '#3E2C14',
      }}
    >
      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Logo & Branding */}
        <aside style={{ flex: '1 1 250px' }}>
          <img
            src={logo}
            alt="Localish logo"
            style={{ height: '150px', marginBottom: '1rem' }}
          />
          <p style={{ fontSize: '0.9rem', color: '#5c4a2f' }}>
            Please buy our artwork items🥹
          </p>
        </aside>

        {/* Contact Info */}
        <aside style={{ flex: '1 1 200px' }}>
          <h4 style={{ marginBottom: '0.75rem' }}>Contact</h4>
          <p>Email: idk@localish.co.za</p>
          <p>Phone: +27 21 123 4567</p>
          <p>Location: Gotham</p>
        </aside>

        {/* Quick Links */}
        <aside style={{ flex: '1 1 150px' }}>
          <h4 style={{ marginBottom: '0.75rem' }}>Quick Links</h4>
          <p>Home</p>
          <p>Shop</p>
          <p>Profile</p>
          <p>Cart</p>
        </aside>
      </section>

      {/* Bottom bar */}
      <section
        style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          marginTop: '2rem',
          color: '#7a6a4f',
        }}
      >
        © {new Date().getFullYear()} Localish. All rights reserved.
      </section>
    </footer>
  );
};

export default Footer;
