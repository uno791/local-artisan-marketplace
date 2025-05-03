import React from "react";
import styles from "./DeliveryOptionsSelector.module.css";

interface Props {
  DelMethod: boolean;
  setDelMethod: (method: boolean) => void;
}

const DeliveryOptionSelector: React.FC<Props> = ({ DelMethod, setDelMethod }) => {
  return (
    <section className={styles.container}>
      <h3 className={styles.heading}><strong>Delivery Method</strong></h3>
      <label className={styles.option}>
        <input
          type="radio"
          name="delivery"
          checked={DelMethod === true}
          onChange={() => setDelMethod(true)}
        />
        Delivery
      </label>
      <label className={styles.option}>
        <input
          type="radio"
          name="delivery"
          checked={DelMethod === false}
          onChange={() => setDelMethod(false)}
        />
        Pickup
      </label>
    </section>
  );
};

export default DeliveryOptionSelector;
