import React, { useEffect, useState } from "react";
import styles from "./StockInput.module.css";

// props for current stock value and update function
interface Props {
  stock: number;
  setStock: (stock: number) => void;
}

const StockInput: React.FC<Props> = ({ stock, setStock }) => {
  // local state to hold input field value
  const [inputValue, setInputValue] = useState("");

  // keep input in sync with stock value
  useEffect(() => {
    if (stock === 0 && inputValue === "") return;
    setInputValue(stock.toString());
  }, [stock]);

  // handle numeric input only and update stock
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setInputValue(val);
      setStock(val === "" ? 0 : Number(val));
    }
  };

  return (
    // container for stock input and controls
    <section className={styles.container}>
      <label htmlFor="stockCount">
        <strong>Stock Count</strong>
      </label>

      {/* input field with minus and plus buttons */}
      <section className={styles.controlGroup}>
        {/* decrease stock but not below zero */}
        <button
          type="button"
          className={styles.button}
          onClick={() => setStock(Math.max(0, stock - 1))}
        >
          -
        </button>

        {/* editable input field */}
        <input
          id="stockCount"
          type="text"
          value={inputValue}
          onChange={handleChange}
          className={styles.input}
        />

        {/* increase stock by one */}
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
