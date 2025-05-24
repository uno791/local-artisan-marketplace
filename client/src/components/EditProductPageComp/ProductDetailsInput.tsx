import React from "react";
import styles from "./ProductDetailsInput.module.css";

interface Props {
  Details: string;
  setDetails: (details: string) => void;
}

const ProductDetailsInput: React.FC<Props> = ({ Details, setDetails }) => {
  const maxLength = 1000;

  return (
    <section className={styles.container}>
      <label htmlFor="productDescription">
        <strong>Edit Product Description:</strong>
      </label>
      <textarea
        id="productDescription"
        name="productDescription"
        rows={6}
        maxLength={maxLength}
        value={Details}
        onChange={(e) => setDetails(e.target.value)}
        className={styles.textarea}
        placeholder="Enter a detailed product description"
      />
      <p className={styles.counter} aria-live="polite">
        {Details.length}/{maxLength}
      </p>
    </section>
  );
};

export default ProductDetailsInput;
