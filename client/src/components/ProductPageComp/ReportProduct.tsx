import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import styles from "./ReportProduct.module.css";
import { baseURL } from "../../config";

// type for individual reason option
type Reason = {
  reason_id: number;
  reason: string;
};

// component props
type Props = {
  productId: number;
  sellerUsername: string;
  reporterUsername: string;
  onClose: () => void;
};

function ReportProduct({
  productId,
  sellerUsername,
  reporterUsername,
  onClose,
}: Props) {
  // form state
  const [reasonId, setReasonId] = useState<number | "">("");
  const [message, setMessage] = useState("");

  // fetched reasons for reporting
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [loadingReasons, setLoadingReasons] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch report reasons on mount
  useEffect(() => {
    axios
      .get(`${baseURL}/reasons`)
      .then((res) => {
        setReasons(res.data);
        setLoadingReasons(false);
      })
      .catch((err) => {
        console.error("Failed to load reasons:", err);
        setError("Failed to load reasons.");
        setLoadingReasons(false);
      });
  }, []);

  // handle form submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!reasonId) {
      alert("Please select a reason.");
      return;
    }

    try {
      await axios.post(`${baseURL}/user_reports`, {
        reporterby_username: reporterUsername,
        seller_username: sellerUsername,
        product_id: productId,
        reason_id: reasonId,
        details: message,
      });

      // on success close the modal
      onClose();
    } catch (err) {
      console.error("Failed to send report:", err);
      // optional: show error alert
    }
  }

  return (
    // backdrop for modal
    <section className={styles["modal-backdrop"]}>
      <section className={styles.modal}>
        <h2>Report Product</h2>

        {/* loading state */}
        {loadingReasons ? (
          <p>Loading reasons...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          // form to submit a report
          <form onSubmit={handleSubmit}>
            <label htmlFor="reason">Reason</label>
            <select
              id="reason"
              value={reasonId}
              onChange={(e) => setReasonId(Number(e.target.value))}
              required
              className={styles["dropdown"]}
            >
              <option value="" disabled>
                Select a reason
              </option>
              {reasons.map((r) => (
                <option key={r.reason_id} value={r.reason_id}>
                  {r.reason}
                </option>
              ))}
            </select>

            {/* textarea for user explanation */}
            <label htmlFor="report">Your Report</label>
            <textarea
              id="report"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the issue with this product..."
              rows={4}
            />

            {/* action buttons */}
            <section className={styles["button-row"]}>
              <button type="submit" className={styles["apply-btn"]}>
                Send
              </button>
              <button
                type="button"
                onClick={onClose}
                className={styles["cancel-btn"]}
              >
                Cancel
              </button>
            </section>
          </form>
        )}
      </section>
    </section>
  );
}

export default ReportProduct;
