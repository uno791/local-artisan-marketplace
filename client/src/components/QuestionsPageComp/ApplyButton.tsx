import React, { useState } from "react";
import styles from "./QuestionsPage.module.css";
import { useUser } from "../../Users/UserContext";
import axios from "axios";

const ApplyButton = () => {
  const { user, username } = useUser();
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!user || !username) {
      setError("Please fill in your username.");
      return;
    }

    try {
      // Check if username exists
      const checkRes = await axios.get(
        `http://localhost:3000/api/users/exists?username=${username}`
      );
      const exists = checkRes.data.exists;

      if (exists) {
        setError("Username already taken. Try another one.");
        return;
      }

      // Create new user
      await axios.post("http://localhost:3000/api/users/create", {
        username,
        user_ID: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        role: "user",
        postal_code: null,
        phone_no: null,
      });

      alert("User created successfully!");
      setError(null);
    } catch (err) {
      console.error("Error during apply:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.applyContainer}>
      <button className={styles.applyButton} onClick={handleApply}>
        Apply
      </button>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default ApplyButton;
