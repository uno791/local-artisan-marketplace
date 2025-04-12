"use client";

import * as React from "react";
import styles from "../components/LogInPageComp/LoginPage.module.css";
import { Logo } from "../components/LogInPageComp/Logo";
import { WelcomeMessage } from "../components/LogInPageComp/WelcomeMessage";
import { GoogleLogInButton } from "../components/LogInPageComp/GoogleLoginButton";
import { SignUpPrompt } from "../components/LogInPageComp/SignUpPrompt";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  return (
    <main className={styles.pageWrapper}>
      <section className={styles.loginContainer}>
        <Logo />
        <WelcomeMessage />
        <GoogleLogInButton
          onError={(msg: string) => setErrorMessage(msg)}
          onSuccessMessage={(msg: string) => setSuccessMessage(msg)}
        />
        <SignUpPrompt />

        {(errorMessage || successMessage) && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 999,
              // optional: pointerEvents: 'auto' if you want click to close
            }}
          />
        )}

        {errorMessage && (
          <div className={styles.popupError} style={{ zIndex: 1000 }}>
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)}>Close</button>
          </div>
        )}

        {successMessage && (
          <div className={styles.popupSuccess} style={{ zIndex: 1000 }}>
            <p>{successMessage}</p>
            <button onClick={() => setSuccessMessage(null)}>Close</button>
          </div>
        )}
      </section>
    </main>
  );
}
