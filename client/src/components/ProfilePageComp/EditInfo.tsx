import { useEffect, useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import styles from "./Profile.module.css";

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

  useEffect(() => {
    // Force re-render after modal is visible
    const timeout = setTimeout(() => {
      setRenderKey((prev) => prev + 1);
    }, 0); // or try 50ms if 0 doesn't work

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className={styles["modal-backdrop"]}>
      <section className={styles.modal}>
        <header>
          <h2>Edit Info</h2>
        </header>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            props.onClose();
          }}
        >
          <label>Username</label>
          <input
            value={props.username}
            onChange={(e) => props.setUsername(e.target.value)}
          />

          <label>Postal Code</label>
          <input
            value={props.postalCode}
            onChange={(e) => props.setPostalCode(e.target.value)}
          />

          <label>Phone Number</label>
          <PhoneInput
            key={renderKey} // <- 🔥 triggers fresh render
            placeholder="Enter phone number"
            defaultCountry="ZA"
            value={props.phone}
            international={true}
            countryCallingCodeEditable={false}
            onChange={(value) => props.setPhone(value || "")} 
          />

          <section className={styles["button-row"]}>
            <button type="submit" className={styles["apply-btn"]}>
              Apply Changes
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

