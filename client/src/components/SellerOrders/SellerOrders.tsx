import React, { useEffect, useState } from "react";
import styles from "./SellerOrders.module.css";
import axios from "axios";
import { useUser } from "../../Users/UserContext";
import { baseURL } from "../../config";

// status values allowed
type OrderStatus = "Payment Received" | "Shipped" | "Delivered";

interface Order {
  order_id: number;
  product_id: number;
  name: string;
  price: string;
  quantity: number;
  status: OrderStatus;
  date: string;
}

const SellerOrders: React.FC = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingStatus, setPendingStatus] = useState<{
    orderId: number;
    productId: number;
    newStatus: OrderStatus;
  } | null>(null);

  // load orders when component mounts
  useEffect(() => {
    if (!user?.username) return;

    axios
      .get(`${baseURL}/seller-orders/${user.username}`)
      .then((res) => {
        const formattedOrders = res.data.map((order: any) => ({
          order_id: order.order_id,
          product_id: order.product_id,
          name: order.product_name,
          price: `R${parseFloat(order.price).toFixed(2)}`,
          quantity: order.quantity,
          status: order.status,
          date: new Date(order.created_at).toISOString().split("T")[0],
        }));
        setOrders(formattedOrders);
      })
      .catch((err) => console.error("❌ failed to load orders:", err));
  }, [user?.username]);

  // triggered when user picks a new status
  const handleStatusChange = (
    order_id: number,
    product_id: number,
    newStatus: OrderStatus
  ) => {
    setPendingStatus({ orderId: order_id, productId: product_id, newStatus });
  };

  // confirms the status update and sends it to server
  const confirmStatusChange = async () => {
    if (!pendingStatus) return;

    try {
      await axios.put(`${baseURL}/update-order-status`, {
        order_id: pendingStatus.orderId,
        product_id: pendingStatus.productId,
        status: pendingStatus.newStatus,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === pendingStatus.orderId &&
          order.product_id === pendingStatus.productId
            ? { ...order, status: pendingStatus.newStatus }
            : order
        )
      );
    } catch (err) {
      console.error("❌ failed to update status:", err);
      alert("failed to update order status.");
    } finally {
      setPendingStatus(null);
    }
  };

  // split current and past orders
  const currentOrders = orders.filter((o) => o.status !== "Delivered");
  const previousOrders = orders.filter((o) => o.status === "Delivered");

  // render a single order card
  const renderOrderCard = (order: Order) => (
    <div
      key={`${order.order_id}-${order.product_id}`}
      className={styles.orderCard}
    >
      <div>
        {order.name} - {order.price}
      </div>
      <div>qty: {order.quantity}</div>
      <div className={styles.statusWrapper}>
        <span>status:</span>
        <select
          value={order.status}
          onChange={(e) =>
            handleStatusChange(
              order.order_id,
              order.product_id,
              e.target.value as OrderStatus
            )
          }
        >
          <option value="Payment Received">payment received</option>
          <option value="Shipped">shipped</option>
          <option value="Delivered">delivered</option>
        </select>
      </div>
      <div>date: {order.date}</div>

      <div
        className={`${styles.statusDot} ${
          styles[order.status.toLowerCase().replace(/\s/g, "") + "Dot"]
        }`}
      />
    </div>
  );

  return (
    <main className={styles.container}>
      <h2>current orders</h2>
      {currentOrders.length === 0 ? (
        <p>no current orders.</p>
      ) : (
        currentOrders.map(renderOrderCard)
      )}

      <h2>previous orders</h2>
      {previousOrders.length === 0 ? (
        <p>no previous orders.</p>
      ) : (
        previousOrders.map(renderOrderCard)
      )}

      {pendingStatus && (
        <aside className={styles.modalBackdrop}>
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-change-confirmation"
          >
            <p id="status-change-confirmation">
              are you sure you want to change status to{" "}
              <strong>{pendingStatus.newStatus}</strong>?
            </p>
            <footer className={styles.modalActions}>
              <button onClick={confirmStatusChange}>confirm</button>
              <button onClick={() => setPendingStatus(null)}>cancel</button>
            </footer>
          </section>
        </aside>
      )}
    </main>
  );
};

export default SellerOrders;
