import "./ProductPage.css";
import BackButton from "../components/BackButton";
import ProductImage from "../components/ProductImage";
import ProductInfo from "../components/ProductInfo";
import SidebarInfo from "../components/SideBarInfo";

function ProductPage() {
  return (
    <main className="product-page">
      <BackButton />

      <section className="product-main">
        <section className="product-left">
          <ProductImage />
        </section>

        <section className="product-middle">
          <ProductInfo />
        </section>

        <aside className="product-right">
          <SidebarInfo />
        </aside>
      </section>
    </main>
  );
}

export default ProductPage;
