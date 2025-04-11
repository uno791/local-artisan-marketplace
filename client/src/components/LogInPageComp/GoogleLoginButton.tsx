"use client";

import React from "react";
import styles from "./LoginPage.module.css";

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // Handle Google login logic
    console.log("Initiating Google login...");
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className={styles.googleButton}
      aria-label="Log in with Google"
    >
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6c2c435e2bfdac1c7aa377094a31133bc82338d0"
        alt="Google icon"
        className={styles.googleIcon}
      />
      <span className={styles.buttonText}>Log-in with Google</span>
    </button>
  );
}
