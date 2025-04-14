import "./Heading.css";
interface HeadingProps {
  name: string;
}

function Heading({ name }: HeadingProps) {
  return (
    <header className="heading-container">
      <h1 className="product-title">{name}</h1>
      <p className="product-label">Original Artwork</p>
    </header>
  );
}

export default Heading;

/*import "./Heading.css";

function Heading() {
  return (
    <header className="heading-container">
      <h1 className="product-title">Harshil pen drwing</h1>
      <p className="product-label">Original Artwork</p>
    </header>
  );
}

export default Heading;*/
