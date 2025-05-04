import styles from "./ShopFront.module.css";

type Props = {
  logo: string;
  name: string;
  bio?: string;
};

function Header({ logo, name, bio }: Props) {
  return (
    <header className={styles.header}>
      <img src={logo} alt="Shop Logo" className={styles.logo} />
      <h2 className={styles.shopName}>{name}</h2>
      {bio && <p className={styles.bio}>{bio}</p>}
    </header>
  );
}

export default Header;

