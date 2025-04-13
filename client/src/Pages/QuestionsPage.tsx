import * as React from "react";
import styles from "../components/QuestionsPageComp/QuestionsPage.module.css";
import UserNameHeader from "../components/QuestionsPageComp/UserNameHeader";
import ApplyButton from "../components/QuestionsPageComp/ApplyButton";
import ArtFormSection from "../components/QuestionsPageComp/ArtFormSection";
import { useUser } from "../Users/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function QuestionsPage() {
  const [userName, setUserName] = React.useState<string>("");
  const [selectedArtForms, setSelectedArtForms] = React.useState<string[]>([]);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { user } = useUser();
  const navigate = useNavigate();

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
      const existsRes = await axios.get(
        "http://localhost:3000/api/users/exists",
        {
          params: { username: userName },
          withCredentials: true,
        }
      );

      if (existsRes.data.exists) {
        setError("Username already taken. Please choose another one.");
        return;
      }

      const payload = {
        username: userName,
        user_ID: user.id ?? "",
        first_name: user.firstName ?? null,
        last_name: user.lastName ?? null,
        role: "user",
        postal_code: null,
        phone_no: null,
      };

      await axios.post("http://localhost:3000/api/users/create", payload, {
        withCredentials: true,
      });

      setSubmitted(true);
      // navigate("/Dashboard");
    } catch (err) {
      console.error("User creation failed:", err);
      setError("Something went wrong. Please try again.");
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
          <button onClick={() => setSubmitted(false)}>Close</button>
        </div>
      )}
    </main>
  );
}

export default QuestionsPage;
