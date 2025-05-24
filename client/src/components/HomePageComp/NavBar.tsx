import { useState, useEffect } from "react";
import styles from "./NavBar.module.css";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

// navigation items
const navItems = [
  { name: "Home", path: "/Home", icon: <FaHome /> },
  { name: "Search", path: "/SearchPage", icon: <FaSearch /> },
  { name: "Cart", path: "/Cart", icon: <FaShoppingCart /> },
  { name: "Profile", path: "/Profile", icon: <FaUser /> },
];

// component definition
function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // optional disable background scroll
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <header className={styles.navbar}>
      <nav className={styles.navbarInner}>
        <a href="/Home" className={styles.navbarLogo}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ce563473ae3143012b658856f2516018aeee3a0"
            alt="Localish logo"
          />
        </a>

        <button
          className={`${styles.menuToggle} ${
            menuOpen ? styles.hideToggle : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>

        {menuOpen && (
          <section
            className={styles.backdrop}
            onClick={() => setMenuOpen(false)}
          ></section>
        )}

        <ul
          className={`${styles.navbarLinks} ${menuOpen ? styles.showMenu : ""}`}
        >
          {menuOpen && (
            <li className={styles.closeButtonWrapper}>
              <button
                className={styles.closeButton}
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </li>
          )}

          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
                onClick={() => setMenuOpen(false)}
              >
                <span className={styles.linkIcon}>{item.icon}</span>
                <span className={styles.linkTitle}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;
