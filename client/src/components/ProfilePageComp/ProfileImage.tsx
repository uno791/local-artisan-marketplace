import styles from "./Profile.module.css";

// props interface
type Props = {
  image: string;
  openFilePicker: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

// component definition
function ProfileImage(props: Props) {
  return (
    <section className={styles["profile-img-section"]}>
      <img src={props.image} alt="Profile" className={styles["profile-img"]} />
      <button className={styles["edit-img-btn"]} onClick={props.openFilePicker}>
        Edit
      </button>
      <input
        type="file"
        accept="image/*"
        ref={props.fileInputRef}
        onChange={props.handleImageChange}
        aria-label="upload profile image"
        style={{ display: "none" }}
      />
    </section>
  );
}

export default ProfileImage;
