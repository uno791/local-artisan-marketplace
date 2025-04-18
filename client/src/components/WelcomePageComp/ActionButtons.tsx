"use client";
import * as React from "react";
import styles from "./WelcomePage.module.css";
import { Link } from "react-router-dom";

export function ActionButtons() {
  return (
    <div className={styles.buttonContainer}>
      <Link to="/SignUpPage">
        <button className={styles.signUpButton}>
          Sign Up
          <span className={styles["arrow-wrapper"]}>
            <span className={styles.arrow}></span>
          </span>
        </button>
      </Link>

      <Link to="/LogInPage">
        <button className={styles.loginButton}>
          Log In
          <span className={styles["arrow-wrapper"]}>
            <span className={styles.arrow}></span>
          </span>
        </button>
      </Link>
    </div>
  );
}
