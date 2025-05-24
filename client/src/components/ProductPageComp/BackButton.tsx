import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import styles from "./BackButton.module.css";

// component definition
function BackButton() {
  const navigate = useNavigate();

  // handle navigation to home
  const handleBack = () => {
    navigate("/home");
  };

  return (
    <button className={styles["back-button"]} onClick={handleBack}>
      Home
    </button>
  );
}

export default BackButton;
