import React, { useState, useEffect } from "react";
import styles from "./EditTagsButton.module.css";

// props for setting initial tags, max tag limit, and confirm callback
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

  // when popup opens, load initial tags and reset input
  useEffect(() => {
    if (isPopupOpen) {
      setTags(initialTags);
      setError("");
      setCurrentTag("");
    }
  }, [isPopupOpen, initialTags]);

  // add a tag if valid and within limits
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

  // remove a tag and clear any error
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    setError("");
  };

  // confirm tags and close popup
  const handleConfirm = () => {
    if (onConfirm) onConfirm(tags);
    setIsPopupOpen(false);
  };

  return (
    // tag editor button and popup
    <section className={styles.container}>
      <button className={styles.button} onClick={() => setIsPopupOpen(true)}>
        Edit Tags
      </button>

      {/* popup with input and tag list */}
      {isPopupOpen && (
        <section
          className={styles.popupOverlay}
          role="dialog"
          aria-modal="true"
        >
          <section className={styles.popup}>
            <h3>
              please use short words to describe your artwork (max {tagLimit})
            </h3>

            {/* input row for adding a tag */}
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

            {/* show error if any */}
            {error && <p className={styles.error}>{error}</p>}

            {/* list of current tags with remove buttons */}
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

            {/* confirm and close button */}
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
