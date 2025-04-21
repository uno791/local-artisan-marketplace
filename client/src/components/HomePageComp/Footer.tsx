import styles from "./Footer.module.css";
import logo from "../../assets/localish-logo.png";

function Footer() {
  return (
    <footer className={styles.footer}>
      <section className={styles.footerContent}>
        <aside className={styles.footerBranding}>
          <img src={logo} alt="Localish logo" className={styles.footerLogo} />
          <p className={styles.footerDescription}>Please buy our artwork items🥹</p>
        </aside>

        <aside className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Contact</h4>
          <p>Email: idk@localish.co.za</p>
          <p>Phone: +27 21 123 4567</p>
          <p>Location: Gotham</p>
        </aside>

        <aside className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Quick Links</h4>
          <p>Home</p>
          <p>Shop</p>
          <p>Profile</p>
          <p>Cart</p>
        </aside>
      </section>

      <section className={styles.footerBottom}>
        © {new Date().getFullYear()} Localish. All rights reserved.
      </section>
    </footer>
  );
}

export default Footer;
