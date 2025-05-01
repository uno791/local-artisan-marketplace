import React from "react";
import styles from "./ProductNameInput.module.css";

const ProductNameInput: React.FC = () => {
  return (
    <div className={styles.container}>
      <label><strong>Edit Product Name:</strong></label>
      <input type="text" className={styles.input} />
    </div>
  );
};

export default ProductNameInput;
