import React from "react";
import { Seller } from "../../Users";
import styles from "./SellerCard.module.css";

interface SellerCardProps {
  seller: Seller;
  onStartReview: () => void;
  onApprove: () => void;
  onReject: () => void;
}

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
    <div className={styles.card}>
      <div className={styles.content}>
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
        <p>
          <strong>Status:</strong> {statusText[verified]}
        </p>

        {verified === 0 && (
          <button className={styles.reviewBtn} onClick={onStartReview}>
            Start Review
          </button>
        )}

        {verified === 1 && (
          <div className={styles.actionGroup}>
            <button className={styles.approveBtn} onClick={onApprove}>
              Approve
            </button>
            <button className={styles.rejectBtn} onClick={onReject}>
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerCard;
