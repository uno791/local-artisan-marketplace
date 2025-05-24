import React, { useState } from "react";
import styles from "./PriceInput.module.css";

// props for current price value and setter
interface PriceInputProps {
  Price: number;
  setPrice: (val: number) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({ Price, setPrice }) => {
  // warning state for high price input
  const [showWarning, setShowWarning] = useState(false);

  // handle input change and validate price
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
    // price input container
    <section className={styles.container}>
      {/* label for the input */}
      <label htmlFor="price-input" className={styles.label}>
        <strong>Price (Rands):</strong>
      </label>

      {/* input field for price */}
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

      {/* show warning if price exceeds limit */}
      {showWarning && <p className={styles.warning}>Max R10,000,000,000</p>}
    </section>
  );
};

export default PriceInput;
