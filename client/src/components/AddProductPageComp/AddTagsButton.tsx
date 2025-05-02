import React, { useState } from "react";
import styles from "../EditProductPageComp/EditTagsButton.module.css";

const AddTagsButton: React.FC<{ onConfirm?: (tags: string[]) => void }> = ({ onConfirm }) => {
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
      <button className={styles.button} onClick={() => setIsPopupOpen(true)}>Add Tags</button>

      {isPopupOpen && (
        <section className={styles.popupOverlay} role="dialog" aria-modal="true" aria-labelledby="tag-dialog-title">
          <section className={styles.popup}>
            <header>
              <h3 id="tag-dialog-title">Please use short words to describe your artwork</h3>
            </header>

            <section>
              <input
                type="text"
                placeholder="Enter a tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                className={styles.input}
              />
              <button className={styles.addButton} onClick={handleAddTag}>Add</button>
            </section>

            <section>
              <ul className={styles.tagList}>
                {tags.map((tag, index) => (
                  <li key={index} className={styles.tagItem}>
                    {tag}
                    <button
                      className={styles.removeButton}
                      aria-label={`Remove tag ${tag}`}
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <footer>
              <button className={styles.confirmButton} onClick={handleConfirm}>Confirm</button>
            </footer>
          </section>
        </section>
      )}
    </section>
  );
};

export default AddTagsButton;
