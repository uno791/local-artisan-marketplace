import { useNavigate } from "react-router-dom";
import styles from "./BackButton.module.css";

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/home"); // This will send the user to Home ("/home")
  };

  return (
    <button className={styles["back-button"]} onClick={handleBack}>
      Home
    </button>
  );
}

export default BackButton;
