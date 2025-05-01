import React from "react";
import styles from "../EditProductPageComp/PriceInput.module.css";

const PriceInput: React.FC = () => {
  return (
    <div className={styles.container}>
      <label><strong>Price(Rands):</strong></label>
      <input
        type="number"
        min="0"
        defaultValue={1}
        className={styles.input}
      />
    </div>
  );
};

export default PriceInput;
