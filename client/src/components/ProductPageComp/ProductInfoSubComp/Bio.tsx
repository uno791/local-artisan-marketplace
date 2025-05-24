import styles from "./Bio.module.css";

interface BioProps {
  description: string;
}

function Bio({ description }: BioProps) {
  return (
    <section className={styles["bio-container"]}>
      <h2 className={styles["bio-heading"]}>Bio:</h2>
      <p className={styles["bio-text"]}>{description}</p>
    </section>
  );
}

export default Bio;
