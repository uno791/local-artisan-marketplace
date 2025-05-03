import React from "react";
import { OrderCard } from "../components/BuyerOrdersComp/OrderCard";
import styles from "../components/BuyerOrdersComp/BuyerOrders.module.css";

// Sample data for current and previous orders
const currentOrders = [
  {
    imageUrl: "https://via.placeholder.com/60",
    name: "Sexy Bag",
    price: 90,
    quantity: 2,
    status: "Payment Received",
    date: "2024-01-15",
  },
  {
    imageUrl: "https://via.placeholder.com/60",
    name: "Sexy Bottle",
    price: 90,
    quantity: 1,
    status: "Shipped",
    date: "2024-01-14",
  },
];

const previousOrders = [
  {
    imageUrl: "https://via.placeholder.com/60",
    name: "Sexy Bag",
    price: 90,
    quantity: 3,
    status: "Delivered",
    date: "2024-01-10",
  },
  {
    imageUrl: "https://via.placeholder.com/60",
    name: "Sexy Bottle",
    price: 90,
    quantity: 1,
    status: "Delivered",
    date: "2024-01-08",
  },
  {
    imageUrl: "https://via.placeholder.com/60",
    name: "Sexy Bag",
    price: 90,
    quantity: 2,
    status: "Delivered",
    date: "2024-01-05",
  },
];

function BuyerOrders() {
  return (
    <main className={styles.wrapper}>

      <section>
        <h2>Current Orders</h2>

        {currentOrders.map(function (order, index) {
          return (
            <OrderCard
              key={index}
              imageUrl={order.imageUrl}
              name={order.name}
              price={order.price}
              quantity={order.quantity}
              status={order.status}
              date={order.date}
            />
          );
        })}
      </section>

      <section>
        <h2>Previous Orders</h2>

        {previousOrders.map(function (order, index) {
          return (
            <OrderCard
              key={index}
              imageUrl={order.imageUrl}
              name={order.name}
              price={order.price}
              quantity={order.quantity}
              status={order.status}
              date={order.date}
            />
          );
        })}
      </section>

    </main>
  );
}

export default BuyerOrders;
