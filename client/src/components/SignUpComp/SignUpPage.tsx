"use client";
import * as React from "react";
import styles from "./SignUpPage.module.css";
import { Logo } from "./Logo";
import { GoogleSignUpButton } from "./GoogleSignUpButton";
import { LoginPrompt } from "./LoginPrompt";

export default function SignUpPage() {
  return (
    <main className={styles.pageContainer}>
      <Logo />
      <h1 className={styles.welcomeHeading}>Welcome!</h1>
      <GoogleSignUpButton />
      <LoginPrompt />
    </main>
  );
}
