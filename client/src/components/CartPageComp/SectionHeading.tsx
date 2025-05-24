import styles from "./SectionHeading.module.css";

// heading section for recommendations area
function SectionHeading() {
  return (
    // container for the section title
    <header className={styles.headingContainer}>
      <h1 className={styles.heading}>
        <em>
          <strong>You May Also Like</strong>
        </em>
      </h1>
    </header>
  );
}

export default SectionHeading;
