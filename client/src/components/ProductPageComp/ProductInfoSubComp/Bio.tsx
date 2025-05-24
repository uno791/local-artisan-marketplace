import styles from "./Bio.module.css";

// props interface
interface BioProps {
  description: string;
}

// component definition
function Bio({ description }: BioProps) {
  return (
    <section className={styles["bio-container"]}>
      <h2 className={styles["bio-heading"]}>Bio:</h2>
      <p className={styles["bio-text"]}>{description}</p>
    </section>
  );
}

export default Bio;
