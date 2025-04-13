import React from "react";
import styles from "./QuestionsPage.module.css";

interface ArtFormButtonProps {
  label: string;
}

const ArtFormButton: React.FC<ArtFormButtonProps> = ({ label }) => {
  return <button className={styles.artFormButton}>{label}</button>;
};

export default ArtFormButton;
