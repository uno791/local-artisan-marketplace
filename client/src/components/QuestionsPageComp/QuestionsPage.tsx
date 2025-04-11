"use client";
import * as React from "react";
import styles from "./QuestionsPage.module.css";
import UserNameHeader from "./UserNameHeader";
import ArtFormSection from "./ArtFormSection";
import ApplyButton from "./ApplyButton";

function QuestionsPage() {
  return (
    <main className={styles.container}>
      <UserNameHeader />
      <section className={styles.artInterestSection}>
        <h1 className={styles.mainQuestion}>What kind of art interests you?</h1>
        <h2 className={styles.sectionTitle}>Art Forms</h2>
        <ArtFormSection />
      </section>
      <ApplyButton />
    </main>
  );
}

export default QuestionsPage;
