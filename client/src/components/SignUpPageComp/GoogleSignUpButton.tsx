import React from "react";
import styles from "./GoogleSignUpButton.module.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "../../Users/User";
import { useUser } from "../../Users/UserContext";

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

        const user = new User({
          id: userData.sub,
          name: userData.name,
          firstName: userData.given_name,
          lastName: userData.family_name,
          email: userData.email,
          picture: userData.picture,
        });

        console.log("User instance:", user);
        setUser(user);
        navigate("/QuestionsPage");
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <button onClick={() => login()} className={styles.signUpButton}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/6c2c435e2bfdac1c7aa377094a31133bc82338d0"
        alt="Google logo"
        className={styles.googleIcon}
      />
      <span className={styles.buttonText}>Sign Up with Google</span>
    </button>
  );
}
