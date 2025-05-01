import React from "react";
import styles from "./UserReportCard.module.css";

type UserReportCardProps = {
  status: string;
  date: string;
  reporter: string;
  seller: string;
  product: string;
  reason: string;
  details: string;
  evidenceUrl?: string;
};

const UserReportCard: React.FC<UserReportCardProps> = ({
  status,
  date,
  reporter,
  seller,
  product,
  reason,
  details,
  evidenceUrl
}) => {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>● {status}</span>
        <span className={styles.date}>{date}</span>
      </header>

      <section className={styles.detailsGrid}>
        <div><strong>Reported By</strong><br />{reporter}</div>
        <div><strong>Seller</strong><br />{seller}</div>
        <div><strong>Product</strong><br />{product}</div>
        <div><strong>Reason</strong><br />{reason}</div>
      </section>

      <section className={styles.detailsSection}>
        <strong>Details</strong>
        <p>{details}</p>
      </section>

      {evidenceUrl && (
        <section className={styles.evidenceSection}>
          <strong>Evidence</strong>
          <img src={evidenceUrl} alt="Evidence" className={styles.evidenceImage} />
        </section>
      )}

      <section className={styles.buttonRow}>
        <button className={styles.investigate}>Investigate</button>
        <button className={styles.viewDetails}>View Details</button>
      </section>
    </section>
  );
};

export default UserReportCard;