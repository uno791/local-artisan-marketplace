"use client";
import React from "react";
import styles from "./LoginPage.module.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function GoogleLogInButton() {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userData = res.data;
        console.log("User info:", userData);
        navigate("/QuestionsPage");
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <button onClick={() => login()} className={styles.googleButton}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6c2c435e2bfdac1c7aa377094a31133bc82338d0"
        alt="Google icon"
        className={styles.googleIcon}
      />
      <span className={styles.buttonText}>Log-in with Google</span>
    </button>
  );
}
