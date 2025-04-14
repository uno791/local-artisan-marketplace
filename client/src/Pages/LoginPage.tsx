import * as React from "react";
import styles from "../components/LogInPageComp/LoginPage.module.css";
import { Logo } from "../components/LogInPageComp/Logo";
import { WelcomeMessage } from "../components/LogInPageComp/WelcomeMessage";
import { GoogleLogInButton } from "../components/LogInPageComp/GoogleLoginButton";
import { SignUpPrompt } from "../components/LogInPageComp/SignUpPrompt";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  const navigate = useNavigate();

  return (
    <main className={styles.pageWrapper}>
      <section className={styles.loginContainer}>
        <Logo />
        <WelcomeMessage />
        <GoogleLogInButton
          onError={(msg: string) => setErrorMessage(msg)}
          onSuccessMessage={(msg: string) => {
            setSuccessMessage(msg);
            navigate("/home"); // ✅ Go to home page on success
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
            <Link to="/home">
              <button onClick={() => setSuccessMessage(null)}>Close</button>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
