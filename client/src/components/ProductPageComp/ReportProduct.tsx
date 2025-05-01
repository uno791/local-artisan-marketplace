import { useState } from "react";
import styles from "./ReportProduct.module.css";

type Props = {
  onClose: () => void;
};

function ReportProduct({ onClose }: Props) {
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClose(); // Simulates sending the report
  }

  return (
    <section className={styles["modal-backdrop"]}>
      <section className={styles.modal}>
        <h2>Report Product</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="report">Your Report</label>
          <textarea
            id="report"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue with this product..."
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

export default ReportProduct;
