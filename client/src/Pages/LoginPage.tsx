"use client";

import * as React from "react";
import styles from "../components/LogInPageComp/LoginPage.module.css";
import { Logo } from "../components/LogInPageComp/Logo";
import { WelcomeMessage } from "../components/LogInPageComp/WelcomeMessage";
import { GoogleLogInButton } from "../components/LogInPageComp/GoogleLoginButton";
import { SignUpPrompt } from "../components/LogInPageComp/SignUpPrompt";

export default function LoginPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={styles.loginContainer}>
        <Logo />
        <WelcomeMessage />
        <GoogleLogInButton />
        <SignUpPrompt />
      </section>
    </main>
  );
}
