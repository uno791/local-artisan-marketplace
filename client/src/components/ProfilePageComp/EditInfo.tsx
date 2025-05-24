import { useEffect, useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import styles from "./Profile.module.css";
import axios from "axios";
import { baseURL } from "../../config";

// props for editable user info
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
  const [errors, setErrors] = useState<{ postalCode?: string; phone?: string }>(
    {}
  );

  // force rerender of phone input to reset it on modal open
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRenderKey((prev) => prev + 1);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  // handle form submission
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors: typeof errors = {};

    // validate postal code
    if (!/^\d{4,10}$/.test(props.postalCode)) {
      newErrors.postalCode = "Postal code must be 4-10 digits.";
    }

    // validate phone number format
    if (!props.phone || !isValidPhoneNumber(props.phone)) {
      newErrors.phone = "Enter a valid international phone number.";
    }

    // if errors exist, show them and stop submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // update user info
      await axios.put(`${baseURL}/api/users/${props.username}`, {
        postal_code: props.postalCode,
        phone_no: props.phone,
      });

      // close modal on success
      props.onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    // modal backdrop
    <section className={styles["modal-backdrop"]}>
      <section className={styles.modal}>
        <header>
          <h2>Edit Info</h2>
        </header>

        {/* editable info form */}
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            value={props.username}
            onChange={(e) => props.setUsername(e.target.value)}
            disabled // can't change username
          />

          <label>Postal Code</label>
          <input
            value={props.postalCode}
            onChange={(e) => props.setPostalCode(e.target.value)}
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
            value={props.phone}
            international={true}
            countryCallingCodeEditable={false}
            onChange={(value) => props.setPhone(value || "")}
          />
          {errors.phone && (
            <p className={styles["error-text"]}>{errors.phone}</p>
          )}

          {/* form action buttons */}
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
