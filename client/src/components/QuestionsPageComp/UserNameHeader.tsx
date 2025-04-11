import React from "react";
import styles from "./QuestionsPage.module.css";

const UserNameHeader = () => {
  return (
    <header className={styles.headerContainer}>
      <h2 className={styles.usernameTitle}>Create a username:</h2>
      <div className={styles.iconContainer}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/9cae8401b37e4b32b0c47072abf66007/0e8bc23c01e82208693b04cd7083fa0300530938?placeholderIfAbsent=true"
          alt="User profile icon"
          className={styles.profileIcon}
        />
      </div>
    </header>
  );
};

export default UserNameHeader;
