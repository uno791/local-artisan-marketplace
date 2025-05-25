// src/components/ProfilePageComp/EditInfo.tsx
import { useEffect, useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import styles from "./Profile.module.css";
import axios from "axios";
import { baseURL } from "../../config";

interface Props {
  username: string;
  postalCode: string;
  phone: string;
  setPostalCode: (code: string) => void;
  setPhone: (phone: string) => void;
  onClose: () => void;
  refreshProfile: () => Promise<void>;
}

export default function EditInfo({
  username,
  postalCode,
  phone,
  onClose,
  refreshProfile,
}: Props) {
  const [newPostalCode, setNewPostalCode] = useState(postalCode);
  const [newPhone, setNewPhone] = useState(phone || "");
  const [errors, setErrors] = useState<{ postalCode?: string; phone?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [infoSaved, setInfoSaved] = useState(false);

  // hack for PhoneInput re-render bug
  const [renderKey, setRenderKey] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setRenderKey((k) => k + 1), 0);
    return () => clearTimeout(t);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const errs: typeof errors = {};
    if (!/^\d{4,10}$/.test(newPostalCode)) {
      errs.postalCode = "Postal code must be 4–10 digits.";
    }
    if (!newPhone || !isValidPhoneNumber(newPhone)) {
      errs.phone = "Enter a valid international phone number.";
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      setLoading(false);
      return;
    }

    try {
      await axios.put(`${baseURL}/api/users/${username}`, {
        postal_code: newPostalCode,
        phone_no: newPhone,
      });

      setInfoSaved(true);
      await refreshProfile(); // ← only here

      // keep the success message visible briefly
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error("❌ Error saving profile info:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles["modal-backdrop"]}>
      <div className={styles.modal}>
        <h2>Edit Info</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input value={username} disabled />

          <label>Postal Code</label>
          <input
            value={newPostalCode}
            onChange={(e) => setNewPostalCode(e.target.value)}
            className={errors.postalCode ? styles["input-error"] : ""}
          />
          {errors.postalCode && (
            <p className={styles["error-text"]}>{errors.postalCode}</p>
          )}

          <label>Phone Number</label>
          <PhoneInput
            key={renderKey}
            placeholder="Enter phone number"
            defaultCountry="ZA"
            value={newPhone}
            international
            countryCallingCodeEditable={false}
            onChange={(v) => setNewPhone(v || "")}
          />
          {errors.phone && (
            <p className={styles["error-text"]}>{errors.phone}</p>
          )}

          <div className={styles["button-row"]}>
            <button
              type="submit"
              className={styles["apply-btn"]}
              disabled={loading}
            >
              {loading ? "Saving…" : "Apply Changes"}
            </button>
            <button
              type="button"
              className={styles["cancel-btn"]}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>

          {infoSaved && (
            <p
              style={{ color: "green", textAlign: "center", marginTop: "1rem" }}
            >
              Info updated successfully.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
