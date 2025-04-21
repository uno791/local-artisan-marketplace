import styles from "./Profile.module.css";

type Props = {
  onBecomeSeller: () => void;
};

function ActionButtons(props: Props) {
  return (
    <section className={styles["action-buttons"]}>
      <button className={styles["action-btn"]}>View Orders</button>
      <button className={styles["action-btn"]} onClick={props.onBecomeSeller}>
        Become A Seller
      </button>
    </section>
  );
}

export default ActionButtons;
