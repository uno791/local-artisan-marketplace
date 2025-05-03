import React, { useState } from "react";
import styles from "./EditTagsButton.module.css";

interface Props {
  onConfirm?: (tags: string[]) => void;
}

const EditTagsButton: React.FC<Props> = ({ onConfirm }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    const trimmed = currentTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm(tags);
    setIsPopupOpen(false);
  };

  return (
    <section className={styles.container}>
      <button className={styles.button} onClick={() => setIsPopupOpen(true)}>Edit Tags</button>

      {isPopupOpen && (
        <section className={styles.popupOverlay} role="dialog" aria-modal="true">
          <section className={styles.popup}>
            <h3>Please use short words to describe your artwork</h3>
            <input
              type="text"
              placeholder="Enter a tag"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              className={styles.input}
            />
            <button className={styles.addButton} onClick={handleAddTag}>Add</button>
            <ul className={styles.tagList}>
              {tags.map((tag, index) => (
                <li key={index} className={styles.tagItem}>
                  {tag}
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveTag(tag)}
                  >✕</button>
                </li>
              ))}
            </ul>
            <button className={styles.confirmButton} onClick={handleConfirm}>Confirm</button>
          </section>
        </section>
      )}
    </section>
  );
};

export default EditTagsButton;
