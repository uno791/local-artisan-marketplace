import * as React from "react";
import styles from "../components/WelcomePageComp/WelcomePage.module.css";
import { Logo } from "../components/WelcomePageComp/Logo";
import { ActionButtons } from "../components/WelcomePageComp/ActionButtons";

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
