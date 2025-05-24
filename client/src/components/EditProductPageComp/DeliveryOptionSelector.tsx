import React from "react";
import styles from "./DeliveryOptionsSelector.module.css";

interface Props {
  DelMethod: number;
  setDelMethod: (method: number) => void;
}

const DeliveryOptionSelector: React.FC<Props> = ({ DelMethod, setDelMethod }) => {
  const toggleOption = (optionValue: number) => {
    const newValue = DelMethod ^ optionValue; // toggles the bit
    setDelMethod(newValue);
  };
  return (
    <section className={styles.container}>
      <h3 className={styles.heading}><strong>Delivery Method</strong></h3>
      <label className={styles.option}>
        <input
          type="checkbox"
          name="delivery"
          checked={(DelMethod & 1) !== 0}
          onChange={() => toggleOption(1)}
        />
        Delivery
      </label>
      <label className={styles.option}>
        <input
          type="checkbox"
          name="delivery"
          checked={(DelMethod & 2) !== 0}
          onChange={() => toggleOption(2)}
        />
        Pickup
      </label>
    </section>
  );
};

export default DeliveryOptionSelector;
