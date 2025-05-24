import { useEffect, useState } from "react";
import Header from "../components/SellerHomeComp/Header";
import FilterBar from "../components/SellerHomeComp/FilterBar";
import ProductCard from "../components/SellerHomeComp/ProductCard";
import styles from "../components/SellerHomeComp/SellerHome.module.css";
import { baseURL } from "../config";
import axios from "axios";
import { useUser } from "../Users/UserContext";
import { Link } from "react-router-dom";

// Product interface for seller's products
interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image?: string;
}

// Artisan interface for seller shop info
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

    // Fetch artisan info and products for seller dashboard
    axios
      .get(`${baseURL}/seller-dashboard`, {
        params: { username },
      })
      .then((res) => {
        const { artisan, products } = res.data;
        setArtisan(artisan);
        setProducts(products);

        // Extract unique categories from products
        const uniqueCategories: string[] = Array.from(
          new Set(products.map((p: Product) => p.category || "Uncategorized"))
        );

        setCategories(["All", ...uniqueCategories]);
      })
      .catch((err) => console.error("Error loading seller dashboard:", err));
  }, [username]);

  // Filter products by selected category
  const filteredProducts =
    category === "All"
      ? gridProducts
      : gridProducts.filter((p) => p.category === category);

  return (
    <>
      {/* Render artisan header if artisan data exists */}
      {artisan && <Header artisan={artisan} />}

      <main className={styles.pageContent}>
        <section className={styles.topBar}>
          {/* Button to navigate to add new product page */}
          <Link to={"/AddProductPage"}>
            <button className={styles.addProductBtn}>Add New Product</button>
          </Link>

          {/* Category filter bar */}
          <FilterBar
            selectedCategory={category}
            onSelectCategory={setCategory}
            categories={categories}
          />
        </section>

        {/* Grid of filtered products */}
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
