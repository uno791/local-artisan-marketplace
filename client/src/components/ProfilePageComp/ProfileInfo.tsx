import styles from "./Profile.module.css";

// props interface
type Props = {
  username: string;
  postalCode: string;
  phone: string;
  onEdit: () => void;
};

// component definition
function ProfileInfo(props: Props) {
  return (
    <section className={styles["profile-info"]}>
      <article className={styles["info-row"]}>
        <p className={styles.label}>Username:</p>
        <p className={styles.value}>{props.username}</p>
      </article>

      <section className={styles["contact-section"]}>
        <p className={styles.label}>Contact Details:</p>
        <article className={styles["contact-details"]}>
          <p>Postal Code: {props.postalCode}</p>
          <p>Phone: {props.phone}</p>
        </article>
      </section>

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
