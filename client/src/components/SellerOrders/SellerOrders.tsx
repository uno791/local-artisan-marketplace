import React from "react";
import styles from "./SellerOrders.module.css";

type OrderStatus = "Payment Received" | "Shipped" | "Delivered";

interface Order {
  name: string;
  price: string;
  quantity: number;
  status: OrderStatus;
  date: string;
}

const currentOrders: Order[] = [
  {
    name: "Sexy Bag",
    price: "R90",
    quantity: 2,
    status: "Payment Received",
    date: "2024-01-15",
  },
  {
    name: "Sexy Bottle",
    price: "R90",
    quantity: 1,
    status: "Shipped",
    date: "2024-01-14",
  },
];

const previousOrders: Order[] = [
  {
    name: "Sexy Bag",
    price: "R90",
    quantity: 3,
    status: "Delivered",
    date: "2024-01-10",
  },
  {
    name: "Sexy Bottle",
    price: "R90",
    quantity: 1,
    status: "Delivered",
    date: "2024-01-09",
  },
  {
    name: "Sexy Bag",
    price: "R90",
    quantity: 2,
    status: "Delivered",
    date: "2024-01-07",
  },
];

const SellerOrders: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2>Current Orders</h2>
      {currentOrders.map((order, index) => (
        <div key={index} className={styles.orderCard}>
          <div>
            {order.name} - {order.price}
          </div>
          <div>Qty: {order.quantity}</div>
          <div>
            Status:{" "}
            <span className={styles[order.status.toLowerCase()]}>
              {order.status}
            </span>
          </div>
          <div>Date: {order.date}</div>
        </div>
      ))}

      <h2>Previous Orders</h2>
      {previousOrders.map((order, index) => (
        <div key={index} className={styles.orderCard}>
          <div>
            {order.name} - {order.price}
          </div>
          <div>Qty: {order.quantity}</div>
          <div>
            Status:{" "}
            <span className={styles[order.status.toLowerCase()]}>
              {order.status}
            </span>
          </div>
          <div>Date: {order.date}</div>
        </div>
      ))}
    </div>
  );
};

export default SellerOrders;
