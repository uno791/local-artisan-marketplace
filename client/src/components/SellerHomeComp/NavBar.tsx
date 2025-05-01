import styles from "./NavBar.module.css";

function NavBar() {
  return (
    <nav className={styles.navbarInner}>
      <button className={styles.addProductBtn}>Add New Product</button>
      <div className={styles.navLinks}>
        <a href="#" className={styles.navLink}>
          home
        </a>
        <a href="#" className={styles.navLink}>
          stats
        </a>
        <a href="#" className={styles.navLink}>
          orders
        </a>
        <a href="#" className={styles.navLink}>
          Profile
        </a>
      </div>
    </nav>
  );
}

export default NavBar;
