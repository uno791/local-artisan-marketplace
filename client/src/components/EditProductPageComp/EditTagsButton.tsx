import React from "react";
import styles from "./EditTagsButton.module.css";

const EditTagsButton: React.FC = () => {
  return (
    <div className={styles.container}>
      <button className={styles.button}>Edit Tags</button>
    </div>
  );
};

export default EditTagsButton;
