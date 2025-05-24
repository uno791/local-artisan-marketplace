import styles from "./CategoryList.module.css";

// props interface
interface Props {
  mainCategory: string;
  minorTags: string[];
}

// component definition
const CategoryList: React.FC<Props> = ({ mainCategory, minorTags }) => {
  return (
    <aside className={styles.container} aria-label="Product categories">
      <header className={styles.header}>
        <h2 className={styles.heading}>Categories</h2>
      </header>

      <section className={styles.content}>
        <section className={styles.main}>
          <h3 className={styles.mainLabel}>Main Category</h3>
          <p className={styles.mainValue}>{mainCategory}</p>
        </section>

        <section className={styles.minor}>
          <h3 className={styles.minorLabel}>Minor Categories</h3>
          <ul className={styles.tagList}>
            {minorTags.map((tag, index) => (
              <li key={index} className={styles.tagItem}>
                {tag}
              </li>
            ))}
          </ul>
        </section>
      </section>
    </aside>
  );
};

export default CategoryList;
