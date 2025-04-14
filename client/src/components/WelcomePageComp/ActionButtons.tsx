"use client";
import * as React from "react";
import styles from "./WelcomePage.module.css";
import { Link } from "react-router-dom";

export function ActionButtons() {
  return (
    <div className={styles.buttonContainer}>
      <Link to="/SignUpPage">
        <button className={styles.signUpButton}>Sign Up</button>
      </Link>

      <Link to="/LogInPage">
        <button className={styles.loginButton}>Log In</button>
      </Link>
    </div>
  );
}
