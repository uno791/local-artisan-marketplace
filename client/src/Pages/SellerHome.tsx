import { useEffect, useState } from "react";
import Header from "../components/SellerHomeComp/Header";
import FilterBar from "../components/SellerHomeComp/FilterBar";
import ProductCard from "../components/SellerHomeComp/ProductCard";
import styles from "../components/SellerHomeComp/SellerHome.module.css";
import { baseURL } from "../config";
import axios from "axios";
import { useUser } from "../Users/UserContext";
import { Link } from "react-router-dom";
//product per
interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image?: string;
}
//artisan
interface Artisan {
  shop_name: string;
  bio: string;
  shop_pfp: string;
  shop_address: string;
  shop_banner: string;
}

function SellerHome() {
  const { user } = useUser();
  const [username] = useState(user?.username || "");
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [category, setCategory] = useState("All");
  const [gridProducts, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    if (!username) return;

    axios
      .get(`${baseURL}/seller-dashboard`, {
        params: { username },
      })
      .then((res) => {
        const { artisan, products } = res.data;
        setArtisan(artisan);
        setProducts(products);

        const uniqueCategories: string[] = Array.from(
          new Set(products.map((p: Product) => p.category || "Uncategorized"))
        );

        setCategories(["All", ...uniqueCategories]);
      })
      .catch((err) => console.error("Error loading seller dashboard:", err));
  }, [username]);
  //filter by category
  const filteredProducts =
    category === "All"
      ? gridProducts
      : gridProducts.filter((p) => p.category === category);

  return (
    <>
      {artisan && <Header artisan={artisan} />}
      <main className={styles.pageContent}>
        <section className={styles.topBar}>
          <Link to={"/AddProductPage"}>
            <button className={styles.addProductBtn}>Add New Product</button>
          </Link>
          <FilterBar
            selectedCategory={category}
            onSelectCategory={setCategory}
            categories={categories}
          />
        </section>
        <section className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </main>
    </>
  );
}

export default SellerHome;
