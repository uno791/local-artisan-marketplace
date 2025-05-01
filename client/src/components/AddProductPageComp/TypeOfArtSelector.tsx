import React from "react";
import styles from "../EditProductPageComp/TypeOfArtSelector.module.css";

const TypeOfArtSelector: React.FC = () => {
  return (
    <div className={styles.container}>
      <label><strong>Type of Art:</strong></label>
      <select className={styles.select}>
        <option>Menu Label</option>
        <option>Painting</option>
        <option>Sculpture</option>
        <option>Photography</option>
        <option>Digital Art</option>
      </select>
    </div>
  );
};

export default TypeOfArtSelector;
