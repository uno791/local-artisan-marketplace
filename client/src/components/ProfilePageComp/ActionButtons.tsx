import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

type Props = {
  onBecomeSeller: () => void;
  sellerStatus: "none" | "pending" | "approved";
};

function ActionButtons({ onBecomeSeller, sellerStatus }: Props) {
  const navigate = useNavigate();

  function goToOrders() {
    navigate("/orders");
  }

  function goToDashboard() {
    navigate("/seller-dashboard");
  }

  return (
    <section className={styles["action-buttons"]}>
      <button className={styles["action-btn"]} onClick={goToOrders}>
        View Orders
      </button>

      {sellerStatus === "none" && (
        <button className={styles["action-btn"]} onClick={onBecomeSeller}>
          Become A Seller
        </button>
      )}

      {sellerStatus === "pending" && (
        <button className={styles["action-btn"]} disabled>
          Pending Approval
        </button>
      )}

      {sellerStatus === "approved" && (
        <button className={styles["action-btn"]} onClick={goToDashboard}>
          Go to Seller Dashboard
        </button>
      )}
    </section>
  );
}

export default ActionButtons;
