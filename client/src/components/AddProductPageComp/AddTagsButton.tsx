import React from "react";
import styles from "../EditProductPageComp/EditTagsButton.module.css";

const EditTagsButton: React.FC = () => {
  return (
    <div className={styles.container}>
      <button className={styles.button}>Add Tags</button>
    </div>
  );
};

export default EditTagsButton;
