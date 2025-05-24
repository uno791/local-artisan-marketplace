import * as React from "react";
import styles from "../components/SearchPageComp1/Search.module.css";
import Category from "../components/SearchPageComp1/Category";
import Header from "../components/SearchPageComp1/Header";
import ImageGrid from "../components/SearchPageComp1/ImageGrid";

function HourglassLoader() {
  return (
    <div className={styles.hourglassBackground}>
      <div className={styles.hourglassContainer}>
        <div className={styles.hourglassCurves}></div>
        <div className={styles.hourglassCapTop}></div>
        <div className={styles.hourglassGlassTop}></div>
        <div className={styles.hourglassSand}></div>
        <div className={styles.hourglassSandStream}></div>
        <div className={styles.hourglassCapBottom}></div>
        <div className={styles.hourglassGlass}></div>
      </div>
    </div>
  );
}

function SearchPage() {
  const [loading, setLoading] = React.useState(true);

  return (
    <main className={styles.wrapper} aria-label="Search page layout">
      <aside className={styles.sidebarArea}>
        <Category />
      </aside>

      <section className={styles.mainContent}>
        <Header />
        <ImageGrid setLoading={setLoading} />
        {loading && <HourglassLoader />}
      </section>
    </main>
  );
}

export default SearchPage;
