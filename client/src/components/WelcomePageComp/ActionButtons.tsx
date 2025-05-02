"use client";
import * as React from "react";
import styles from "./WelcomePage.module.css";
import { Link } from "react-router-dom";

export function ActionButtons() {
  return (
    // matthew, use an aria-label to make the section have aa name which will be shown to the page reader thing for semantic
    <section className={styles.buttonContainer} aria-label="Action Buttons">
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
    </section>
  );
}
