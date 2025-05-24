import styles from "./Heading.module.css";

// props for displaying product name in heading
interface HeadingProps {
  name: string;
}

function Heading({ name }: HeadingProps) {
  return (
    // container for product title and label
    <header className={styles["heading-container"]}>
      {/* main product name */}
      <h1 className={styles["product-title"]}>{name}</h1>

      {/* label shown under the name */}
      <p className={styles["product-label"]}>Original Artwork</p>
    </header>
  );
}

export default Heading;
