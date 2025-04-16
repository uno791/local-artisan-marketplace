import "./ProductInfo.css";
import Heading from "./ProductInfoSubComp/Heading";
import Price from "./ProductInfoSubComp/Price";
import Bio from "./ProductInfoSubComp/Bio";
import DeliveryOption from "./ProductInfoSubComp/DeliveryOption";
import ProductDetails from "./ProductInfoSubComp/ProductDetails";
import AddToCart from "./ProductInfoSubComp/AddToCart";

interface ProductInfoProps {
  name: string;
  price: number;
  description: string;
  details: string;
}

function ProductInfo({ name, price, description, details }: ProductInfoProps) {
  return (
    <section className="product-info">
      <Heading name={name} />
      <Price price={price} />
      <Bio description={description} />
      <DeliveryOption />
      <ProductDetails detail={details} />
      <AddToCart />
    </section>
  );
}

export default ProductInfo;

/*import "./ProductInfo.css";
import Heading from "./ProductInfoSubComp/Heading";
import Price from "./ProductInfoSubComp/Price";
import Bio from "./ProductInfoSubComp/Bio";
import DeliveryOption from "./ProductInfoSubComp/DeliveryOption";
import ProductDetails from "./ProductInfoSubComp/ProductDetails";
import AddToCart from "./ProductInfoSubComp/AddToCart";

function ProductInfo() {
  return (
    <section className="product-info">
      <Heading />
      <Price />
      <Bio />
      <DeliveryOption />
      <ProductDetails />
      <AddToCart />
    </section>
  );
}

export default ProductInfo;*/
