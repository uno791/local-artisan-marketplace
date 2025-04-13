"use client";
import * as React from "react";
import styles from "../components/QuestionsPageComp/QuestionsPage.module.css";
import UserNameHeader from "../components/QuestionsPageComp/UserNameHeader";
import ArtFormSection from "../components/QuestionsPageComp/ArtFormSection";
import ApplyButton from "../components/QuestionsPageComp/ApplyButton";

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
