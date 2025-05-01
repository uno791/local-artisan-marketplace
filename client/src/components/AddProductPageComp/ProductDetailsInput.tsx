import React from "react";
import styles from "../EditProductPageComp/ProductDetailsInput.module.css";

const ProductDetailsInput: React.FC = () => {
  return (
    <div className={styles.container}>
      <label><strong>Enter Product Details:</strong></label>
      <textarea rows={6} className={styles.textarea} />
    </div>
  );
};

export default ProductDetailsInput;
