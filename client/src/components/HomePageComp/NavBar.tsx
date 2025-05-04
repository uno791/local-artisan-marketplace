import { useState } from "react";
import styles from "./NavBar.module.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/localish-logo.png";
import {
  FaHome,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBars,
} from "react-icons/fa";

const navItems = [
  { name: "Home", path: "/Home", icon: <FaHome /> },
  { name: "Search", path: "/Search", icon: <FaSearch /> },
  { name: "Cart", path: "/Cart", icon: <FaShoppingCart /> },
  { name: "Profile", path: "/Profile", icon: <FaUser /> },
];

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <nav className={styles.navbarInner}>
        <a href="/Home" className={styles.navbarLogo}>
          <img src={logo} alt="Localish logo" />
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
                <article className={styles.linkIcon}>{item.icon}</article>
                <p className={styles.linkTitle}>{item.name}</p>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;
