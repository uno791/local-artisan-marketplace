import React from "react";
import styles from "./SizeAndDimensions.module.css";

const SizeAndDimensions: React.FC = () => {
  return (
    <div className={styles.container}>
      <strong>Edit size and dimensions:</strong>
      <div className={styles.group}>
        <label className={styles.label}>
          Width:
          <input type="number" min="0" defaultValue={1} className={styles.input} />
        </label>
        <label className={styles.label}>
          Height:
          <input type="number" min="0" defaultValue={1} className={styles.input} />
        </label>
        <label className={styles.label}>
          Weight(kg):
          <input type="number" min="0" defaultValue={1} className={styles.input} />
        </label>
      </div>
    </div>
  );
};

export default SizeAndDimensions;
