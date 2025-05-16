import React from "react";
import styles from "./QuestionsPage.module.css";

interface ArtFormButtonProps {
  label: string;
  isSelected?: boolean;
  onClick: () => void;
}

const ArtFormButton: React.FC<ArtFormButtonProps> = ({
  label,
  isSelected,
  onClick,
}) => {
  return (
    <button
      className={`${styles.artFormButton} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
      aria-pressed={isSelected} // ✅ fixed here
    >
      {label}
    </button>
  );
};

export default ArtFormButton;
