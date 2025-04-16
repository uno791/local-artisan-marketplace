import "./NavBar.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/localish-logo.png";

function NavBar() {
  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <a href="/" className="navbar-logo">
          <img src={logo} alt="Localish logo" />
        </a>

        <ul className="navbar-links">
          {["Home", "Search", "Cart", "Profile"].map((item) => (
            <li key={item}>
              <NavLink
                to={`/${item}`}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {item}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;
