import styles from "./Heading.module.css";

// props interface
interface HeadingProps {
  name: string;
}

// component definition
function Heading({ name }: HeadingProps) {
  return (
    <header className={styles["heading-container"]}>
      <h1 className={styles["product-title"]}>{name}</h1>
      <p className={styles["product-label"]}>Original Artwork</p>
    </header>
  );
}

export default Heading;
