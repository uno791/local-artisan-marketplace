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
  evidenceUrl?: string;
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
  evidenceUrl,
  productId,
}) => {
  // state for report status and UI flags
  const [status, setStatus] = useState<number>(initialStatus);
  const [showEvidence, setShowEvidence] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [popup, setPopup] = useState<{ type: "error"; message: string } | null>(
    null
  );
  const [actionCompleted, setActionCompleted] = useState(false);

  // get label string for current status
  const label = statusToLabel[status] ?? "unknown";

  // show error popup
  const showPopup = (type: "error", message: string) => {
    setPopup({ type, message });
  };

  // close popup
  const closePopup = () => setPopup(null);

  // update report status on backend
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
      console.error("failed to update status:", err);
      showPopup("error", "failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  // advance status (pending -> investigating -> decision)
  const handleStatusAdvance = () => {
    const nextStatus = status === 0 ? 1 : status === 1 ? 2 : status;
    if (nextStatus !== status) updateStatus(nextStatus);
  };

  // delete product and mark report complete
  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`${baseURL}/delete-product/${productId}`);
      await updateStatus(3);
      setActionCompleted(true);
    } catch (err) {
      console.error("error deleting product:", err);
      showPopup("error", "failed to delete product.");
    }
  };

  // keep product and mark report complete
  const handleKeepProduct = async () => {
    try {
      await axios.post(`${baseURL}/mark-product-kept`, {
        product_id: productId,
      });
      await updateStatus(3);
      setActionCompleted(true);
    } catch (err) {
      console.error("error keeping product:", err);
      showPopup("error", "failed to keep product.");
    }
  };

  return (
    <>
      {/* error popup */}
      {popup && (
        <aside className={styles.popupOverlay} role="alert">
          <section className={styles.popup}>
            <h2>❌ error</h2>
            <p>{popup.message}</p>
            <button onClick={closePopup}>close</button>
          </section>
        </aside>
      )}

      <article className={styles.card}>
        <header className={styles.header}>
          <h2 className={styles.title} role="heading">
            {product && product.trim() !== "" ? product : "unknown product"}
          </h2>

          <p className={styles.statusInfo}>
            <span className={`${styles.status} ${styles[label]}`}>
              ● {label.charAt(0).toUpperCase() + label.slice(1)}
            </span>{" "}
            <time className={styles.date}>{date}</time>
          </p>
        </header>

        {/* report summary details */}
        <section className={styles.detailsGrid} aria-label="report summary">
          <dl>
            <dt>reported by</dt>
            <dd>{reporter}</dd>
            <dt>seller</dt>
            <dd>{seller}</dd>
            <dt>reason</dt>
            <dd>{reason}</dd>
          </dl>
        </section>

        {/* detailed report */}
        <section className={styles.detailsSection} aria-label="details">
          <h3>details</h3>
          <p>{details}</p>
        </section>

        {/* evidence image or fallback text */}
        {showEvidence && (
          <figure className={styles.evidenceSection}>
            <figcaption>
              <strong>evidence</strong>
            </figcaption>
            {evidenceUrl ? (
              <img
                src={evidenceUrl}
                alt="evidence provided by reporter"
                className={styles.evidenceImage}
              />
            ) : (
              <p>no evidence given</p>
            )}
          </figure>
        )}

        {/* action buttons if report not completed */}
        {!actionCompleted && (
          <footer className={styles.buttonRow} aria-label="actions">
            {/* advance investigation buttons */}
            {status < 2 && (
              <button
                className={`${styles.investigate} ${styles[`status-${label}`]}`}
                onClick={handleStatusAdvance}
                disabled={updating}
              >
                {status === 0 ? "investigate" : "finish investigating"}
              </button>
            )}

            {/* decision buttons */}
            {status === 2 && (
              <>
                <button
                  className={styles.investigate}
                  onClick={handleDeleteProduct}
                >
                  delete product
                </button>
                <button
                  className={styles.viewDetails}
                  onClick={handleKeepProduct}
                >
                  keep product
                </button>
              </>
            )}

            {/* toggle evidence view */}
            <button
              className={styles.viewDetails}
              onClick={() => setShowEvidence(!showEvidence)}
            >
              {showEvidence ? "hide evidence" : "view evidence"}
            </button>
          </footer>
        )}
      </article>
    </>
  );
};

export default UserReportCard;
