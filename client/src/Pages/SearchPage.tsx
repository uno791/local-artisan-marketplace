import * as React from "react";
import styles from "../components/SearchPageComp1/Search.module.css";
import Category from "../components/SearchPageComp1/Category";
import Header from "../components/SearchPageComp1/Header";
import ImageGrid from "../components/SearchPageComp1/ImageGrid";

function SearchPage() {
  return (
    // Main layout for the search page with semantic roles
    <main className={styles.wrapper} aria-label="Search page layout">
      {/* Sidebar with category filters */}
      <aside className={styles.sidebarArea}>
        <Category />
      </aside>

      {/* Main content area showing header and images */}
      <section className={styles.mainContent}>
        <Header />
        <ImageGrid />
      </section>
    </main>
  );
}

export default SearchPage;
