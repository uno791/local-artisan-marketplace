import { Link } from "react-router-dom";
import styles from "./ArtistInfo.module.css";

// props interface
interface ArtisanProps {
  Uname: string;
  shop_pfp: string;
  shop_name: string;
}

// component definition
function ArtistInfo({ Uname, shop_pfp, shop_name }: ArtisanProps) {
  return (
    <section className={styles["artist-card"]}>
      <Link to={`/shop/${Uname}`}>
        <img
          src={shop_pfp}
          alt={`${shop_name} Logo`}
          className={styles["artist-logo"]}
        />
      </Link>
      <h2 className={styles["artist-name"]}>{Uname}</h2>
      <p className={styles["artist-bio"]}>
        Passionate pen artist with a love for animals and line art storytelling.
      </p>
      <Link to={`/shop/${Uname}`} className={styles["view-shop-link"]}>
        View Artist's Shop
      </Link>
    </section>
  );
}

export default ArtistInfo;
