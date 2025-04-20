import styles from "./Profile.module.css";

type Props = {
  username: string;
  postalCode: string;
  phone: string;
  setUsername: (value: string) => void;
  setPostalCode: (value: string) => void;
  setPhone: (value: string) => void;
  onClose: () => void;
};

function EditInfo(props: Props) {
  return (
    <section className={styles["modal-backdrop"]}>
      <section className={styles.modal}>
        <header>
          <h2>Edit Info</h2>
        </header>

        <form
  onSubmit={function (event) {
    event.preventDefault();
    props.onClose();
  }}
>
  <label>Username</label>
  <input
    value={props.username}
    onChange={function (event) {
      props.setUsername(event.target.value);
    }}
  />

  <label>Postal Code</label>
  <input
    value={props.postalCode}
    onChange={function (event) {
      props.setPostalCode(event.target.value);
    }}
  />

  <label>Phone</label>
  <input
    value={props.phone}
    onChange={function (event) {
      props.setPhone(event.target.value);
    }}
  />

  <section className={styles["button-row"]}>
    <button type="submit" className={styles["apply-btn"]}>
      Apply Changes
    </button>
    <button type="button" onClick={props.onClose} className={styles["cancel-btn"]}>
      Cancel
    </button>
  </section>
</form>

      </section>
    </section>
  );
}

export default EditInfo;
