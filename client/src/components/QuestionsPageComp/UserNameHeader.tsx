import React from "react";
import styles from "./QuestionsPage.module.css";

// props interface
interface UserNameHeaderProps {
  userName: string;
  setUserName: (name: string) => void;
}

// component definition
const UserNameHeader: React.FC<UserNameHeaderProps> = ({
  userName,
  setUserName,
}) => {
  return (
    <header className={styles.headerContainer}>
      <h2 className={styles.usernameTitle}>Create a username:</h2>
      <div className={styles.inputContainer}>
        <input
          id="username"
          name="username"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <label htmlFor="username" className={styles.label}>
          Enter username
        </label>
        <span className={styles.underline}></span>
      </div>
    </header>
  );
};

export default UserNameHeader;
