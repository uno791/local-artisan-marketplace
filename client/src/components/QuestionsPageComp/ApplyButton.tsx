import React from "react";
import styles from "./QuestionsPage.module.css";

interface ApplyButtonProps {
  onApply: () => void;
}

const ApplyButton: React.FC<ApplyButtonProps> = ({ onApply }) => {
  return (
    <button className={styles.applyButton} onClick={onApply}>
      Apply
    </button>
  );
};

export default ApplyButton;
