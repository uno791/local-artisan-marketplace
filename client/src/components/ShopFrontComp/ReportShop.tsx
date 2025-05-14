import { useState, ChangeEvent, FormEvent } from "react";
import styles from "./ShopFront.module.css";

type Props = {
  onClose: () => void;
};

function ReportShop({ onClose }: Props) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("reason", reason);
    formData.append("message", message);
    if (image) {
      formData.append("image", image);
    }

    // axios.post('/api/report-shop', formData)
    onClose(); // Simulate submission
  }

  return (
    <section className={styles["modal-backdrop"]}>
      <section className={styles.modal}>
        <h2>Report Shop</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="reason">Reason</label>
          <select
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className={styles["dropdown"]}
          >
            <option value="" disabled>Select a reason</option>
            <option value="offensive">Offensive or inappropriate content</option>
            <option value="misleading">Misleading information or identity</option>
            <option value="scam">Scam or fraudulent activity</option>
            <option value="infringement">Copyright or trademark violation</option>
            <option value="spam">Spam or unrelated content</option>
            <option value="prohibited">Prohibited items or services</option>
            <option value="harassment">Harassment or abusive behavior</option>
            <option value="false-location">False location or identity</option>
            <option value="safety">Unsafe business practices</option>
            <option value="other">Other (please describe below)</option>
          </select>

          <label htmlFor="shop-report">Your Report</label>
          <textarea
            id="shop-report"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue with this shop..."
          />

          <label htmlFor="evidence">Evidence (optional)</label>
          <input
            id="evidence"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles["file-input"]}
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
