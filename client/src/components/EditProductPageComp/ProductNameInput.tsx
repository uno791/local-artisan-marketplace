import React from "react";
import styles from "./ProductNameInput.module.css";

interface Props {
  ProdName: string;
  setProdName: (name: string) => void;
}

const ProductNameInput: React.FC<Props> = ({ ProdName, setProdName }) => {
  const maxLength = 100;

  return (
    <section className={styles.container}>
      <label htmlFor="productName">
        <strong>Edit Product Name:</strong>
      </label>
      <input
        id="productName"
        name="productName"
        type="text"
        maxLength={maxLength}
        value={ProdName}
        onChange={(e) => setProdName(e.target.value)}
        className={styles.input}
      />
      <p className={styles.counter} aria-live="polite">
        {ProdName.length}/{maxLength}
      </p>
    </section>
  );
};

export default ProductNameInput;
