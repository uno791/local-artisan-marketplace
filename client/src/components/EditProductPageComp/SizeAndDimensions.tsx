import React, { useState, useEffect } from "react";
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
  const maxLength = 10;

  const [widthText, setWidthText] = useState(Width.toString());
  const [heightText, setHeightText] = useState(Height.toString());
  const [weightText, setWeightText] = useState(Weight.toString());

  useEffect(() => {
    setWidthText(Width.toString());
  }, [Width]);

  useEffect(() => {
    setHeightText(Height.toString());
  }, [Height]);

  useEffect(() => {
    setWeightText(Weight.toString());
  }, [Weight]);

  const handleDecimalInput = (
    value: string,
    setter: (val: number) => void,
    textSetter: (val: string) => void
  ) => {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      textSetter(value);
      setter(value === "" ? 0 : parseFloat(value));
    }
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Enter size and dimensions</h2>

      <section className={styles.group}>
        <section className={styles.fieldGroup}>
          <label htmlFor="width">Width (cm):</label>
          <input
            id="width"
            name="width"
            type="text"
            maxLength={maxLength}
            inputMode="decimal"
            className={styles.input}
            value={widthText}
            onChange={(e) =>
              handleDecimalInput(e.target.value, setWidth, setWidthText)
            }
          />
          <p className={styles.counter} aria-live="polite">
            {widthText.length}/{maxLength}
          </p>
        </section>

        <section className={styles.fieldGroup}>
          <label htmlFor="height">Height (cm):</label>
          <input
            id="height"
            name="height"
            type="text"
            maxLength={maxLength}
            inputMode="decimal"
            className={styles.input}
            value={heightText}
            onChange={(e) =>
              handleDecimalInput(e.target.value, setHeight, setHeightText)
            }
          />
          <p className={styles.counter} aria-live="polite">
            {heightText.length}/{maxLength}
          </p>
        </section>

        <section className={styles.fieldGroup}>
          <label htmlFor="weight">Weight (kg):</label>
          <input
            id="weight"
            name="weight"
            type="text"
            maxLength={maxLength}
            inputMode="decimal"
            className={styles.input}
            value={weightText}
            onChange={(e) =>
              handleDecimalInput(e.target.value, setWeight, setWeightText)
            }
          />
          <p className={styles.counter} aria-live="polite">
            {weightText.length}/{maxLength}
          </p>
        </section>
      </section>
    </section>
  );
};

export default SizeAndDimensions;
