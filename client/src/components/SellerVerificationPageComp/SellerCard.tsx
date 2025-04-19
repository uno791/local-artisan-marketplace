import React from "react";
import styles from "./SellerCard.module.css";
import { Seller } from "../../Types";

interface Props {
  seller: Seller;
  onApprove?: () => void;
  onReject?: () => void;
  onStartReview?: () => void;
}

const SellerCard: React.FC<Props> = ({
  seller,
  onApprove,
  onReject,
  onStartReview,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span
          className={`${styles.statusDot} ${
            styles[seller.status.toLowerCase()]
          }`}
        />
        <h3>{seller.name}</h3>
        <span className={styles.date}>{seller.submissionDate}</span>
      </div>
      <p>
        <strong>{seller.businessType}</strong> - {seller.description}
      </p>
      <p>
        <strong>Owner:</strong> {seller.owner}
      </p>
      <p>
        {seller.contactEmail}
        <br />
        {seller.contactPhone}
      </p>
      <div className={styles.actions}>
        {seller.status === "Pending" && (
          <>
            <button onClick={onStartReview} className={styles.review}>
              Start Review
            </button>
            <button className={styles.details}>View Details</button>
          </>
        )}
        {seller.status === "Reviewing" && (
          <>
            <button onClick={onApprove} className={styles.approve}>
              Approve
            </button>
            <button onClick={onReject} className={styles.reject}>
              Reject
            </button>
            <button className={styles.details}>View Details</button>
          </>
        )}
      </div>
    </div>
  );
};

export default SellerCard;
