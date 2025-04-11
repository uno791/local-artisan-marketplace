import * as React from "react";
import styles from "./WelcomePage.module.css";
import { Logo } from "./Logo";
import { ActionButtons } from "./ActionButtons";

function WelcomePage() {
  return (
    <main className={styles.welcomeContainer}>
      <h1 className={styles.welcomeTitle}>WELCOME TO</h1>
      <Logo />
      <p className={styles.welcomeDescription}>
        A marketplace for handmade treasures
      </p>
      <ActionButtons />
    </main>
  );
}

export default WelcomePage;
