import styles from "./Profile.module.css";

// props for displaying profile info
type Props = {
  username: string;
  postalCode: string;
  phone: string;
  onEdit: () => void;
};

function ProfileInfo(props: Props) {
  return (
    // container for user info section
    <section className={styles["profile-info"]}>
      {/* row showing the username */}
      <article className={styles["info-row"]}>
        <p className={styles.label}>Username:</p>
        <p className={styles.value}>{props.username}</p>
      </article>

      {/* contact info section */}
      <section className={styles["contact-section"]}>
        <p className={styles.label}>Contact Details:</p>
        <article className={styles["contact-details"]}>
          <p>Postal Code: {props.postalCode}</p>
          <p>Phone: {props.phone}</p>
        </article>
      </section>

      {/* button to trigger edit mode */}
      <button
        className={styles["edit-btn"] + " " + styles["info-edit-btn"]}
        onClick={props.onEdit}
      >
        Edit Info
      </button>
    </section>
  );
}

export default ProfileInfo;
