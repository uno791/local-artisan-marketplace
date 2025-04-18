import React from "react";
import ArtFormButton from "./ArtFormButton";
import styles from "./QuestionsPage.module.css";

interface ArtFormSectionProps {
  selectedArtForms: string[];
  setSelectedArtForms: (forms: string[]) => void;
}

const ArtFormSection: React.FC<ArtFormSectionProps> = ({
  selectedArtForms,
  setSelectedArtForms,
}) => {
  const artForms = [
    [
      "Painting",
      "Sculpture",
      "Pottery",
      "Photography",
      "Digital Art",
      "Printmaking",
      "Textile Art",
    ],
    [
      "Glass Art",
      "Ceramics",
      "Drawing",
      "Installation Art",
      "Pixel Art",
      "Street Art",
    ],
    [
      "Mixed Media",
      "Illustration",
      "Calligraphy",
      "Metal Arts",
      "Wood Crafting",
      "Jewelry Making",
    ],
    ["Film & Video"],
  ];

  return (
    <div className={styles.artFormsContainer}>
      {artForms.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.buttonRow}>
          {row.map((artForm, index) => (
            <ArtFormButton
              key={`${rowIndex}-${index}`}
              label={artForm}
              isSelected={selectedArtForms.includes(artForm)} // ✅ add this
              onClick={() => {
                let isAlreadySelected = selectedArtForms.includes(artForm);
                let updated = isAlreadySelected
                  ? selectedArtForms.filter((form) => form !== artForm)
                  : [...selectedArtForms, artForm];
                setSelectedArtForms(updated);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ArtFormSection;
