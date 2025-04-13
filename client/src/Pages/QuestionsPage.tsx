"use client";
import * as React from "react";
import styles from "../components/QuestionsPageComp/QuestionsPage.module.css";
import UserNameHeader from "../components/QuestionsPageComp/UserNameHeader";
import ApplyButton from "../components/QuestionsPageComp/ApplyButton";
import ArtFormSection from "../components/QuestionsPageComp/ArtFormSection";


function QuestionsPage() {
const [userName, setUserName] = React.useState<string | null>(null);
const [selectedArtForms, setSelectedArtForms] = React.useState<string[]>([]);
const [submitted, setSubmitted] = React.useState(false);

const handleApplyClick = () => {
  console.log("User name:", userName);
  console.log("Selected art forms:", selectedArtForms);
  setSubmitted(true); // show the info below the button
};

  return (
    <main className={styles.container}>
      <UserNameHeader 
      userName={userName}
      setUserName={setUserName}/>
      <section className={styles.artInterestSection}>
        <h1 className={styles.mainQuestion}>What kind of art interests you?</h1>
        <h2 className={styles.sectionTitle}>Art Forms</h2>
        <ArtFormSection
        selectedArtForms={selectedArtForms}
        setSelectedArtForms={setSelectedArtForms}/>
      </section>
      <ApplyButton onApply={handleApplyClick} />
      {submitted && (
  <div className={styles.popup}>
    <h2>Submitted Info</h2>
    <p><strong>Username:</strong> {userName}</p>
    <p><strong>Selected Art Forms:</strong> {selectedArtForms.join(", ")}</p>
    <button onClick={() => setSubmitted(false)}>Close</button>
  </div>
)}

    </main>
  );
}

export default QuestionsPage;
