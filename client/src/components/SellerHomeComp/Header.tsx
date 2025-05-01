import styles from "./Header.module.css";
import NavBar from "./NavBar";
import logo from "../../assets/localish-logo.png";

function Header() {
  return (
    <header className={styles.header}>
      <NavBar />
      <div className={styles.logoContainer}>
        <img src={logo} alt="Shop logo" className={styles.logoImage} />
        <div className={styles.shopDetails}>
          <p className={styles.shopName}>shlongshop</p>
          <p className={styles.sellerName}>Handcrafted by: big</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
