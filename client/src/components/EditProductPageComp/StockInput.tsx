import React, { useEffect, useState } from "react";
import styles from "./StockInput.module.css";

interface Props {
  stock: number;
  setStock: (stock: number) => void;
}

const StockInput: React.FC<Props> = ({ stock, setStock }) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (stock === 0 && inputValue === "") return;
    setInputValue(stock.toString());
  }, [stock]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setInputValue(val);
      setStock(val === "" ? 0 : Number(val));
    }
  };

  return (
    <section className={styles.container}>
      <label><strong>Stock Count</strong></label>
      <section className={styles.controlGroup}>
        <button type="button" className={styles.button} onClick={() => setStock(Math.max(0, stock - 1))}>-</button>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          className={styles.input}
        />
        <button type="button" className={styles.button} onClick={() => setStock(stock + 1)}>+</button>
      </section>
    </section>
  );
};

export default StockInput;
