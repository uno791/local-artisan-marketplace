"use client";
import * as React from "react";
import styles from "./WelcomePage.module.css";

export function ActionButtons() {
  return (
    <div className={styles.buttonContainer}>
      <button className={styles.signUpButton}>Sign Up</button>
      <button className={styles.loginButton}>Log In</button>
    </div>
  );
}
