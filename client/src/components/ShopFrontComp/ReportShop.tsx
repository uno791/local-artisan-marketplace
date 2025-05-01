import { useState } from "react";
import styles from "./ShopFront.module.css";

type Props = {
  onClose: () => void;
};

function ReportShop({ onClose }: Props) {
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClose(); // No backend logic
  }

  return (
    <section className={styles["modal-backdrop"]}>
      <section className={styles.modal}>
        <h2>Report Shop</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="shop-report">Your Report</label>
          <textarea
            id="shop-report"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue with this shop..."
          />
          <section className={styles["button-row"]}>
            <button type="submit" className={styles["apply-btn"]}>
              Send
            </button>
            <button type="button" onClick={onClose} className={styles["cancel-btn"]}>
              Cancel
            </button>
          </section>
        </form>
      </section>
    </section>
  );
}

export default ReportShop;
