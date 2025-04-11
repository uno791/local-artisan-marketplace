"use client";
import React from "react";
import styles from "./GoogleSignUpButton.module.css";

export function GoogleSignUpButton() {
  const handleClick = () => {
    // Handle Google sign up logic
  };

  return (
    <button onClick={handleClick} className={styles.signUpButton}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6c2c435e2bfdac1c7aa377094a31133bc82338d0"
        alt="Google logo"
        className={styles.googleIcon}
      />
      <span className={styles.buttonText}>Sign Up with Google</span>
    </button>
  );
}
