import { useState, ChangeEvent, FormEvent } from "react";
import styles from "./ReportProduct.module.css";

type Props = {
  onClose: () => void;
};

function ReportProduct({ onClose }: Props) {
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

    // Example: send formData to backend via axios
    // axios.post('/api/report', formData)

    onClose(); // Close after "sending"
  }

  return (
    <section className={styles["modal-backdrop"]}>
      <section className={styles.modal}>
        <h2>Report Product</h2>
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
<option value="misleading">Misleading title or description</option>
<option value="scam">Scam or fraudulent product</option>
<option value="infringement">Copyright or trademark infringement</option>
<option value="spam">Spam or irrelevant listing</option>
<option value="prohibited">Prohibited item or service</option>
<option value="duplicate">Duplicate of another listing</option>
<option value="expired">Outdated or expired listing</option>
<option value="harassment">Harassment or abusive seller behavior</option>
<option value="safety">Unsafe or harmful product</option>
<option value="other">Other (please describe below)</option>

          </select>

          <label htmlFor="report">Your Report</label>
          <textarea
            id="report"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue with this product..."
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

export default ReportProduct;

