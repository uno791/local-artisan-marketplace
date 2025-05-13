import React, { useState, useEffect } from "react";
import styles from "../components/QuestionsPageComp/QuestionsPage.module.css";
import UserNameHeader from "../components/QuestionsPageComp/UserNameHeader";
import ApplyButton from "../components/QuestionsPageComp/ApplyButton";
import ArtFormSection from "../components/QuestionsPageComp/ArtFormSection";
import { useUser } from "../Users/UserContext";
import axios from "axios";
import { baseURL } from "../config";
import { useNavigate } from "react-router-dom";

function QuestionsPage() {
  const [userName, setUserName] = useState<string>("");
  const [selectedArtForms, setSelectedArtForms] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();

  // Fetch tags from DB
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get(`${baseURL}/main-categories`);
        setAvailableTags(res.data);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, []);

  const handleApplyClick = async () => {
    setError(null);

    if (!userName.trim()) {
      setError("Please enter a username.");
      return;
    }

    if (!user) {
      setError("You must sign in with Google before continuing.");
      return;
    }

    try {
      const checkRes = await axios.post(`${baseURL}/check-user`, {
        username: userName,
      });

      if (checkRes.data.exists) {
        setError("Username already taken. Please choose another one.");
        return;
      }

      // Add user to database
      const res = await axios.post(`${baseURL}/adduser`, {
        username: userName,
        user_ID: user.id,
      });

      // Save selected art tags
      await axios.post(`${baseURL}/save-user-tags`, {
        username: userName,
        tags: selectedArtForms,
      });

      setSubmitted(true);
      setMessage(res.data.message);
      setError("");
      console.log(message, res.data);
    } catch (err) {
      console.error("User creation failed:", err);
      setError("Something went wrong. Please try again.");
      setMessage("");
    }
  };

  return (
    <main className={styles.container}>
      <UserNameHeader userName={userName} setUserName={setUserName} />

      <section className={styles.artInterestSection}>
        <h1 className={styles.mainQuestion}>What kind of art interests you?</h1>
        <h2 className={styles.sectionTitle}>Art Forms</h2>
        <ArtFormSection
          selectedArtForms={selectedArtForms}
          setSelectedArtForms={setSelectedArtForms}
          availableTags={availableTags}
        />
      </section>

      <ApplyButton onApply={handleApplyClick} />

      {error && <p className={styles.error}>{error}</p>}

      {submitted && (
        <div className={styles.popup}>
          <h2>Submitted Info</h2>
          <p>
            <strong>Username:</strong> {userName}
          </p>
          <p>
            <strong>Selected Art Forms:</strong> {selectedArtForms.join(", ")}
          </p>
          <button onClick={() => navigate("/")}>
            Proceed to Homepage
          </button>
        </div>
      )}
    </main>
  );
}

export default QuestionsPage;
