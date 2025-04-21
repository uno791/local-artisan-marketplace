import styles from "./ReviewList.module.css";

function ReviewList() {
  return (
    <section className={styles["review-box"]}>
      <h2 className={styles["review-heading"]}>Collector Reviews</h2>

      <ul className={styles["review-list"]}>
        <li className={styles["review-card"]}>
          <p className={styles["review-stars"]}>★★★★★</p>
          <strong className={styles["review-title"]}>Stunning Piece</strong>
          <p className={styles["review-text"]}>
            This piece has become the focal point of my art dungeon.
          </p>
          <footer className={styles["review-footer"]}>
            <address className={styles["reviewer-name"]}>Sarah Johnson</address>
            <time className={styles["review-date"]}>2024-01-15</time>
          </footer>
        </li>

        <li className={styles["review-card"]}>
          <p className={styles["review-stars"]}>★★★★★</p>
          <strong className={styles["review-title"]}>
            Exceptional Quality
          </strong>
          <p className={styles["review-text"]}>
            The attention to detail and the quality of materials used are
            remarkable. I’m in love with this work of art.
          </p>
          <footer className={styles["review-footer"]}>
            <address className={styles["reviewer-name"]}>Michael Chen</address>
            <time className={styles["review-date"]}>2024-01-10</time>
          </footer>
        </li>

        <li className={styles["review-card"]}>
          <p className={styles["review-stars"]}>★★★★★</p>
          <strong className={styles["review-title"]}>Masterful Work</strong>
          <p className={styles["review-text"]}>
            This piece speaks volumes. It's a true centerpiece in my collection.
          </p>
          <footer className={styles["review-footer"]}>
            <address className={styles["reviewer-name"]}>Emma Davis</address>
            <time className={styles["review-date"]}>2024-01-05</time>
          </footer>
        </li>

        <li className={styles["review-card"]}>
          <p className={styles["review-stars"]}>★★★★★</p>
          <strong className={styles["review-title"]}>Stunning Piece</strong>
          <p className={styles["review-text"]}>
            This piece has become the focal point of my art dungeon.
          </p>
          <footer className={styles["review-footer"]}>
            <address className={styles["reviewer-name"]}>Sarah Johnson</address>
            <time className={styles["review-date"]}>2024-01-15</time>
          </footer>
        </li>

        <li className={styles["review-card"]}>
          <p className={styles["review-stars"]}>★★★★★</p>
          <strong className={styles["review-title"]}>Stunning Piece</strong>
          <p className={styles["review-text"]}>
            This piece has become the focal point of my art dungeon.
          </p>
          <footer className={styles["review-footer"]}>
            <address className={styles["reviewer-name"]}>Sarah Johnson</address>
            <time className={styles["review-date"]}>2024-01-15</time>
          </footer>
        </li>

        <li className={styles["review-card"]}>
          <p className={styles["review-stars"]}>★★★★★</p>
          <strong className={styles["review-title"]}>Stunning Piece</strong>
          <p className={styles["review-text"]}>
            This piece has become the focal point of my art dungeon.
          </p>
          <footer className={styles["review-footer"]}>
            <address className={styles["reviewer-name"]}>Sarah Johnson</address>
            <time className={styles["review-date"]}>2024-01-15</time>
          </footer>
        </li>

        <li className={styles["review-card"]}>
          <p className={styles["review-stars"]}>★★★★★</p>
          <strong className={styles["review-title"]}>Stunning Piece</strong>
          <p className={styles["review-text"]}>
            This piece has become the focal point of my art dungeon.
          </p>
          <footer className={styles["review-footer"]}>
            <address className={styles["reviewer-name"]}>Sarah Johnson</address>
            <time className={styles["review-date"]}>2024-01-15</time>
          </footer>
        </li>

        <li className={styles["review-card"]}>
          <p className={styles["review-stars"]}>★★★★★</p>
          <strong className={styles["review-title"]}>Stunning Piece</strong>
          <p className={styles["review-text"]}>
            This piece has become the focal point of my art dungeon.
          </p>
          <footer className={styles["review-footer"]}>
            <address className={styles["reviewer-name"]}>Sarah Johnson</address>
            <time className={styles["review-date"]}>2024-01-15</time>
          </footer>
        </li>
      </ul>
    </section>
  );
}

export default ReviewList;
