import React from "react";
import styles from "./SignUpPrompt.module.css";

export function SignUpPrompt() {
  const handleSignUpClick = () => {
    // Handle  navigation
  };

  return (
    <p className={styles.signupText}>
      Don't have an account? Click here to
      <button onClick={handleSignUpClick} className={styles.signinLink}>
        Sign Up!
      </button>
    </p>
  );
}
