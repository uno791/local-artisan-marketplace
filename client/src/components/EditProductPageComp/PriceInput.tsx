import React, { useState } from "react";
import styles from "./PriceInput.module.css";

interface PriceInputProps {
  Price: number;
  setPrice: (val: number) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({ Price, setPrice }) => {
  const [inputVal, setInputVal] = useState(Price.toString());
  const [showWarning, setShowWarning] = useState(false);
  const maxLength = 15;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (/^\d*\.?\d{0,2}$/.test(val)) {
      const parsed = parseFloat(val);
      if (!isNaN(parsed) && parsed > 10000000000) {
        setShowWarning(true);
        return;
      }

      setShowWarning(false);
      setInputVal(val);
      setPrice(val === "" ? 0 : parsed);
    }
  };

  return (
    <section className={styles.container}>
      <label htmlFor="price-input">
        <strong>Price (Rands):</strong>
      </label>
      <input
        id="price-input"
        name="price"
        type="text"
        inputMode="decimal"
        value={inputVal}
        onChange={handleChange}
        maxLength={maxLength}
        aria-describedby="priceLimit priceCounter"
        className={styles.input}
      />
      <p id="priceCounter" className={styles.counter} aria-live="polite">
        {inputVal.length}/{maxLength}
      </p>
      {showWarning && (
        <p id="priceLimit" className={styles.warning}>
          Max R10,000,000,000
        </p>
      )}
    </section>
  );
};

export default PriceInput;
