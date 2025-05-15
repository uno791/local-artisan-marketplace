import React, { useState } from "react";
import styles from "../EditProductPageComp/EditTagsButton.module.css";

interface Props {
  onConfirm?: (tags: string[]) => void;
  tagLimit?: number; // Optional: defaults to 5
}

const AddTagsButton: React.FC<Props> = ({ onConfirm, tagLimit = 5 }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleAddTag = () => {
    const trimmed = currentTag.trim();

    if (!trimmed) return;

    if (tags.includes(trimmed)) {
      setError("Tag already added.");
      return;
    }

    if (tags.length >= tagLimit) {
      setError(`You can only add up to ${tagLimit} tags.`);
      return;
    }

    setTags([...tags, trimmed]);
    setCurrentTag("");
    setError("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setError(""); // Clear error if applicable
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm(tags);
    setIsPopupOpen(false);
  };

  return (
    <section className={styles.container}>
      <button className={styles.button} onClick={() => setIsPopupOpen(true)}>
        Add Tags
      </button>

      {isPopupOpen && (
        <section className={styles.popupOverlay} role="dialog" aria-modal="true" aria-labelledby="tag-dialog-title">
          <section className={styles.popup}>
            <header>
              <h3 id="tag-dialog-title">Describe your artwork (max {tagLimit} tags)</h3>
            </header>

            <section className={styles.inputRow}>
              <input
                type="text"
                placeholder="Enter a tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                className={styles.input}
                disabled={tags.length >= tagLimit}
              />
              <button
                className={styles.addButton}
                onClick={handleAddTag}
                disabled={tags.length >= tagLimit}
              >
                Add
              </button>
            </section>

            {error && <p className={styles.error}>{error}</p>}

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
              <button className={styles.confirmButton} onClick={handleConfirm}>
                Confirm
              </button>
            </footer>
          </section>
        </section>
      )}
    </section>
  );
};

export default AddTagsButton;
