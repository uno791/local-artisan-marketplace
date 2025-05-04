import * as React from "react";
import styles from "../components/SearchPageComp1/Search.module.css";
import Category from "../components/SearchPageComp1/Category";
import Header from "../components/SearchPageComp1/Header";
import ImageGrid from "../components/SearchPageComp1/ImageGrid";

function SearchPage() {
  return (
    <main className={styles.wrapper} aria-label="Search page layout">
      <aside className={styles.sidebarArea}>
        <Category />
      </aside>
      <section className={styles.mainContent}>
        <Header />
        <ImageGrid />
      </section>
    </main>
  );
}

export default SearchPage;
