import React from "react";
import styles from "./ProductDetailsInput.module.css";

// props for description text and setter function
interface Props {
  Details: string;
  setDetails: (details: string) => void;
}

const ProductDetailsInput: React.FC<Props> = ({ Details, setDetails }) => {
  return (
    // container for the product description input
    <section className={styles.container}>
      {/* label for the textarea */}
      <label htmlFor="productDescription">
        <strong>Edit Product Description:</strong>
      </label>

      {/* multiline textarea for entering description */}
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
