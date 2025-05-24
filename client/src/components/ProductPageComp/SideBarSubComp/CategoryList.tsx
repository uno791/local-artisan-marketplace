import styles from "./CategoryList.module.css";

// props include main category and minor tag list
interface Props {
  mainCategory: string;
  minorTags: string[];
}

const CategoryList: React.FC<Props> = ({ mainCategory, minorTags }) => {
  return (
    // container for product category info
    <aside className={styles.container} aria-label="Product categories">
      {/* heading section */}
      <header className={styles.header}>
        <h2 className={styles.heading}>Categories</h2>
      </header>

      {/* content section with main and minor categories */}
      <section className={styles.content}>
        {/* display main category */}
        <section className={styles.main}>
          <h3 className={styles.mainLabel}>Main Category</h3>
          <p className={styles.mainValue}>{mainCategory}</p>
        </section>

        {/* display minor category tags */}
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
