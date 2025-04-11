"use client";

import * as React from "react";
import styles from "./LoginPage.module.css";
import { Logo } from "./Logo";
import { WelcomeMessage } from "./WelcomeMessage";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { SignUpPrompt } from "./SignUpPrompt";

export default function LoginPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={styles.loginContainer}>
        <Logo />
        <WelcomeMessage />
        <GoogleLoginButton />
        <SignUpPrompt />
      </section>
    </main>
  );
}
