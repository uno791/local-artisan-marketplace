import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

type Props = {
  onBecomeSeller: () => void;
};

function ActionButtons(props: Props) {
  const navigate = useNavigate();

  function goToOrders() {
    navigate("/orders");
  }

  return (
    <section className={styles["action-buttons"]}>
      <button className={styles["action-btn"]} onClick={goToOrders}>
        View Orders
      </button>

      <button className={styles["action-btn"]} onClick={props.onBecomeSeller}>
        Become A Seller
      </button>
    </section>
  );
}

export default ActionButtons;
