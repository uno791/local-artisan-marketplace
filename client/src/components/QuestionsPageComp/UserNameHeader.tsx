import React from "react";
import styles from "./QuestionsPage.module.css";

interface UserNameHeaderProps {
  userName: string;
  setUserName: (name: string) => void;
}

const UserNameHeader: React.FC<UserNameHeaderProps> = ({
  userName,
  setUserName,
}) => {
  return (
    <header className={styles.headerContainer}>
      <h2 className={styles.usernameTitle}>Create a username:</h2>
      <div className={styles.inputContainer}>
        <label htmlFor="username" className={styles.label}>
          Enter username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Enter username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <span className={styles.underline}></span>
      </div>
    </header>
  );
};

export default UserNameHeader;
