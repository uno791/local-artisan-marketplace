import React from "react";
import styles from "../EditProductPageComp/SizeAndDimensions.module.css";

interface props {
  Width: string;
  Height: string;
  Weight: string;
  setWidth: (width: string) => void;
  setHeight: (height: string) => void;
  setWeight: (weight: string) => void;
}

const SizeAndDimensions: React.FC<props> = ({
  Width,
  setWidth,
  Height,
  setHeight,
  Weight,
  setWeight,
}) => {
  return (
    <div className={styles.container}>
      <strong>Enter size and dimensions:</strong>
      <div className={styles.group}>
        <label className={styles.label}>
          Width (cm):
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className={styles.input}
            value={Width}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                setWidth(val);
              }
            }}
          />
        </label>
        <label className={styles.label}>
          Height (cm):
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className={styles.input}
            value={Height}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                setHeight(val);
              }
            }}
          />
        </label>
        <label className={styles.label}>
          Weight (kg):
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className={styles.input}
            value={Weight}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                setWeight(val);
              }
            }}
          />
        </label>
      </div>
    </div>
  );
};

export default SizeAndDimensions;
