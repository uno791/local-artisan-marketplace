import React from "react";
import styles from "./SizeAndDimensions.module.css";

interface Props {
  Width: string;
  Height: string;
  Weight: string;
  setWidth: (width: string) => void;
  setHeight: (height: string) => void;
  setWeight: (weight: string) => void;
}

const SizeAndDimensions: React.FC<Props> = ({
  Width,
  Height,
  Weight,
  setWidth,
  setHeight,
  setWeight,
}) => {
  const handleDecimalInput = (value: string, setter: (val: string) => void) => {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setter(value);
    }
  };

  return (
    <section className={styles.container}>
      <strong>Edit size and dimensions:</strong>
      <section className={styles.group}>
        <label className={styles.label}>
          Width (cm):
          <input
            type="text"
            value={Width}
            onChange={(e) => handleDecimalInput(e.target.value, setWidth)}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Height (cm):
          <input
            type="text"
            value={Height}
            onChange={(e) => handleDecimalInput(e.target.value, setHeight)}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Weight (kg):
          <input
            type="text"
            value={Weight}
            onChange={(e) => handleDecimalInput(e.target.value, setWeight)}
            className={styles.input}
          />
        </label>
      </section>
    </section>
  );
};

export default SizeAndDimensions;
