import "./NavBar.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/localish-logo.png";
import { FaHome, FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";

const navItems = [
  { name: "Home", path: "/Home", icon: <FaHome /> },
  { name: "Search", path: "/Search", icon: <FaSearch /> },
  { name: "Cart", path: "/Cart", icon: <FaShoppingCart /> },
  { name: "Profile", path: "/Profile", icon: <FaUser /> },
];

function NavBar() {
  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <a href="/" className="navbar-logo">
          <img src={logo} alt="Localish logo" />
        </a>

        <ul className="navbar-links">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                <span className="link-icon">{item.icon}</span>
                <span className="link-title">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;
