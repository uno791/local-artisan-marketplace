import React from "react";
import styles from "../EditProductPageComp/ProductNameInput.module.css";

interface Props {
  ProdName: string;
  setProdName: (name: string) => void;
}

const ProductNameInput: React.FC<Props> = ({ ProdName, setProdName }) => {
  return (
    <section className={styles.container}>
      <label htmlFor="product-name"><strong>Enter Product Name:</strong></label>
      <input
        id="product-name"
        type="text"
        className={styles.input}
        value={ProdName}
        maxLength={100}
        placeholder="Enter Product Name"
        onChange={(e) => setProdName(e.target.value)}
      />
      <p className={styles.counter}>{ProdName.length}/100</p>
    </section>
  );
};

export default ProductNameInput;
