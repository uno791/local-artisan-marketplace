// src/components/AddProductPageComp/AddTagsButton.tsx

import React, { useState } from "react";
import styles from "../EditProductPageComp/EditTagsButton.module.css";

interface Props {
  onConfirm?: (tags: string[]) => void;
  tagLimit?: number;
  initialTags?: string[];
}

const AddTagsButton: React.FC<Props> = ({ onConfirm, tagLimit = 5, initialTags = [] }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>(initialTags);
  const [error, setError] = useState("");

  const handleAddTag = () => {
    const trimmed = currentTag.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return setError("Tag already added.");
    if (tags.length >= tagLimit) return setError(`Max ${tagLimit} tags allowed.`);

    setTags([...tags, trimmed]);
    setCurrentTag("");
    setError("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
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
        <section
          className={styles.popupOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tag-dialog-title"
        >
          <section className={styles.popup}>
            <h3 id="tag-dialog-title">Describe your artwork (max {tagLimit})</h3>

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
                    aria-label={`remove-${tag}`}
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

export default AddTagsButton;
