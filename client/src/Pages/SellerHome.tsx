import { useEffect, useState } from "react";
import Header from "../components/SellerHomeComp/Header";
import FilterBar from "../components/SellerHomeComp/FilterBar";
import ProductCard from "../components/SellerHomeComp/ProductCard";
import styles from "../components/SellerHomeComp/SellerHome.module.css";
import { baseURL } from "../config";
import axios from "axios";
import { useUser } from "../Users/UserContext";

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image?: string;
}

function SellerHome() {
  const { user } = useUser();
  const [username] = useState(user?.username || "");
  const [category, setCategory] = useState("All");
  const [gridProducts, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    if (!username) return;

    axios
      .get(`${baseURL}/SellerProducts`, {
        params: { username },
      })
      .then((res) => {
        const allProducts = res.data;
        setProducts(allProducts);

        const uniqueCategories: string[] = Array.from(
          new Set(
            allProducts.map((p: Product) =>
              String(p.category || "Uncategorized")
            )
          )
        );

        setCategories(["All", ...uniqueCategories]);
      })
      .catch((err) => console.error("Error loading products:", err));
  }, [username]);

  const filteredProducts =
    category === "All"
      ? gridProducts
      : gridProducts.filter((p) => p.category === category);

  return (
    <>
      <Header />
      <div className={styles.pageContent}>
        <div className={styles.topBar}>
          <button className={styles.addProductBtn}>Add New Product</button>
          <FilterBar
            selectedCategory={category}
            onSelectCategory={setCategory}
            categories={categories}
          />
        </div>
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
