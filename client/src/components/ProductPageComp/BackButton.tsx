import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa"; // font awesome home icon
import styles from "./BackButton.module.css";

function BackButton() {
  const navigate = useNavigate();

  // go to home page on click
  const handleBack = () => {
    navigate("/home");
  };

  return (
    // home icon button that routes to home
    <button className={styles["back-button"]} onClick={handleBack}>
      <FaHome size={20} />
    </button>
  );
}

export default BackButton;
