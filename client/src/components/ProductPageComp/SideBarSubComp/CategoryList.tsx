import styles from "./CategoryList.module.css";

interface Props {
  mainCategory: string;
}

const CategoryList: React.FC<Props> = ({ mainCategory }) => {
  return (
    <aside className={styles.container} aria-label="Product categories">
      <header className={styles.header}>
        <h2 className={styles.heading}>Product Category:</h2>
      </header>

      <section className={styles.content}>
        <section className={styles.main}>
          <p className={styles.mainValue}>{mainCategory}</p>
        </section>
      </section>
    </aside>
  );
};

export default CategoryList;
