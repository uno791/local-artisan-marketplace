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
  const [noBtnStyle, setNoBtnStyle] = React.useState({ top: "50%", left: "60%" });

  const navigate = useNavigate();

  const moveNoButton = () => {
    const top = Math.floor(Math.random() * 70) + 5;
    const left = Math.floor(Math.random() * 70) + 5;
    setNoBtnStyle({ top: `${top}%`, left: `${left}%` });
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
          <div className={styles.popupError} style={{ zIndex: 1000 }}>
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)}>Close</button>
          </div>
        )}

        {successMessage && (
          <div className={styles.popupSuccess} style={{ zIndex: 1000 }}>
            <p>{successMessage}</p>
            <button
              onClick={() => {
                setSuccessMessage(null);
                setShowPrankModal(true);
              }}
            >
              Close
            </button>
          </div>
        )}
      </section>

      {/* Prank Modal */}
      {showPrankModal && (
        <div className={styles.prankOverlay}>
          <div className={styles.prankBox}>
            <p>Are you a robot?</p>

            {/* Yes: Stays in place, goes to next page */}
            <button
              className={styles.yesButton}
              onClick={() => navigate(prankTarget)}
              style={{
                position: "absolute",
                top: "50%",
                left: "20%",
                transition: "top 0.2s ease, left 0.2s ease",
              }}
            >
              Yes
            </button>

            {/* No: Moves on click */}
            <button
              className={styles.noButton}
              onClick={moveNoButton}
              style={{
                position: "absolute",
                ...noBtnStyle,
                transition: "top 0.2s ease, left 0.2s ease",
              }}
            >
              No
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
