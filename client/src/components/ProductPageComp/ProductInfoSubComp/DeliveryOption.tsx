import styles from "./DeliveryOption.module.css";

function DeliveryOption() {
  return (
    // container for delivery method dropdown
    <section className={styles["delivery-container"]}>
      {/* select input for choosing delivery or pickup */}
      <select className={styles["delivery-select"]} defaultValue="">
        <option value="" disabled>
          Delivery or Pickup
        </option>
        <option value="delivery">Delivery</option>
        <option value="pickup">Pickup</option>
      </select>
    </section>
  );
}

export default DeliveryOption;
