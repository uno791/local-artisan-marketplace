import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

// props for button actions and seller status
type Props = {
  onBecomeSeller: () => void;
  sellerStatus: "none" | "pending" | "approved";
};

function ActionButtons({ onBecomeSeller, sellerStatus }: Props) {
  const navigate = useNavigate();

  // navigate to order history
  function goToOrders() {
    navigate("/orders");
  }

  // navigate to seller dashboard
  function goToDashboard() {
    navigate("/SellerHome");
  }

  return (
    // container for profile action buttons
    <section className={styles["action-buttons"]}>
      {/* always show view orders button */}
      <button className={styles["action-btn"]} onClick={goToOrders}>
        View Orders
      </button>

      {/* show become seller if not yet applied */}
      {sellerStatus === "none" && (
        <button className={styles["action-btn"]} onClick={onBecomeSeller}>
          Become A Seller
        </button>
      )}

      {/* show disabled button if approval is pending */}
      {sellerStatus === "pending" && (
        <button className={styles["action-btn"]} disabled>
          Pending Approval
        </button>
      )}

      {/* show dashboard button if approved */}
      {sellerStatus === "approved" && (
        <button className={styles["action-btn"]} onClick={goToDashboard}>
          Go to Seller Dashboard
        </button>
      )}
    </section>
  );
}

export default ActionButtons;
