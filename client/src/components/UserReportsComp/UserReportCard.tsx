import React, { useState } from "react";
import axios from "axios";
import styles from "./UserReportCard.module.css";
import { baseURL } from "../../config";

type UserReportCardProps = {
  status: number;
  date: string;
  reporter: string;
  seller: string;
  product: string;
  reason: string;
  details: string;
  productId: number;
};

const statusToLabel: Record<number, string> = {
  0: "pending",
  1: "investigating",
  2: "decision",
  3: "complete",
};

const UserReportCard: React.FC<UserReportCardProps> = ({
  status: initialStatus,
  date,
  reporter,
  seller,
  product,
  reason,
  details,
  productId,
}) => {
  const [status, setStatus] = useState<number>(initialStatus);
  const [updating, setUpdating] = useState(false);
  const [popup, setPopup] = useState<{ type: "error"; message: string } | null>(
    null
  );
  const [actionCompleted, setActionCompleted] = useState(false);

  const label = statusToLabel[status] ?? "unknown";

  const showPopup = (type: "error", message: string) => {
    setPopup({ type, message });
  };

  const closePopup = () => setPopup(null);

  const updateStatus = async (newStatus: number) => {
    setUpdating(true);
    try {
      await axios.put(`${baseURL}/update-report-status`, {
        reporterby_username: reporter,
        product_id: productId,
        status: newStatus,
      });
      setStatus(newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
      showPopup("error", "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusAdvance = () => {
    const nextStatus = status === 0 ? 1 : status === 1 ? 2 : status;
    if (nextStatus !== status) updateStatus(nextStatus);
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`${baseURL}/delete-product/${productId}`);
      await updateStatus(3);
      setActionCompleted(true);
    } catch (err) {
      console.error("Error deleting product:", err);
      showPopup("error", "Failed to delete product.");
    }
  };

  const handleKeepProduct = async () => {
    try {
      await axios.post(`${baseURL}/mark-product-kept`, {
        product_id: productId,
      });
      await updateStatus(3);
      setActionCompleted(true);
    } catch (err) {
      console.error("Error keeping product:", err);
      showPopup("error", "Failed to keep product.");
    }
  };

  return (
    <>
      {popup && (
        <aside className={styles.popupOverlay} role="alert">
          <section className={styles.popup}>
            <h2>❌ Error</h2>
            <p>{popup.message}</p>
            <button onClick={closePopup}>Close</button>
          </section>
        </aside>
      )}

      <article className={styles.card}>
        <header className={styles.header}>
          <h2 className={styles.title} role="heading">
            {product && product.trim() !== "" ? product : "Unknown Product"}
          </h2>

          <p className={styles.statusInfo}>
            <span className={`${styles.status} ${styles[label]}`}>
              ● {label.charAt(0).toUpperCase() + label.slice(1)}
            </span>{" "}
            <time className={styles.date}>{date}</time>
          </p>
        </header>

        <section className={styles.detailsGrid} aria-label="Report Summary">
          <dl>
            <dt>Reported By</dt>
            <dd>{reporter}</dd>
            <dt>Seller</dt>
            <dd>{seller}</dd>
            <dt>Reason</dt>
            <dd>{reason}</dd>
          </dl>
        </section>

        <section className={styles.detailsSection} aria-label="Details">
          <h3>Details</h3>
          <p>{details}</p>
        </section>

        {!actionCompleted && (
          <footer className={styles.buttonRow} aria-label="Actions">
            {status < 2 && (
              <button
                className={`${styles.investigate} ${styles[`status-${label}`]}`}
                onClick={handleStatusAdvance}
                disabled={updating}
              >
                {status === 0 ? "Investigate" : "Finish Investigating"}
              </button>
            )}

            {status === 2 && (
              <>
                <button
                  className={styles.investigate}
                  onClick={handleDeleteProduct}
                >
                  Delete Product
                </button>
                <button
                  className={styles.viewDetails}
                  onClick={handleKeepProduct}
                >
                  Keep Product
                </button>
              </>
            )}
          </footer>
        )}
      </article>
    </>
  );
};

export default UserReportCard;
