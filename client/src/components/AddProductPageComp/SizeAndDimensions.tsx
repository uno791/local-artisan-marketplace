import React from "react";
import styles from "../EditProductPageComp/SizeAndDimensions.module.css";

interface Props {
  Width: string;
  Height: string;
  Weight: string;
  setWidth: (width: string) => void;
  setHeight: (height: string) => void;
  setWeight: (weight: string) => void;
}

const SizeAndDimensions: React.FC<Props> = ({
  Width, setWidth, Height, setHeight, Weight, setWeight
}) => {
  const handleDecimalInput = (
    value: string,
    setter: (val: string) => void
  ) => {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setter(value);
    }
  };

  return (
    <section className={styles.container}>
      <strong>Enter size and dimensions:</strong>
      <section className={styles.group}>
        <section className={styles.fieldGroup}>
          <label htmlFor="width" className={styles.label}>Width (cm):</label>
          <input
            id="width"
            name="width"
            type="text"
            inputMode="decimal"
            maxLength={10}
            pattern="^\d*\.?\d{0,2}$"
            className={styles.input}
            value={Width}
            onChange={(e) => handleDecimalInput(e.target.value, setWidth)}
          />
          <p className={styles.counter}>{Width.length}/10</p>
        </section>

        <section className={styles.fieldGroup}>
          <label htmlFor="height" className={styles.label}>Height (cm):</label>
          <input
            id="height"
            name="height"
            type="text"
            inputMode="decimal"
            maxLength={10}
            pattern="^\d*\.?\d{0,2}$"
            className={styles.input}
            value={Height}
            onChange={(e) => handleDecimalInput(e.target.value, setHeight)}
          />
          <p className={styles.counter}>{Height.length}/10</p>
        </section>

        <section className={styles.fieldGroup}>
          <label htmlFor="weight" className={styles.label}>Weight (kg):</label>
          <input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            maxLength={10}
            pattern="^\d*\.?\d{0,2}$"
            className={styles.input}
            value={Weight}
            onChange={(e) => handleDecimalInput(e.target.value, setWeight)}
          />
          <p className={styles.counter}>{Weight.length}/10</p>
        </section>
      </section>
    </section>
  );
};

export default SizeAndDimensions;
