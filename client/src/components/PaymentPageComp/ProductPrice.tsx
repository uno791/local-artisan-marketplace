import * as React from "react";
import styles from "./ProductPrice.module.css";

interface InputDesignProps {
  title?: string;
  price?: string;
}

function ProductPrice({
  title = "Sub-Total",
  price = "R9000000",
}: InputDesignProps) {
  return (
    <article className={styles.article}>
      <h2 className={styles.h2}>{title}</h2>
      <p className={styles.p}>{price}</p>
    </article>
  );
}

export default ProductPrice;
