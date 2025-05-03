import styles from "./ShopFront.module.css";

type Props = {
  logo: string;
};

function Header({ logo }: Props) {
  return (
    <header className={styles.header}>
      <img src={logo} alt="Shop Logo" className={styles.logo} />
      <p className={styles.location}>Cape Town, Waterfront</p>
      <p className={styles.location}>Johannesburg, Sandton</p>
    </header>
  );
}

export default Header;
