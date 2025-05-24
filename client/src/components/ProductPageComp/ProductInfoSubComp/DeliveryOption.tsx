import styles from "./DeliveryOption.module.css";

// component definition
function DeliveryOption() {
  return (
    <section className={styles["delivery-container"]}>
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
