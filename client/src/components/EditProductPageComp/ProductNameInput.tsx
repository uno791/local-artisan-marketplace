import React from "react";
import styles from "./ProductNameInput.module.css";

interface Props {
  ProdName: string;
  setProdName: (name: string) => void;
}

const ProductNameInput: React.FC<Props> = ({ ProdName, setProdName }) => {
  return (
    <section className={styles.container}>
      <label><strong>Edit Product Name:</strong></label>
      <input
        type="text"
        value={ProdName}
        onChange={(e) => setProdName(e.target.value)}
        className={styles.input}
      />
    </section>
  );
};

export default ProductNameInput;
