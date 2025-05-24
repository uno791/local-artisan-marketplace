import styles from "./SectionHeading.module.css";

// component definition
function SectionHeading() {
  return (
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
