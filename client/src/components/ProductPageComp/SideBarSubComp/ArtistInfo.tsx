import { Link } from "react-router-dom";
import styles from "./ArtistInfo.module.css";

// props for artist/shop information
interface ArtisanProps {
  Uname: string;
  shop_pfp: string;
  shop_name: string;
}

function ArtistInfo({ Uname, shop_pfp, shop_name }: ArtisanProps) {
  return (
    // card container for artist info
    <section className={styles["artist-card"]}>
      {/* shop logo image wrapped in link to artist shop */}
      <Link to={`/shop/${Uname}`}>
        <img
          src={shop_pfp}
          alt={`${shop_name} Logo`}
          className={styles["artist-logo"]}
        />
      </Link>

      {/* artist username as heading */}
      <h2 className={styles["artist-name"]}>{Uname}</h2>

      {/* artist bio (static for now) */}
      <p className={styles["artist-bio"]}>
        passionate pen artist with a love for animals and line art storytelling.
      </p>

      {/* link to shop page */}
      <Link to={`/shop/${Uname}`} className={styles["view-shop-link"]}>
        view artist's shop
      </Link>
    </section>
  );
}

export default ArtistInfo;
