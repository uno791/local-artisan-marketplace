import React, { useEffect, useState } from "react";
import styles from "./PriceInput.module.css";

interface Props {
  Price: number;
  setPrice: (price: number) => void;
}

const PriceInput: React.FC<Props> = ({ Price, setPrice }) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (Price === 0 && inputValue === "") return;
    setInputValue(Price.toString());
  }, [Price]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(val)) {
      setInputValue(val);
      setPrice(val === "" || val === "." ? 0 : Number(val));
    }
  };

  return (
    <section className={styles.container}>
      <label><strong>Price (Rands):</strong></label>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        className={styles.input}
      />
    </section>
  );
};

export default PriceInput;
