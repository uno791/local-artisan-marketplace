import React from "react";
import styles from "./BuyerOrders.module.css";

// props for showing a single order card
interface OrderCardProps {
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
  status: string;
  date: string;
}

function OrderCard(props: OrderCardProps) {
  return (
    // card container for displaying order info
    <article className={styles.orderCard}>
      {/* product image */}
      <figure className={styles.imageBox}>
        <img src={props.imageUrl} alt={props.name} className={styles.image} />
      </figure>

      {/* product name */}
      <p className={styles.name}>{props.name}</p>

      {/* price */}
      <p className={styles.price}>R{props.price}</p>

      {/* quantity */}
      <p className={styles.quantity}>Qty: {props.quantity}</p>

      {/* status with conditional styling */}
      <p
        className={
          props.status.toLowerCase().replace(" ", "") === "delivered"
            ? styles.delivered
            : props.status.toLowerCase().replace(" ", "") === "shipped"
            ? styles.shipped
            : styles.paymentReceived
        }
      >
        {props.status}
      </p>

      {/* order date */}
      <p className={styles.date}>{props.date}</p>
    </article>
  );
}

export { OrderCard };
