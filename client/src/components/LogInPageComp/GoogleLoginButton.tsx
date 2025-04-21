import React from "react";
import styles from "./LoginPage.module.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { baseURL } from "../../config";
//import { useNavigate } from "react-router-dom";

interface GoogleLogInButtonProps {
  onError: (message: string) => void;
  onSuccessMessage: (message: string) => void;
}

export function GoogleLogInButton({
  onError,
  onSuccessMessage,
}: GoogleLogInButtonProps) {
  //const navigate = useNavigate();
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
        const user_ID = userData.sub;
        //const baseURL = import.meta.env.VITE_API_BASE_URL;
        const checkRes = await axios.post(`${baseURL}/check-userid`, {
          user_ID,
        });
        if (checkRes.data.exists && checkRes.data.role === 0) {
          onSuccessMessage("Successfully logged in!");
          // navigate to home pls
          //navigate("home");
        } else if (checkRes.data.exists && checkRes.data.role === 1) {
          onSuccessMessage("Welcome back, Admin!");
        } else {
          onError("You are not registered in our system.");
        }
      } catch (err) {
        console.error("Failed to fetch user info", err);
        onError("Something went wrong fetching your info.");
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      onError("Google login failed. Please try again.");
    },
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
