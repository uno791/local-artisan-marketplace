// import required libraries and components
import * as React from "react";
import styles from "../components/SearchPageComp1/Search.module.css";
import Category from "../components/SearchPageComp1/Category";
import Header from "../components/SearchPageComp1/Header";
import ImageGrid from "../components/SearchPageComp1/ImageGrid";

// main search page layout
function SearchPage() {
  return (
    // wrapper for the entire search page
    <main className={styles.wrapper} aria-label="Search page layout">
      {/* sidebar for category filters */}
      <aside className={styles.sidebarArea}>
        <Category />
      </aside>

      {/* main section containing header and results */}
      <section className={styles.mainContent}>
        <Header />
        <ImageGrid />
      </section>
    </main>
  );
}

export default SearchPage;
