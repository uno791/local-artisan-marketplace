import { useEffect, useState } from "react";
import Header from "../components/SellerHomeComp/Header";
import FilterBar from "../components/SellerHomeComp/FilterBar";
import ProductCard from "../components/SellerHomeComp/ProductCard";
import styles from "../components/SellerHomeComp/SellerHome.module.css";
import { baseURL } from "../config";
import axios from "axios";
import { useUser } from "../Users/UserContext";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image?: string;
}

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
  const [errorPopup, setErrorPopup] = useState("");
  const [loading, setLoading] = useState(true); // ✅ FIXED loading state

  useEffect(() => {
    if (!username) return;

    setLoading(true); // ✅ Show spinner while fetching

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
      .catch((err) => console.error("Error loading seller dashboard:", err))
      .finally(() => setLoading(false)); // ✅ Always hide spinner
  }, [username]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${baseURL}/delete-product/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      setErrorPopup(
        "Something went wrong while deleting the product. Please try again."
      );
    }
  };

  const filteredProducts =
    category === "All"
      ? gridProducts
      : gridProducts.filter((p) => p.category === category);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className={styles.hourglassBackground}>
          <div className={styles.hourglassContainer}>
            <div className={styles.hourglassCurves}></div>
            <div className={styles.hourglassCapTop}></div>
            <div className={styles.hourglassGlassTop}></div>
            <div className={styles.hourglassSand}></div>
            <div className={styles.hourglassSandStream}></div>
            <div className={styles.hourglassCapBottom}></div>
            <div className={styles.hourglassGlass}></div>
          </div>
        </div>
      </div>
    );
  }

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
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p
              style={{ textAlign: "center", width: "100%", marginTop: "2rem" }}
            >
              You haven't added any products yet.
            </p>
          )}
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
