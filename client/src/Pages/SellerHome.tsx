import { useEffect, useState } from "react";
import Header from "../components/SellerHomeComp/Header";
import FilterBar from "../components/SellerHomeComp/FilterBar";
import ProductCard from "../components/SellerHomeComp/ProductCard";
import styles from "../components/SellerHomeComp/SellerHome.module.css";
import { baseURL } from "../config";
import axios from "axios";
import { useUser } from "../Users/UserContext";
import { Link } from "react-router-dom";

// product type definition

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image?: string;
}

// artisan type definition
interface Artisan {
  shop_name: string;
  bio: string;
  shop_pfp: string;
  shop_address: string;
  shop_banner: string;
}

// main seller home component
function SellerHome() {
  // get current user
  const { user } = useUser();

  // define state variables
  const [username] = useState(user?.username || "");
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [category, setCategory] = useState("All");
  const [gridProducts, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [errorPopup, setErrorPopup] = useState("");


  // fetch artisan and product data
  useEffect(() => {
    if (!username) return;

    axios
      .get(`${baseURL}/seller-dashboard`, { params: { username } })
      .then((res) => {
        const { artisan, products } = res.data;
        setArtisan(artisan);
        setProducts(products);

        const uniqueCategories: string[] = Array.from(
          new Set(
            Array.isArray(products)
              ? products.map((p: Product) => p.category || "Uncategorized")
              : []
          )
        );

        setCategories(["All", ...uniqueCategories.filter(Boolean)]);
      })
      .catch((err) => console.error("Error loading seller dashboard:", err));
  }, [username]);

  const handleDelete = async (id: number) => {
  try {
    await axios.delete(`${baseURL}/delete-product/${id}`);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  } catch (err) {
    console.error("Failed to delete product:", err);
    setErrorPopup("Something went wrong while deleting the product. Please try again.");
  }
};


  const filteredProducts =
    category === "All"
      ? gridProducts
      : gridProducts.filter((p) => p.category === category);

  return (
    <>
      {/* seller header */}
      {artisan && <Header artisan={artisan} />}

      <main className={styles.pageContent}>
        {/* top bar with add button and filter */}
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

        {/* product grid */}
        <section className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </section>
        {errorPopup && (
  <section className={styles.popupOverlay}>
    <article className={styles.popup}>
      <h2>Error</h2>
      <p>{errorPopup}</p>
      <button onClick={() => setErrorPopup("")}>Close</button>
    </article>
  </section>
)}


      </main>
    </>
  );
}

export default SellerHome;
