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
  //console.log("Banner in header:", artisan.shop_banner);
  return (
    <header
      className={styles.header}
      style={{
        backgroundImage: artisan.shop_banner
          ? `url("${artisan.shop_banner}")`
          : `url("/fallback-banner.jpg")`,
      }}
    >
      <aside className={styles.overlay}></aside>
      <NavBar />
      <figure className={styles.logoContainer}>
        <img
          src={artisan.shop_pfp || "/profile.png"}
          alt="Shop logo"
          className={styles.logoImage}
        />
        <figcaption className={styles.shopDetails}>
          <h1 className={styles.shopName}>{artisan.shop_name}</h1>
          <address className={styles.sellerName}>
            {artisan.shop_address}
          </address>
          <p className={styles.bio}>{artisan.bio}</p>
        </figcaption>
      </figure>
    </header>
  );
}
export default Header;
