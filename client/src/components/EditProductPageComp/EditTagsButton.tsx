import React, { useState, useEffect } from "react";
import styles from "./EditTagsButton.module.css";

interface Props {
  tagLimit?: number;
  initialTags?: string[];
  onConfirm?: (tags: string[]) => void;
}

const EditTagsButton: React.FC<Props> = ({
  tagLimit = 5,
  initialTags = [],
  onConfirm,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");

  // When popup is opened, sync tags with initialTags
  useEffect(() => {
    if (isPopupOpen) {
      setTags(initialTags);
      setError("");
      setCurrentTag("");
    }
  }, [isPopupOpen, initialTags]);

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
    setError(""); // clear error if removing lets user add again
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm(tags);
    setIsPopupOpen(false);
  };

  return (
    <section className={styles.container}>
      <button className={styles.button} onClick={() => setIsPopupOpen(true)}>
        Edit Tags
      </button>

      {isPopupOpen && (
        <section className={styles.popupOverlay} role="dialog" aria-modal="true">
          <section className={styles.popup}>
            <h3>Please use short words to describe your artwork (Max {tagLimit})</h3>
            <div className={styles.inputRow}>
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
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <ul className={styles.tagList}>
              {tags.map((tag, index) => (
                <li key={index} className={styles.tagItem}>
                  {tag}
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <button className={styles.confirmButton} onClick={handleConfirm}>
              Confirm
            </button>
          </section>
        </section>
      )}
    </section>
  );
};

export default EditTagsButton;
