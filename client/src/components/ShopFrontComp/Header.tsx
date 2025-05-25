import { useRef } from "react";
import styles from "./Header.module.css";
import NavBar from "../HomePageComp/NavBar";
import { baseURL } from "../../config";
import { useUser } from "../../Users/UserContext";

interface Artisan {
  shop_name: string;
  bio: string;
  shop_pfp: string;
  shop_address: string;
  shop_banner: string;
}

interface HeaderProps {
  artisan: Artisan;
  isPublicView?: boolean;
}

function Header({ artisan, isPublicView = false }: HeaderProps) {
  const { user } = useUser();

  return (
    <header
      className={styles.header}
      style={{
        backgroundImage: artisan.shop_banner
          ? `url("${artisan.shop_banner}")`
          : `url("/fallback-banner.jpg")`,
      }}
    >
      <div className={styles.overlay}></div>
      <NavBar />

      {!isPublicView && (
        <></> // Placeholder for future editable controls if needed
      )}

      <figure className={styles.logoContainer}>
        <figcaption className={styles.detailsCard}>
          <img
            src={artisan.shop_pfp || "/profile.png"}
            alt="Shop logo"
            className={styles.logoImage}
          />
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
