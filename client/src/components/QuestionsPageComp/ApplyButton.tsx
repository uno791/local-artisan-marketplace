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
        <span className={styles.arrowWrapper}>
          <span className={styles.arrow}></span>
        </span>
      </button>
    </div>
  );
};

export default ApplyButton;
