import React from "react";
import styles from "../EditProductPageComp/ImageEditor.module.css";

const ImageEditor: React.FC = () => {
  return (
    <div className={styles.container}>
      <img src="/placeholder-image.jpg" alt="Product" className={styles.image} />
      <button className={styles.button}>Add Image</button>
    </div>
  );
};

export default ImageEditor;
