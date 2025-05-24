import React from "react";
import styles from "../EditProductPageComp/DeliveryOptionsSelector.module.css";

// props interface
interface props {
  DelMethod: boolean;
  setDelMethod: (method: boolean) => void;
}

// component definition
const DeliveryOptionSelector: React.FC<props> = ({
  DelMethod,
  setDelMethod,
}) => {
  return (
    <section className={styles.container}>
      <h3 className={styles.heading}>
        <strong>Delivery Method</strong>
      </h3>

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
