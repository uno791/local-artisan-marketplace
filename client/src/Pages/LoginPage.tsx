import * as React from "react";
import styles from "../components/LogInPageComp/LoginPage.module.css";
import { Logo } from "../components/LogInPageComp/Logo";
import { WelcomeMessage } from "../components/LogInPageComp/WelcomeMessage";
import { GoogleLogInButton } from "../components/LogInPageComp/GoogleLoginButton";
import { SignUpPrompt } from "../components/LogInPageComp/SignUpPrompt";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [prankTarget, setPrankTarget] = React.useState<"/Home" | "/AdminDashboard">("/Home");

  const [showPrankModal, setShowPrankModal] = React.useState(false);
  const [yesBtnStyle, setYesBtnStyle] = React.useState({ top: "50%", left: "20%" });

  const navigate = useNavigate();

  const moveYesButton = () => {
    const top = Math.floor(Math.random() * 70) + 5;
    const left = Math.floor(Math.random() * 70) + 5;
    setYesBtnStyle({ top: `${top}%`, left: `${left}%` });
  };

  return (
    <main className={styles.pageWrapper}>
      <section className={styles.loginContainer}>
        <Logo />
        <WelcomeMessage />
        <GoogleLogInButton
          onError={(msg: string) => setErrorMessage(msg)}
          onSuccessMessage={(msg: string) => {
            setSuccessMessage(msg);
            if (msg === "Welcome back, Admin!") {
              setPrankTarget("/AdminDashboard");
            } else {
              setPrankTarget("/Home");
            }
          }}
        />
        <SignUpPrompt />

        {errorMessage && (
          <section className={styles.popupError} style={{ zIndex: 1000 }} aria-live="assertive">
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)}>Close</button>
          </section>
        )}

        {successMessage && (
          <section className={styles.popupSuccess} style={{ zIndex: 1000 }} aria-live="polite">
            <p>{successMessage}</p>
            <button
              onClick={() => {
                setSuccessMessage(null);
                setShowPrankModal(true);
              }}
            >
              Close
            </button>
          </section>
        )}
      </section>

      {showPrankModal && (
        <section className={styles.prankOverlay} data-testid="robot-check">
          <article className={styles.prankBox}>
            <p>Are you a robot?</p>

            <button
              className={styles.yesButton}
              onClick={moveYesButton}
              style={{
                position: "absolute",
                ...yesBtnStyle,
                transition: "top 0.2s ease, left 0.2s ease",
              }}
            >
              Yes
            </button>

            <button
              className={styles.noButton}
              onClick={() => navigate(prankTarget)}
              style={{
                position: "absolute",
                top: "50%",
                left: "60%",
                transition: "top 0.2s ease, left 0.2s ease",
              }}
            >
              No
            </button>
          </article>
        </section>
      )}
    </main>
  );
}

