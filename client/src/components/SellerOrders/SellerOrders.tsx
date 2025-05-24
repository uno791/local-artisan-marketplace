import React, { useEffect, useState } from "react";
import styles from "./SellerOrders.module.css";
import axios from "axios";
import { useUser } from "../../Users/UserContext";
import { baseURL } from "../../config";

// allowed order statuses
type OrderStatus = "Payment Received" | "Shipped" | "Delivered";

// shape of an order object
interface Order {
  order_id: number;
  product_id: number;
  name: string;
  price: string;
  quantity: number;
  status: OrderStatus;
  date: string;
}

// main component to show current and previous orders
const SellerOrders: React.FC = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingStatus, setPendingStatus] = useState<{
    orderId: number;
    productId: number;
    newStatus: OrderStatus;
  } | null>(null);

  // fetch orders on component mount or when username changes
  useEffect(() => {
    if (!user?.username) return;

    axios
      .get(`${baseURL}/seller-orders/${user.username}`)
      .then((res) => {
        // format order data for display
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
      .catch((err) => console.error("❌ Failed to load orders:", err));
  }, [user?.username]);

  // temporarily store status change before confirmation
  const handleStatusChange = (
    order_id: number,
    product_id: number,
    newStatus: OrderStatus
  ) => {
    setPendingStatus({ orderId: order_id, productId: product_id, newStatus });
  };

  // confirm and submit new order status
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
      console.error("❌ Failed to update status:", err);
      alert("Failed to update order status.");
    } finally {
      setPendingStatus(null);
    }
  };

  // filter into current and previous orders
  const currentOrders = orders.filter((o) => o.status !== "Delivered");
  const previousOrders = orders.filter((o) => o.status === "Delivered");

  // card ui for displaying order
  const renderOrderCard = (order: Order) => (
    <div
      key={`${order.order_id}-${order.product_id}`}
      className={styles.orderCard}
    >
      <div>
        {order.name} - {order.price}
      </div>
      <div>Qty: {order.quantity}</div>
      <div className={styles.statusWrapper}>
        <span>Status:</span>
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
          <option value="Payment Received">Payment Received</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>
      <div>Date: {order.date}</div>

      {/* color dot for order status */}
      <div
        className={`${styles.statusDot} ${
          styles[order.status.toLowerCase().replace(/\s/g, "") + "Dot"]
        }`}
      />
    </div>
  );

  return (
    <main className={styles.container}>
      <h2>Current Orders</h2>
      {currentOrders.length === 0 ? (
        <p>No current orders.</p>
      ) : (
        currentOrders.map(renderOrderCard)
      )}

      <h2>Previous Orders</h2>
      {previousOrders.length === 0 ? (
        <p>No previous orders.</p>
      ) : (
        previousOrders.map(renderOrderCard)
      )}

      {/* confirm dialog for status change */}
      {pendingStatus && (
        <aside className={styles.modalBackdrop}>
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-change-confirmation"
          >
            <p id="status-change-confirmation">
              Are you sure you want to change status to{" "}
              <strong>{pendingStatus.newStatus}</strong>?
            </p>
            <footer className={styles.modalActions}>
              <button onClick={confirmStatusChange}>Confirm</button>
              <button onClick={() => setPendingStatus(null)}>Cancel</button>
            </footer>
          </section>
        </aside>
      )}
    </main>
  );
};

export default SellerOrders;
