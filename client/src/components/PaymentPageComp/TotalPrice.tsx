import * as React from "react";
import styles from "./TotalPrice.module.css";

interface TotalPriceProps {
  total?: number;
}

function TotalPrice({ total = 10000000 }: TotalPriceProps) {
  // Format a number as South African Rand, e.g. 1234567 → "R1 234 567"
  const formatCurrency = (amount: number): string => {
    return `R${amount.toLocaleString("en-ZA")}`;
  };

  return (
    <article className={styles.article} aria-label="Total amount display">
      <h2 className={styles.h2}>Total:</h2>
      <p
        className={styles.p}
        aria-label={`Total amount: ${formatCurrency(total)}`}
      >
        {formatCurrency(total)}
      </p>
    </article>
  );
}

export default TotalPrice;
