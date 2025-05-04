import React from "react";
import styles from "./SizeAndDimensions.module.css";

interface Props {
  Width: number;
  Height: number;
  Weight: number;
  setWidth: (w: number) => void;
  setHeight: (h: number) => void;
  setWeight: (w: number) => void;
}

const SizeAndDimensions: React.FC<Props> = ({
  Width,
  Height,
  Weight,
  setWidth,
  setHeight,
  setWeight,
}) => {
  return (
    <section className={styles.container}>
      <strong>Edit size and dimensions:</strong>
      <section className={styles.group}>
        <label className={styles.label} htmlFor="width">
          Width (cm):
        </label>
        <input
          className={styles.input}
          id="width"
          type="number"
          value={Width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />

        <label className={styles.label} htmlFor="height">
          Height (cm):
        </label>
        <input
          className={styles.input}
          id="height"
          type="number"
          value={Height}
          onChange={(e) => setHeight(Number(e.target.value))}
        />

        <label className={styles.label} htmlFor="weight">
          Weight (kg):
        </label>
        <input
          className={styles.input}
          id="weight"
          type="number"
          value={Weight}
          onChange={(e) => setWeight(Number(e.target.value))}
        />
      </section>
    </section>
  );
};

export default SizeAndDimensions;
