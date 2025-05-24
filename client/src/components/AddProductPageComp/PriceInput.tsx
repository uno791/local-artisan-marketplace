import React, { useState } from "react";
import styles from "../EditProductPageComp/PriceInput.module.css";

interface PriceInputProps {
  Price: string;
  setPrice: (val: string) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({ Price, setPrice }) => {
  const [showWarning, setShowWarning] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val === "") {
      setShowWarning(false);
      setPrice("");
      return;
    }

    const isValidFormat = /^\d*\.?\d{0,2}$/.test(val);
    if (!isValidFormat) return;

    if (parseFloat(val) > 10000000000) {
      setShowWarning(true);
      return;
    }

    setShowWarning(false);
    setPrice(val);
  };

  return (
    <section className={styles.container}>
      <label htmlFor="price-input" className={styles.label}>
        <strong>Price (Rands):</strong>
      </label>
      <section className={styles.inputRow}>
        <input
          id="price-input"
          className={styles.input}
          type="text"
          inputMode="decimal"
          pattern="^\d*\.?\d{0,2}$"
          maxLength={15}
          value={Price}
          onChange={handleChange}
          aria-label="Price in Rands"
        />
      </section>
      <p className={styles.counter}>{Price.length}/15</p>
      {showWarning && <p className={styles.warning}>Max R10,000,000,000</p>}
    </section>
  );
};

export default PriceInput;
