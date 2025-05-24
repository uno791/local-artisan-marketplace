import React from "react";
import styles from "./DeliveryOptionsSelector.module.css";

// props include current delivery method (as a bit flag) and setter
interface Props {
  DelMethod: number;
  setDelMethod: (method: number) => void;
}

const DeliveryOptionSelector: React.FC<Props> = ({
  DelMethod,
  setDelMethod,
}) => {
  // toggles a delivery option using bitwise xor
  const toggleOption = (optionValue: number) => {
    const newValue = DelMethod ^ optionValue; // toggles the bit
    setDelMethod(newValue);
  };

  return (
    // container for delivery method checkboxes
    <section className={styles.container}>
      <h3 className={styles.heading}>
        <strong>Delivery Method</strong>
      </h3>

      {/* checkbox for delivery option (bit 1) */}
      <label className={styles.option}>
        <input
          type="checkbox"
          name="delivery"
          checked={(DelMethod & 1) !== 0}
          onChange={() => toggleOption(1)}
        />
        Delivery
      </label>

      {/* checkbox for pickup option (bit 2) */}
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
