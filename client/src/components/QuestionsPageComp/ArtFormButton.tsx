import React from "react";
import styles from "./QuestionsPage.module.css";

// props interface
interface ArtFormButtonProps {
  label: string;
  isSelected?: boolean;
  onClick: () => void;
}

// component definition
const ArtFormButton: React.FC<ArtFormButtonProps> = ({
  label,
  isSelected,
  onClick,
}) => {
  return (
    <button
      className={`${styles.artFormButton} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      {label}
    </button>
  );
};

export default ArtFormButton;
