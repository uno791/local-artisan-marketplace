import React from "react";
import styles from "../EditProductPageComp/ProductDetailsInput.module.css";

// props for product description value and update function
interface Props {
  Details: string;
  setDetails: (details: string) => void;
}

const ProductDetailsInput: React.FC<Props> = ({ Details, setDetails }) => {
  return (
    <section className={styles.container}>
      <label htmlFor="product-description">
        <strong>Enter Product Description:</strong>
      </label>

      {/* multiline input for product description */}
      <textarea
        id="product-description"
        rows={6}
        maxLength={1000}
        className={styles.textarea}
        value={Details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Enter a detailed product description"
      />
      <p className={styles.counter}>{Details.length}/1000</p>
    </section>
  );
};

export default ProductDetailsInput;
