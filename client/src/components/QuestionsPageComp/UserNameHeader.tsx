import React from "react";
import styles from "./QuestionsPage.module.css";

const UserNameHeader = () => {
  return (
    <header className={styles.headerContainer}>
      <h2 className={styles.usernameTitle}>Create a username:</h2>
      <div className={styles.iconContainer}>
        <input
          type="text"
          className={styles.usernameInput}
          placeholder="Enter username"
        />
      </div>
    </header>
  );
};

export default UserNameHeader;
