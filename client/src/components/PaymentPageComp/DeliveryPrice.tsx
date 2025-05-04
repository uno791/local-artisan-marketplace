import * as React from "react";
import styles from "./DeliveryPrice.module.css";

function DeliveryPrice() {
  return (
    <article className={styles.article}>
      <h2 className={styles.h2}>Delivery Fee</h2>
      <p className={styles.p}>R1000000</p>
    </article>
  );
}

export default DeliveryPrice;
