import "./Bio.css";
interface BioProps {
  description: string;
}

function Bio({ description }: BioProps) {
  return (
    <section className="bio-container">
      <h2 className="bio-heading">Bio:</h2>
      <p className="bio-text">{description}</p>
    </section>
  );
}

export default Bio;

/*import "./Bio.css";

function Bio() {
  return (
    <section className="bio-container">
      <h2 className="bio-heading">Bio:</h2>
      <p className="bio-text">
        I am Harshil, a passionate pen artist who draws inspiration from the
        expressive nature of animals. Each artwork reflects my deep love for
        line art and storytelling.
      </p>
    </section>
  );
}

export default Bio;*/
