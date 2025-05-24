import styles from "./Price.module.css";

// props interface
interface PriceProps {
  price: number;
}

// component definition
function Price({ price }: PriceProps) {
  return (
    <section className={styles["price-container"]}>
      <p className={styles["product-price"]}>R{price}</p>
    </section>
  );
}

export default Price;
