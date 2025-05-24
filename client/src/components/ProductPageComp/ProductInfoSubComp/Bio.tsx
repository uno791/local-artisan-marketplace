import styles from "./Bio.module.css";

// props for displaying product or seller bio
interface BioProps {
  description: string;
}

function Bio({ description }: BioProps) {
  return (
    // container for bio section
    <section className={styles["bio-container"]}>
      {/* heading for the section */}
      <h2 className={styles["bio-heading"]}>Bio:</h2>

      {/* bio text content */}
      <p className={styles["bio-text"]}>{description}</p>
    </section>
  );
}

export default Bio;
