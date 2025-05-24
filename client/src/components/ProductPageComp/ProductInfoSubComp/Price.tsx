import styles from "./Price.module.css";

// props for displaying the price
interface PriceProps {
  price: number;
}

function Price({ price }: PriceProps) {
  return (
    // container for price display
    <section className={styles["price-container"]}>
      {/* formatted price value */}
      <p className={styles["product-price"]}>R{price}</p>
    </section>
  );
}

export default Price;
