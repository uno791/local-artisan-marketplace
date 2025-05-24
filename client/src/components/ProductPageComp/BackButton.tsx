import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa"; // Font Awesome Home icon
import styles from "./BackButton.module.css";

function BackButton() {
  const navigate = useNavigate();

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
