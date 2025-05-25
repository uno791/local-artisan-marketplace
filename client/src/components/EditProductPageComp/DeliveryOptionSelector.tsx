import React from "react";
import styles from "./DeliveryOptionsSelector.module.css";

interface Props {
  DelMethod: number;
  setDelMethod: (method: number) => void;
}

const DeliveryOptionSelector: React.FC<Props> = ({ DelMethod, setDelMethod }) => {
  const handleChange = (option: number, checked: boolean) => {
    let newMethod = DelMethod;

    if (checked) {
      newMethod |= option; // set the bit
    } else {
      newMethod &= ~option; // clear the bit
    }

    // Prevent setting to 0 (no option selected)
    setDelMethod(newMethod === 0 ? 1 : newMethod);
  };

  return (
    <section className={styles.container}>
      <h3 className={styles.heading}><strong>Delivery Method</strong></h3>
      <label className={styles.option}>
        <input
          type="checkbox"
          name="delivery"
          checked={(DelMethod & 1) !== 0}
          onChange={(e) => handleChange(1, e.target.checked)}
        />
        Delivery
      </label>
      <label className={styles.option}>
        <input
          type="checkbox"
          name="pickup"
          checked={(DelMethod & 2) !== 0}
          onChange={(e) => handleChange(2, e.target.checked)}
        />
        Pickup
      </label>
    </section>
  );
};

export default DeliveryOptionSelector;
