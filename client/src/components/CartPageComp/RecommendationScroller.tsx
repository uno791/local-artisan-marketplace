import styles from "./RecommendationScroller.module.css";

function RecommendationScroller() {
  return (
    <section className={styles.scrollerArea} aria-label="Recommended products">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => (
        <article className={styles.recommendationCard} key={index}>
          <img
            src="https://via.placeholder.com/120"
            alt="Recommended Product"
            className={styles.productImage}
          />
          <p className={styles.productName}>Sample Product</p>
          <p className={styles.productPrice}>R120</p>
          <button className={styles.addButton}>Add</button>
        </article>
      ))}
    </section>
  );
}

export default RecommendationScroller;
