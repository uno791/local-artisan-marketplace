import "./Price.css";
interface PriceProps {
  price: number;
}

function Price({ price }: PriceProps) {
  return (
    <section className="price-container">
      <p className="product-price">R{price}</p>
    </section>
  );
}

export default Price;

/*import "./Price.css";

function Price() {
  return (
    <section className="price-container">
      <p className="product-price">R2500</p>
    </section>
  );
}

export default Price;*/
