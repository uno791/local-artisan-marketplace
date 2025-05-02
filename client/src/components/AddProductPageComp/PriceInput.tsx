import React from "react";
import styles from "../EditProductPageComp/PriceInput.module.css";

interface props {
  Price: number;
  setPrice: (price: number) => void;
}

const PriceInput: React.FC<props> = ({ Price, setPrice }) => {
  const [inputValue, setInputValue] = React.useState<string>("");

  // Sync input with external Price value on mount or update
  React.useEffect(() => {
    if (Price === 0 && inputValue === "") return;
    setInputValue(Price.toString());
  }, [Price]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Allow numbers with optional . and max 2 decimals
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
        inputMode="decimal"
        className={styles.input}
        value={inputValue}
        onChange={handleChange}
      />
    </section>
  );
};

export default PriceInput;
