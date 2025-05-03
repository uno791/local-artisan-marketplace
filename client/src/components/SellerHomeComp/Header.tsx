import styles from "./Header.module.css";
import NavBar from "./NavBar";
interface Artisan {
  shop_name: string;
  bio: string;
  shop_pfp: string;
  shop_address: string;
  shop_banner: string;
}

function Header({ artisan }: { artisan: Artisan }) {
  return (
    <header
      className={styles.header}
      style={{
        backgroundImage: `url(${artisan.shop_banner})`,
      }}
    >
      <div className={styles.overlay}></div>
      <NavBar />
      <div className={styles.logoContainer}>
        <img
          src={artisan.shop_pfp || "/fallback-profile.png"}
          alt="Shop logo"
          className={styles.logoImage}
        />
        <div className={styles.shopDetails}>
          <p className={styles.shopName}>{artisan.shop_name}</p>
          <p className={styles.sellerName}>{artisan.shop_address}</p>
          <p className={styles.bio}>{artisan.bio}</p>
        </div>
      </div>
    </header>
  );
}
export default Header;
