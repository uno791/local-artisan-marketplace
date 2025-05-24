import React, { useEffect, useState } from "react";
import { OrderCard } from "../components/BuyerOrdersComp/OrderCard";
import styles from "../components/BuyerOrdersComp/BuyerOrders.module.css";
import axios from "axios";
import { baseURL } from "../config";
import { useUser } from "../Users/UserContext";

interface OrderItem {
  image_url: string;
  product_name: string;
  price: number;
  quantity: number;
  status: string;
  created_at: string;
}

function BuyerOrders() {
  const { user } = useUser();
  // state for orders and error message
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // fetch orders when username changes
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.username) return;

      try {
        const res = await axios.get(`${baseURL}/orders/${user.username}`);
        setOrders(res.data);
      } catch (err) {
        console.error("❌ failed to fetch orders:", err);
        setError("failed to load orders.");
      }
    };

    fetchOrders();
  }, [user?.username]);

  // separate current and previous orders by status
  const currentOrders = orders.filter((o) => o.status !== "Delivered");
  const previousOrders = orders.filter((o) => o.status === "Delivered");

  return (
    <main className={styles.wrapper}>
      {/* current orders section */}
      <section>
        <h2>current orders</h2>
        {currentOrders.length === 0 && <p>no current orders.</p>}
        {currentOrders.map((order, index) => (
          <OrderCard
            key={index}
            imageUrl={order.image_url}
            name={order.product_name}
            price={order.price}
            quantity={order.quantity}
            status={order.status}
            date={order.created_at.split("T")[0]}
          />
        ))}
      </section>

      {/* previous orders section */}
      <section>
        <h2>previous orders</h2>
        {previousOrders.length === 0 && <p>no previous orders.</p>}
        {previousOrders.map((order, index) => (
          <OrderCard
            key={index}
            imageUrl={order.image_url}
            name={order.product_name}
            price={order.price}
            quantity={order.quantity}
            status={order.status}
            date={order.created_at.split("T")[0]}
          />
        ))}
      </section>

      {/* error display */}
      {error && <p>{error}</p>}
    </main>
  );
}

export default BuyerOrders;
