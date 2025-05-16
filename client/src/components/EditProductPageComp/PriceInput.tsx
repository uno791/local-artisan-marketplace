import React, { useState } from 'react';
import styles from './PriceInput.module.css';

interface PriceInputProps {
  Price: number;
  setPrice: (val: number) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({ Price, setPrice }) => {
  const [showWarning, setShowWarning] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (val > 10000000000) {
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
      <div className={styles.inputRow}>
        <input
          id="price-input"
          className={styles.input}
          type="text"
          inputMode="decimal"
          value={Price}
          onChange={handleChange}
          aria-label="Price (Rands)"
        />
      </div>
      {showWarning && (
        <p className={styles.warning}>Max R10,000,000,000</p>
      )}
    </section>
  );
};

export default PriceInput;
