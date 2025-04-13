import React from "react";
import styles from "./QuestionsPage.module.css";

interface UserNameHeaderProps {
  userName: string | null;
  setUserName: (name: string) => void;
}

const UserNameHeader: React.FC<UserNameHeaderProps> = ({
  userName,
  setUserName,
}) => {
  return (
    <header className={styles.headerContainer}>
      <h2 className={styles.usernameTitle}>Create a username:</h2>
      <div className={styles.iconContainer}>
        <input
          type="text"
          className={styles.usernameInput}
          placeholder="Enter username"
          value={userName ?? ""}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
    </header>
  );
};

export default UserNameHeader;
