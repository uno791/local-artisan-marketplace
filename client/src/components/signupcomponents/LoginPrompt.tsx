import React from "react";
import styles from "./LoginPrompt.module.css";

export function LoginPrompt() {
  const handleLoginClick = () => {
    // Handle login navigation
  };

  return (
    <p className={styles.loginText}>
      Already have an account? Click here to
      <button onClick={handleLoginClick} className={styles.loginLink}>
        Log in!
      </button>
    </p>
  );
}
