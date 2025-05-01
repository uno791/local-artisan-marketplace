import { useState } from "react";
import Header from "../components/SellerHomeComp/Header";
import FilterBar from "../components/SellerHomeComp/FilterBar";
import ProductCard from "../components/SellerHomeComp/ProductCard";
import { products } from "../components/SellerHomeComp/Product";
import styles from "../components/SellerHomeComp/SellerHome.module.css";

function SellerHome() {
  const [category, setCategory] = useState("All");

  const filteredProducts =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <>
      <Header />
      <div className={styles.pageContent}>
        <FilterBar selectedCategory={category} onSelectCategory={setCategory} />
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}

export default SellerHome;
