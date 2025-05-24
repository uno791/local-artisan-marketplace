import React from "react";
import styles from "./ProductNameInput.module.css";

// props for product name value and update function
interface Props {
  ProdName: string;
  setProdName: (name: string) => void;
}

const ProductNameInput: React.FC<Props> = ({ ProdName, setProdName }) => {
  return (
    // container for product name input field
    <section className={styles.container}>
      {/* label for the input */}
      <label htmlFor="productName">
        <strong>Edit Product Name:</strong>
      </label>

      {/* input field for product name */}
      <input
        id="productName"
        type="text"
        value={ProdName}
        onChange={(e) => setProdName(e.target.value)}
        className={styles.input}
      />
    </section>
  );
};

export default ProductNameInput;
