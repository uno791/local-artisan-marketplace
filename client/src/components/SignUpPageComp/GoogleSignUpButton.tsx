import React, { useState } from "react";
import styles from "./GoogleSignUpButton.module.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "../../Users/User";
import { useUser } from "../../Users/UserContext";
import { baseURL } from "../../config";

interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
}

export function GoogleSignUpButton() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get<GoogleUserInfo>(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userData = res.data;
        const user_ID = userData.sub;

        const checkRes = await axios.post(`${baseURL}/check-userid`, {
          user_ID,
        });

        if (checkRes.data.exists) {
          setErrorMessage("User already exists. Please log in instead.");
          return;
        }

        const newUser = new User({
          id: userData.sub,
          name: userData.name,
          firstName: userData.given_name,
          lastName: userData.family_name,
          email: userData.email,
          picture: userData.picture,
        });

        setUser(newUser);
        navigate("/QuestionsPage");
      } catch (err) {
        console.error("❌ Failed to fetch user info:", err);
        setErrorMessage("Google login failed. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      setErrorMessage("Google login failed. Please try again.");
    },
  });

  return (
    <>
      <button onClick={() => login()} className={styles.signUpButton}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6c2c435e2bfdac1c7aa377094a31133bc82338d0"
          alt="Google logo"
          className={styles.googleIcon}
        />
        <span className={styles.buttonText}>Sign Up with Google</span>

        {/* 🌸 Falling petals */}
        <div className={styles.petals}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {errorMessage && (
        <div className={styles.errorMessage}>
          <p>{errorMessage}</p>
        </div>
      )}
    </>
  );
}
