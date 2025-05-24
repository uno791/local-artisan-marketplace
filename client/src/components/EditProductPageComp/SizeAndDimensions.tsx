import React from "react";
import styles from "./SizeAndDimensions.module.css";

interface Props {
  Width: number;
  Height: number;
  Weight: number;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setWeight: (weight: number) => void;
}

const SizeAndDimensions: React.FC<Props> = ({
  Width,
  Height,
  Weight,
  setWidth,
  setHeight,
  setWeight,
}) => {
  const handleDecimalInput = (
    value: string,
    setter: (val: number) => void
  ) => {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setter(Number(value));
    }
  };

  return (
    <section className={styles.container}>
      <strong>Enter size and dimensions:</strong>
      <div className={styles.group}>
        <div className={styles.fieldGroup}>
          <label htmlFor="width" className={styles.label}>Width (cm):</label>
          <input
            id="width"
            type="text"
            inputMode="decimal"
            className={styles.input}
            value={Width}
            onChange={(e) => handleDecimalInput(e.target.value, setWidth)}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="height" className={styles.label}>Height (cm):</label>
          <input
            id="height"
            type="text"
            inputMode="decimal"
            className={styles.input}
            value={Height}
            onChange={(e) => handleDecimalInput(e.target.value, setHeight)}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="weight" className={styles.label}>Weight (kg):</label>
          <input
            id="weight"
            type="text"
            inputMode="decimal"
            className={styles.input}
            value={Weight}
            onChange={(e) => handleDecimalInput(e.target.value, setWeight)}
          />
        </div>
      </div>
    </section>
  );
};

export default SizeAndDimensions;
