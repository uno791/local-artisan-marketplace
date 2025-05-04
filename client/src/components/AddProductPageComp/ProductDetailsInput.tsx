import React from "react";
import styles from "../EditProductPageComp/ProductDetailsInput.module.css";

interface Props {
  Details: string;
  setDetails: (details: string) => void;
}

const ProductDetailsInput: React.FC<Props> = ({ Details, setDetails }) => {
  return (
    <div className={styles.container}>
      <label htmlFor="product-description">
        <strong>Enter Product Description:</strong>
      </label>
      <textarea
        id="product-description"
        rows={6}
        className={styles.textarea}
        value={Details}
        onChange={(e) => setDetails(e.target.value)}
      />
    </div>
  );
};

export default ProductDetailsInput;
