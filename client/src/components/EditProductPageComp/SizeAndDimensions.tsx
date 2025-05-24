import React from "react";
import styles from "./SizeAndDimensions.module.css";

// props for width height weight values and their update functions
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
  // only allow valid decimal input with up to 2 decimals
  const handleDecimalInput = (value: string, setter: (val: number) => void) => {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setter(Number(value));
    }
  };

  return (
    // grouped form section for dimensions
    <fieldset className={styles.container}>
      <legend>
        <strong>Enter size and dimensions:</strong>
      </legend>

      {/* list of input fields */}
      <ul
        className={styles.group}
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {/* width input */}
        <li className={styles.fieldGroup}>
          <label htmlFor="width" className={styles.label}>
            Width (cm):
          </label>
          <input
            id="width"
            type="text"
            inputMode="decimal"
            className={styles.input}
            value={Width}
            onChange={(e) => handleDecimalInput(e.target.value, setWidth)}
          />
        </li>

        {/* height input */}
        <li className={styles.fieldGroup}>
          <label htmlFor="height" className={styles.label}>
            Height (cm):
          </label>
          <input
            id="height"
            type="text"
            inputMode="decimal"
            className={styles.input}
            value={Height}
            onChange={(e) => handleDecimalInput(e.target.value, setHeight)}
          />
        </li>

        {/* weight input */}
        <li className={styles.fieldGroup}>
          <label htmlFor="weight" className={styles.label}>
            Weight (kg):
          </label>
          <input
            id="weight"
            type="text"
            inputMode="decimal"
            className={styles.input}
            value={Weight}
            onChange={(e) => handleDecimalInput(e.target.value, setWeight)}
          />
        </li>
      </ul>
    </fieldset>
  );
};

export default SizeAndDimensions;
