import React from "react";
import styles from "./QuestionsPage.module.css";

interface ApplyButtonProps {
  onApply: () => void;
}

const ApplyButton: React.FC<ApplyButtonProps> = ({ onApply }) => {
  return (
    <div className={styles.applyContainer}>
      <button className={styles.applyButton} onClick={onApply}>
        Apply
      </button>
    </div>
  );
};

export default ApplyButton;
