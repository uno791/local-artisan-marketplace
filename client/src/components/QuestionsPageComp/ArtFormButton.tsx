import React from "react";
import styles from "./QuestionsPage.module.css";

interface ArtFormButtonProps {
  label: string;
  isSelected?: boolean; // optional, if you plan to add highlight logic later
  onClick: () => void; 
}

const ArtFormButton: React.FC<ArtFormButtonProps> = ({ label, isSelected, onClick }) => {
  return (
    <button
      className={`${styles.artFormButton} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};


export default ArtFormButton;
