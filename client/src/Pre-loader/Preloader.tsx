import styles from "./Preloader.module.css";

function Preloader() {
  return (
    <section className={styles.overlay}>
      <section className={styles.spinner}></section>
    </section>
  );
}

export default Preloader;
