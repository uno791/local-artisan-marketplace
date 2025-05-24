// import dependencies and components
import React, { useState, useEffect } from "react";
import styles from "../components/QuestionsPageComp/QuestionsPage.module.css";
import UserNameHeader from "../components/QuestionsPageComp/UserNameHeader";
import ApplyButton from "../components/QuestionsPageComp/ApplyButton";
import ArtFormSection from "../components/QuestionsPageComp/ArtFormSection";
import { useUser } from "../Users/UserContext";
import { User } from "../Users/User";
import axios from "axios";
import { baseURL } from "../config";
import { useNavigate } from "react-router-dom";

// main questions page component
function QuestionsPage() {
  // state variables
  const [userName, setUserName] = useState<string>("");
  const [selectedArtForms, setSelectedArtForms] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const { user, setUser } = useUser(); // get and update user context
  const navigate = useNavigate();

  // fetch list of art form categories on load
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

  // handle apply button click
  const handleApplyClick = async () => {
    setError(null);

    // validations
    if (!userName.trim()) {
      setError("Please enter a username.");
      return;
    }

    if (!user) {
      setError("You must sign in with Google before continuing.");
      return;
    }

    if (selectedArtForms.length === 0) {
      setError("Please select at least one art form.");
      return;
    }

    try {
      // check if username is already taken
      const checkRes = await axios.post(`${baseURL}/check-user`, {
        username: userName,
      });

      if (checkRes.data.exists) {
        setError("Username already taken. Please choose another one.");
        return;
      }

      // submit user to database with selected interests
      const interests = selectedArtForms.join(", ");
      const res = await axios.post(`${baseURL}/adduser`, {
        username: userName,
        user_ID: user.id,
        interests: interests,
      });

      // update user context with new username
      const updatedUser = new User({
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        picture: user.picture,
        username: userName,
      });

      setUser(updatedUser);

      // send interests to recommendation scoring system
      try {
        await axios.post(`${baseURL}/apply-preferences`, {
          username: userName,
          selectedCategories: selectedArtForms,
        });
      } catch (err) {
        console.error("BO: Failed to apply preferences to scoring table:", err);
      }

      // success flow
      setSubmitted(true);
      setMessage(res.data.message);
      setError(null);
    } catch (err: any) {
      console.error("User creation failed:", err);
      setError("Something went wrong. Please try again.");
      setMessage("");
    }
  };

  return (
    <main className={styles.container}>
      {/* input for username */}
      <UserNameHeader userName={userName} setUserName={setUserName} />

      {/* interest selection section */}
      <section className={styles.artInterestSection}>
        <h1 className={styles.mainQuestion}>What kind of art interests you?</h1>
        <h2 className={styles.sectionTitle}>Art Forms</h2>
        <ArtFormSection
          selectedArtForms={selectedArtForms}
          setSelectedArtForms={setSelectedArtForms}
          availableTags={availableTags}
        />
      </section>

      {/* apply button */}
      <ApplyButton onApply={handleApplyClick} />

      {/* display any error message */}
      {error && <p className={styles.error}>{error}</p>}

      {/* success message popup */}
      {submitted && (
        <div className={styles.popup}>
          <h2>Submitted Info</h2>
          <p>
            <strong>Username:</strong> {userName}
          </p>
          <p>
            <strong>Selected Art Forms:</strong> {selectedArtForms.join(", ")}
          </p>
          <button onClick={() => navigate("/Home")}>Proceed to Homepage</button>
        </div>
      )}
    </main>
  );
}

export default QuestionsPage;
