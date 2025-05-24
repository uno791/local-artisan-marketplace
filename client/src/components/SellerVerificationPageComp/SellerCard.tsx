import React from "react";
import { Seller } from "../../Users";
import styles from "./SellerCard.module.css";

// expected props passed into the seller card
interface SellerCardProps {
  seller: Seller; // seller data
  onStartReview: () => void; // handler to mark seller for review
  onApprove: () => void; // handler to approve seller
  onReject: () => void; // handler to reject seller
}

// human-readable text for each verification status
const statusText = ["Pending", "Reviewing", "Approved", "Rejected"];

// display seller details and verification options
const SellerCard: React.FC<SellerCardProps> = ({
  seller,
  onStartReview,
  onApprove,
  onReject,
}) => {
  // extract values from seller object
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
        {/* shop profile picture */}
        <img src={shop_pfp} alt="Shop Profile" className={styles.avatar} />

        {/* shop name and owner info */}
        <h3>{shop_name}</h3>
        <p>
          <strong>Owner:</strong> {username}
        </p>
        <p>{bio}</p>
        <p>
          <strong>Address:</strong> {shop_address}
        </p>

        {/* current verification status */}
        <p data-testid="seller-status">
          <strong>Status:</strong> {statusText[verified]}
        </p>

        {/* show review button if status is pending */}
        {verified === 0 && (
          <button className={styles.reviewBtn} onClick={onStartReview}>
            Start Review
          </button>
        )}

        {/* show approve and reject buttons if reviewing */}
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
