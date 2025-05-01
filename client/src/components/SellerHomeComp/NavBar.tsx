import styles from "./NavBar.module.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/localish-logo.png";
import { FaHome, FaChartBar, FaBoxOpen, FaUser } from "react-icons/fa";

const navItems = [
  { name: "Home", path: "/SellerHome", icon: <FaHome /> },
  { name: "Stats", path: "/SellerStats", icon: <FaChartBar /> },
  { name: "Orders", path: "/SellerOrders", icon: <FaBoxOpen /> },
  { name: "Profile", path: "/SellerProfile", icon: <FaUser /> },
];

function NavBar() {
  return (
    <header className={styles.navbar}>
      <nav className={styles.navbarInner}>
        <a href="/" className={styles.navbarLogo}>
          <img src={logo} alt="Localish logo" />
        </a>
        <ul className={styles.navbarLinks}>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
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
