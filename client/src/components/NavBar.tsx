import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/localish-logo.png';

const NavBar: React.FC = () => {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: '#F6EBD9',
        padding: '1.2rem 2rem',
        borderBottom: '1px solid #ddd',
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
          minHeight: '80px',
        }}
      >
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Localish logo" style={{ height: '80px' }} />
        </a>

        {/* Navigation links */}
        <ul
          style={{
            display: 'flex',
            listStyle: 'none',
            gap: '3rem',
            margin: 0,
            padding: 0,
            fontSize: '30px',
            fontWeight: 500,
            alignItems: 'center',
          }}
        >
          {['Home', 'Search', 'Cart', 'Profile'].map((item) => (
            <li key={item}>
              <NavLink
                to={item.toLowerCase() === 'home' ? '/' : `/${item.toLowerCase()}`}
                style={(
                  { isActive }: { isActive: boolean }
                ): React.CSSProperties => ({
                  color: '#333',
                  textDecoration: isActive ? 'underline' : 'none',
                  fontWeight: isActive ? 600 : 400,
                })}
              >
                {item}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;

