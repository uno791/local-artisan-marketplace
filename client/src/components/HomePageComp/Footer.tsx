import "./Footer.css";
import logo from "../../assets/localish-logo.png";

function Footer() {
  return (
    <footer className="footer">
      <section className="footer-content">
        <aside className="footer-branding">
          <img src={logo} alt="Localish logo" className="footer-logo" />
          <p className="footer-description">Please buy our artwork items🥹</p>
        </aside>

        <aside className="footer-section">
          <h4 className="footer-heading">Contact</h4>
          <p>Email: idk@localish.co.za</p>
          <p>Phone: +27 21 123 4567</p>
          <p>Location: Gotham</p>
        </aside>

        <aside className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <p>Home</p>
          <p>Shop</p>
          <p>Profile</p>
          <p>Cart</p>
        </aside>
      </section>

      <section className="footer-bottom">
        © {new Date().getFullYear()} Localish. All rights reserved.
      </section>
    </footer>
  );
}

export default Footer;
