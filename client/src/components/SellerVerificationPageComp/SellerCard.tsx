import React from "react";
import { Seller } from "../../Users";
import styles from "./SellerCard.module.css";

interface SellerCardProps {
  seller: Seller;
  onStartReview: () => void;
  onApprove: () => void;
  onReject: () => void;
}

// text labels for seller verification statuses
const statusText = ["Pending", "Reviewing", "Approved", "Rejected"];

const SellerCard: React.FC<SellerCardProps> = ({
  seller,
  onStartReview,
  onApprove,
  onReject,
}) => {
  const {
    shop_name,
    username,
    bio,
    shop_address,
    shop_pfp,
    verified,
    create_date,
  } = seller;

  return (
    <article className={styles.card}>
      <section className={styles.content}>
        <img src={shop_pfp} alt="Shop Profile" className={styles.avatar} />
        <h3>{shop_name}</h3>
        <p>
          <strong>Owner:</strong> {username}
        </p>
        <p>{bio}</p>
        <p>
          <strong>Address:</strong> {shop_address}
        </p>
        <p>
          <strong>Date:</strong> {create_date}
        </p>
        <p data-testid="seller-status">
          <strong>Status:</strong> {statusText[verified]}
        </p>

        {/* show start button if status is pending */}
        {verified === 0 && (
          <button className={styles.reviewBtn} onClick={onStartReview}>
            Start Review
          </button>
        )}

        {/* show approve and reject options if status is reviewing */}
        {verified === 1 && (
          <footer className={styles.actionGroup}>
            <button className={styles.approveBtn} onClick={onApprove}>
              Approve
            </button>
            <button className={styles.rejectBtn} onClick={onReject}>
              Reject
            </button>
          </footer>
        )}
      </section>
    </article>
  );
};

export default SellerCard;
