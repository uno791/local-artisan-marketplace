import "./DeliveryOption.css";

function DeliveryOption() {
  return (
    <section className="delivery-container">
      <select className="delivery-select" defaultValue="">
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
