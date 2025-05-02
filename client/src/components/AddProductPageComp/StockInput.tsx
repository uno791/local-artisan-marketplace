import React, { useState, useEffect } from "react";
import styles from "../EditProductPageComp/StockInput.module.css";

interface props {
  stock: number;  
  setStock: (stock: number) => void;  
}

const StockInput: React.FC<props> = ({ stock, setStock }) => {
  const [inputValue, setInputValue] = useState<string>("");

  // Keep input field in sync with external stock value
  useEffect(() => {
    if (stock === 0 && inputValue === "") return;
    setInputValue(stock.toString());
  }, [stock]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Only allow digits (no letters, no leading +/-, etc.)
    if (/^\d*$/.test(val)) {
      setInputValue(val);
      setStock(val === "" ? 0 : Number(val));
    }
  };

  return (
    <section className={styles.container}>
      <label><strong>Stock Count</strong></label>
      <section className={styles.controlGroup}>
        <button
          type="button"
          className={styles.button}
          onClick={() => setStock(Math.max(0, stock - 1))}
        >
          -
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          onChange={handleChange}
          className={styles.input}
        />
        <button
          type="button"
          className={styles.button}
          onClick={() => setStock(stock + 1)}
        >
          +
        </button>
      </section>
    </section>
  );
};

export default StockInput;
