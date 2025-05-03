import React from "react";
import styles from "./TypeOfArtSelector.module.css";

interface Props {
  TypeOfArt: string;
  setTypeOfArt: (type: string) => void;
}

const TypeOfArtSelector: React.FC<Props> = ({ TypeOfArt, setTypeOfArt }) => {
  return (
    <section className={styles.container}>
      <label><strong>Type of Art:</strong></label>
      <select
        className={styles.select}
        value={TypeOfArt}
        onChange={(e) => setTypeOfArt(e.target.value)}
      >
        <option value="" disabled hidden>None Selected</option>
        <option value="Jewellery">Jewellery</option>
        <option value="Home Decor">Home Decor</option>
        <option value="Art">Art</option>
        <option value="Pottery">Pottery</option>
        <option value="Textiles">Textiles</option>
        <option value="Woodwork">Woodwork</option>
        <option value="Leather Goods">Leather Goods</option>
        <option value="Macrame">Macrame</option>
        <option value="Candles">Candles</option>
        <option value="Stationery">Stationery</option>
        <option value="Painting">Painting</option>
        <option value="Photography">Photography</option>
        <option value="Digital Art">Digital Art</option>
        <option value="Sculpture">Sculpture</option>
      </select>
    </section>
  );
};

export default TypeOfArtSelector;
