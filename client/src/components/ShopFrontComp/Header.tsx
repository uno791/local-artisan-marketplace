import styles from "./ShopFront.module.css";

type Props = {
<<<<<<< HEAD
  logo?: string;
  name: string;
  bio?: string;
  banner?: string;
  onReportClick?: () => void;
=======
  logo?: string; // optional logo image url
  name: string; // required shop name
  bio?: string; // optional bio/description
  banner?: string; // optional banner background image
  onReportClick?: () => void; // optional report handler
>>>>>>> 470318318c0e02dedcba9d3bf168a93d42109886
};

function Header({ logo, name, bio, banner, onReportClick }: Props) {
  return (
    <header
      className={styles.header}
      style={{
        backgroundImage: banner
          ? `url("${banner}")`
          : `url("/fallback-banner.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={styles.overlay}></div>

<<<<<<< HEAD
      {/* Optional Report Button */}
=======
      {/* display report button if a handler is provided */}
>>>>>>> 470318318c0e02dedcba9d3bf168a93d42109886
      {onReportClick && (
        <button
          className={styles["report-btn-overlay"]}
          onClick={onReportClick}
        >
          Report Shop
        </button>
      )}

<<<<<<< HEAD
      <figure className={styles.detailsCard}>
        {logo && (
          <img
            src={logo}
            alt="Shop Logo"
            className={styles.logo}
          />
        )}
        <figcaption>
          <h2 className={styles.shopName}>{name}</h2>
          {bio && <p className={styles.bio}>{bio}</p>}
        </figcaption>
      </figure>
=======
      {/* shop logo image */}
      {logo && <img src={logo} alt="Shop Logo" className={styles.logo} />}

      {/* shop name and bio */}
      <h2 className={styles.shopName}>{name}</h2>
      {bio && <p className={styles.bio}>{bio}</p>}
>>>>>>> 470318318c0e02dedcba9d3bf168a93d42109886
    </header>
  );
}

export default Header;
