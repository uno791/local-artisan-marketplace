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
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.username) return;

      try {
        const res = await axios.get(`${baseURL}/orders/${user.username}`);
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
        setError("Failed to load orders.");
      }
    };

    fetchOrders();
  }, [user?.username]);

  const currentOrders = orders.filter((o) => o.status !== "Delivered");
  const previousOrders = orders.filter((o) => o.status === "Delivered");

  return (
    <main className={styles.wrapper}>
      <section>
        <h2>Current Orders</h2>
        {currentOrders.length === 0 && <p>No current orders.</p>}
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

      <section>
        <h2>Previous Orders</h2>
        {previousOrders.length === 0 && <p>No previous orders.</p>}
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

      {error && <p>{error}</p>}
    </main>
  );
}

export default BuyerOrders;
