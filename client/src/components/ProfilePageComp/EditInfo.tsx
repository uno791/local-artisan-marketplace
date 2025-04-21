import { useEffect, useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import styles from "./Profile.module.css";
import axios from "axios";
import { baseURL } from "../../config";

type Props = {
  username: string;
  postalCode: string;
  phone: string | undefined;
  setUsername: (value: string) => void;
  setPostalCode: (value: string) => void;
  setPhone: (value: string) => void;
  onClose: () => void;
};

function EditInfo(props: Props) {
  const [renderKey, setRenderKey] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRenderKey((prev) => prev + 1);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${baseURL}/api/users/${props.username}`, {
        postal_code: props.postalCode,
        phone_no: props.phone,
      });
      alert("✅ Info updated successfully!");
      props.onClose();
    } catch (error) {
      alert("❌ Failed to update user info.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles["modal-backdrop"]}>
      <section className={styles.modal}>
        <header>
          <h2>Edit Info</h2>
        </header>

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            value={props.username}
            onChange={(e) => props.setUsername(e.target.value)}
            disabled // i turned off
          />

          <label>Postal Code</label>
          <input
            value={props.postalCode}
            onChange={(e) => props.setPostalCode(e.target.value)}
          />

          <label>Phone Number</label>
          <PhoneInput
            key={renderKey}
            placeholder="Enter phone number"
            defaultCountry="ZA"
            value={props.phone}
            international={true}
            countryCallingCodeEditable={false}
            onChange={(value) => props.setPhone(value || "")}
          />

          <section className={styles["button-row"]}>
            <button
              type="submit"
              className={styles["apply-btn"]}
              disabled={loading}
            >
              {loading ? "Saving..." : "Apply Changes"}
            </button>
            <button
              type="button"
              onClick={props.onClose}
              className={styles["cancel-btn"]}
            >
              Cancel
            </button>
          </section>
        </form>
      </section>
    </section>
  );
}

export default EditInfo;
