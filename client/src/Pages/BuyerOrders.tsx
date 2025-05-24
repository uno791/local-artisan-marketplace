// import dependencies and components
import React, { useEffect, useState } from "react";
import { OrderCard } from "../components/BuyerOrdersComp/OrderCard";
import styles from "../components/BuyerOrdersComp/BuyerOrders.module.css";
import axios from "axios";
import { baseURL } from "../config";
import { useUser } from "../Users/UserContext";

// type definition for an order item
interface OrderItem {
  image_url: string;
  product_name: string;
  price: number;
  quantity: number;
  status: string;
  created_at: string;
}

// main component for buyer order history
function BuyerOrders() {
  // get logged-in user from context
  const { user } = useUser();

  // state for list of orders
  const [orders, setOrders] = useState<OrderItem[]>([]);

  // state for error message
  const [error, setError] = useState<string | null>(null);

  // fetch orders when username is available
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

  // filter current and delivered orders
  const currentOrders = orders.filter((o) => o.status !== "Delivered");
  const previousOrders = orders.filter((o) => o.status === "Delivered");

  return (
    <main className={styles.wrapper}>
      <section>
        {/* section for current (non-delivered) orders */}
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
        {/* section for delivered (past) orders */}
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

      {/* show error if any */}
      {error && <p>{error}</p>}
    </main>
  );
}

export default BuyerOrders;
