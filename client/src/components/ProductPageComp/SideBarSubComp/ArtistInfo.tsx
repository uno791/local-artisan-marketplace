import styles from "./ArtistInfo.module.css";

interface ArtisanProps {
  Uname: string;
}

function ArtistInfo({ Uname }: ArtisanProps) {
  return (
    <section className={styles["artist-card"]}>
      <h2 className={styles["artist-name"]}>{Uname}</h2>
      <p className={styles["artist-bio"]}>
        Passionate pen artist with a love for animals and line art storytelling.
      </p>
      <a href="#" className={styles["view-shop-link"]}>
        View Artist's Shop
      </a>
    </section>
  );
}

export default ArtistInfo;

/*import "./ArtistInfo.css";

function ArtistInfo() {
  return (
    <section className="artist-card">
      <h2 className="artist-name">The Art Lab</h2>
      <p className="artist-bio">
        Passionate pen artist with a love for animals and line art storytelling.
      </p>
      <a href="#" className="view-shop-link">
        View Artist's Shop
      </a>
    </section>
  );
}

export default ArtistInfo;*/
