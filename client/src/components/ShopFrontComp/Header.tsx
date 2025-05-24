import styles from "./ShopFront.module.css";

type Props = {
  logo?: string; // optional logo image url
  name: string; // required shop name
  bio?: string; // optional bio/description
  banner?: string; // optional banner background image
  onReportClick?: () => void; // optional report handler
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

      {/* display report button if a handler is provided */}
      {onReportClick && (
        <button
          className={styles["report-btn-overlay"]}
          onClick={onReportClick}
        >
          Report Shop
        </button>
      )}

      {/* shop logo image */}
      {logo && <img src={logo} alt="Shop Logo" className={styles.logo} />}

      {/* shop name and bio */}
      <h2 className={styles.shopName}>{name}</h2>
      {bio && <p className={styles.bio}>{bio}</p>}
    </header>
  );
}

export default Header;
