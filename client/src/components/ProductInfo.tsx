import "./ProductInfo.css";
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

export default ProductInfo;
