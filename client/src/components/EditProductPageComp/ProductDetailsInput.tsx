import React from "react";
import styles from "./ProductDetailsInput.module.css";

interface Props {
  Details: string;
  setDetails: (details: string) => void;
}

const ProductDetailsInput: React.FC<Props> = ({ Details, setDetails }) => {
  return (
    <section className={styles.container}>
      <label htmlFor="productDescription">
  <strong>Edit Product Description:</strong>
</label>
      <textarea
        id="productDescription"
        rows={6}
        value={Details}
        onChange={(e) => setDetails(e.target.value)}
        className={styles.textarea}
      />
    </section>
  );
};

export default ProductDetailsInput;
