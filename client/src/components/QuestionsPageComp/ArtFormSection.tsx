import React from "react";
import ArtFormButton from "./ArtFormButton";
import styles from "./QuestionsPage.module.css";

// props interface
interface ArtFormSectionProps {
  selectedArtForms: string[];
  setSelectedArtForms: (forms: string[]) => void;
  availableTags: string[];
}

// component definition
const ArtFormSection: React.FC<ArtFormSectionProps> = ({
  selectedArtForms,
  setSelectedArtForms,
  availableTags,
}) => {
  return (
    <div className={styles.artFormsContainer}>
      <div className={styles.buttonRow}>
        {availableTags.map((artForm, index) => (
          <ArtFormButton
            key={index}
            label={artForm}
            isSelected={selectedArtForms.includes(artForm)}
            onClick={() => {
              const isAlreadySelected = selectedArtForms.includes(artForm);
              const updated = isAlreadySelected
                ? selectedArtForms.filter((form) => form !== artForm)
                : [...selectedArtForms, artForm];
              setSelectedArtForms(updated);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ArtFormSection;
