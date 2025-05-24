import React from "react";
import styles from "./BuyerOrders.module.css";

// props interface
interface OrderCardProps {
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
  status: string;
  date: string;
}

// component definition
function OrderCard(props: OrderCardProps) {
  return (
    <article className={styles.orderCard}>
      <figure className={styles.imageBox}>
        <img src={props.imageUrl} alt={props.name} className={styles.image} />
      </figure>

      <p className={styles.name}>{props.name}</p>
      <p className={styles.price}>R{props.price}</p>
      <p className={styles.quantity}>Qty: {props.quantity}</p>
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
      <p className={styles.date}>{props.date}</p>
    </article>
  );
}

export { OrderCard };
