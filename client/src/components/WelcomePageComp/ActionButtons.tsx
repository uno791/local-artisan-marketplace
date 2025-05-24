"use client";
import * as React from "react";
import styles from "./WelcomePage.module.css";
import { Link } from "react-router-dom";

export function ActionButtons() {
  return (
    // section with labeled area for accessibility
    <section className={styles.buttonContainer} aria-label="Action Buttons">
      {/* link to signup page */}
      <Link to="/SignUpPage">
        <button className={styles.signUpButton} data-testid="navbar-signup">
          Sign Up
          <span className={styles["arrow-wrapper"]}>
            <span className={styles.arrow}></span>
          </span>
        </button>
      </Link>
      {/* link to login page */}
      <Link to="/LogInPage">
        <button className={styles.loginButton}>
          Log In
          <span className={styles["arrow-wrapper"]}>
            <span className={styles.arrow}></span>
          </span>
        </button>
      </Link>
    </section>
  );
}
