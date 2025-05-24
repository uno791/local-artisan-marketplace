import styles from "./ShopFront.module.css";

type Props = {
  logo?: string;
  name: string;
  bio?: string;
  banner?: string;
  onReportClick?: () => void; // optional report button handler
};

function Header({ logo, name, bio, banner, onReportClick }: Props) {
  return (
    <header
      className={styles.header}
      style={{
        backgroundImage: banner
          ? `url("${banner}")`
          : `url("/fallback-banner.jpg")`, // fallback image if no banner
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={styles.overlay}></div>

      {/* only show report button if handler is passed */}
      {onReportClick && (
        <button
          className={styles["report-btn-overlay"]}
          onClick={onReportClick}
        >
          Report Shop
        </button>
      )}

      {/* show logo if it exists */}
      {logo && <img src={logo} alt="Shop Logo" className={styles.logo} />}
      <h2 className={styles.shopName}>{name}</h2>

      {/* show bio if it exists */}
      {bio && <p className={styles.bio}>{bio}</p>}
    </header>
  );
}

export default Header;
