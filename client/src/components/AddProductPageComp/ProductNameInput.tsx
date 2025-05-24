import React from "react";
import styles from "../EditProductPageComp/ProductNameInput.module.css";

interface Props {
  ProdName: string;
  setProdName: (name: string) => void;
}

const ProductNameInput: React.FC<Props> = ({ ProdName, setProdName }) => {
  return (
    <div className={styles.container}>
      <label>
        <strong>Enter Product Name:</strong>
      </label>
      <input
        type="text"
        className={styles.input}
        value={ProdName}
        placeholder="Enter Product Name"
        onChange={(e) => setProdName(e.target.value)}
      />
    </div>
  );
};

export default ProductNameInput;
