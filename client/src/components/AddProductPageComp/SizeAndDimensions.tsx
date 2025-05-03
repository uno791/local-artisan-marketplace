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
  const handleDecimalInput = (
    value: string,
    setter: (val: string) => void
  ) => {
    // Regex to allow numbers with optional 1 or 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div className={styles.container}>
      <strong>Enter size and dimensions:</strong>
      <div className={styles.group}>
        <label className={styles.label}>
          Width (cm):
          <input
            type="text"
            inputMode="decimal"
            pattern="^\d*\.?\d{0,2}$"
            className={styles.input}
            value={Width}
            onChange={(e) => handleDecimalInput(e.target.value, setWidth)}
          />
        </label>
        <label className={styles.label}>
          Height (cm):
          <input
            type="text"
            inputMode="decimal"
            pattern="^\d*\.?\d{0,2}$"
            className={styles.input}
            value={Height}
            onChange={(e) => handleDecimalInput(e.target.value, setHeight)}
          />
        </label>
        <label className={styles.label}>
          Weight (kg):
          <input
            type="text"
            inputMode="decimal"
            pattern="^\d*\.?\d{0,2}$"
            className={styles.input}
            value={Weight}
            onChange={(e) => handleDecimalInput(e.target.value, setWeight)}
          />
        </label>
      </div>
    </div>
  );
};

export default SizeAndDimensions;
