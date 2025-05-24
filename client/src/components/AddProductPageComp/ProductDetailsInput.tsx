import React from "react";
import styles from "../EditProductPageComp/ProductDetailsInput.module.css";

// props for product description value and update function
interface Props {
  Details: string;
  setDetails: (details: string) => void;
}

const ProductDetailsInput: React.FC<Props> = ({ Details, setDetails }) => {
  return (
    // container for description input
    <div className={styles.container}>
      {/* label for textarea */}
      <label htmlFor="product-description">
        <strong>Enter Product Description:</strong>
      </label>

      {/* multiline input for product description */}
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
