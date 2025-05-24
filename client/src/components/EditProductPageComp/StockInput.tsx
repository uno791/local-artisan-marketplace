import React, { useEffect, useState } from "react";
import styles from "./StockInput.module.css";

interface Props {
  stock: number;
  setStock: (stock: number) => void;
}

const StockInput: React.FC<Props> = ({ stock, setStock }) => {
  const maxLength = 7;
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (stock === 0 && inputValue === "") return;
    setInputValue(stock.toString());
  }, [stock]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val) && val.length <= maxLength) {
      setInputValue(val);
      setStock(val === "" ? 0 : Number(val));
    }
  };

  return (
    <section className={styles.container}>
      <label htmlFor="stockCount"><strong>Stock Count</strong></label>
      <section className={styles.controlGroup}>
        <button
          type="button"
          className={styles.button}
          aria-label="Decrease stock"
          onClick={() => setStock(Math.max(0, stock - 1))}
        >
          -
        </button>
        <input
          id="stockCount"
          name="stockCount"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={maxLength}
          value={inputValue}
          onChange={handleChange}
          className={styles.input}
          aria-describedby="stockCounter"
        />
        <button
          type="button"
          className={styles.button}
          aria-label="Increase stock"
          onClick={() => setStock(stock + 1)}
        >
          +
        </button>
      </section>
      <p id="stockCounter" className={styles.counter} aria-live="polite">
        {inputValue.length}/{maxLength}
      </p>
    </section>
  );
};

export default StockInput;
