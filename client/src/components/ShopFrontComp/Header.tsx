import styles from "./ShopFront.module.css";

type Props = {
  logo?: string;
  name: string;
  bio?: string;
  banner?: string;
  onReportClick?: () => void;
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
    </header>
  );
}

export default Header;
