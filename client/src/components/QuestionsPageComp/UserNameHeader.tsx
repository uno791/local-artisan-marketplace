import React, { useState, useEffect } from "react";
import styles from "./QuestionsPage.module.css";
import { useUser } from "../../Users/UserContext";

interface UserNameHeaderProps {
  userName: string | null;
  setUserName: (name: string) => void;
}

const UserNameHeader: React.FC<UserNameHeaderProps> = ({
  userName,
  setUserName,
}) => {
const UserNameHeader = () => {
  const { user, username, setUsername } = useUser();

  useEffect(() => {
    if (user && !username) {
      setUsername(user.firstName); // prefill
    }
  }, [user, username, setUsername]);

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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
    </header>
  );
};

export default UserNameHeader;
