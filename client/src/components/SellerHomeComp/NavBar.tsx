import styles from "./NavBar.module.css";
import { NavLink } from "react-router-dom";
// import logo from "../../assets/localish-logo.png";
// import {Logo} from "../WelcomePageComp/Logo";

import { FaHome, FaChartBar, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";

const navItems = [
  { name: "Home", path: "/SellerHome", icon: <FaHome /> },
  { name: "Stats", path: "/SellerStats", icon: <FaChartBar /> },
  { name: "Orders", path: "/SellerOrders", icon: <FaBoxOpen /> },
  { name: "Return", path: "/Profile", icon: <FaSignOutAlt /> },
];

function NavBar() {
  return (
    <header className={styles.navbar}>
      <nav className={styles.navbarInner}>
        <a href="/Home" className={styles.navbarLogo}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ce563473ae3143012b658856f2516018aeee3a0"
            alt="Localish logo"
          />
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
