import React from "react";
import styles from "../EditProductPageComp/DeliveryOptionsSelector.module.css";

const DeliveryOptionSelector: React.FC = () => {
  return (
    <section className={styles.container}>
      <h3 className={styles.heading}><strong>Delivery Method</strong></h3>
      <label className={styles.option}>
        <input type="radio" name="delivery" defaultChecked /> Delivery
      </label>
      <label className={styles.option}>
        <input type="radio" name="delivery" /> Pickup
      </label>
    </section>
  );
};

export default DeliveryOptionSelector;
