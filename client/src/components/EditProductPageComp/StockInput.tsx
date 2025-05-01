import React, { useState } from "react";
import styles from "./StockInput.module.css";

const StockInput: React.FC = () => {
  const [stock, setStock] = useState(1);

  return (
    <div className={styles.container}>
      <label><strong>Stock Count</strong></label>
      <div className={styles.controlGroup}>
        <button
          type="button"
          className={styles.button}
          onClick={() => setStock(Math.max(0, stock - 1))}
        >
          -
        </button>
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className={styles.input}
        />
        <button
          type="button"
          className={styles.button}
          onClick={() => setStock(stock + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default StockInput;
