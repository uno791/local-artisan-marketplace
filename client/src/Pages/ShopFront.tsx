import { useEffect, useState } from "react";
import Header from "../components/ShopFrontComp/Header";
import FilterBar from "../components/SellerHomeComp/FilterBar";
import ProductCard from "../components/ShopFrontComp/ProductCard";
import styles from "../components/ShopFrontComp/ShopFront.module.css";
import { baseURL } from "../config";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image?: string;
}

interface Artisan {
  shop_name: string;
  shop_pfp: string;
  bio: string;
  shop_address: string;
  shop_banner: string;
}

function getImageSrc(base64: string | undefined): string {
  if (!base64 || base64.trim() === "") return "";
  if (base64.startsWith("data:")) return base64;
  return `data:image/jpeg;base64,${base64}`;
}

function ShopFront() {
  const { username } = useParams();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);

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
  const loading = products.length === 0;
  const filteredProducts =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);
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
      {artisan && <Header artisan={artisan} isPublicView={true} />}

      <main className={styles.pageContent}>
        <section className={styles.topBar}>
          <FilterBar
            selectedCategory={category}
            onSelectCategory={setCategory}
            categories={categories}
          />
        </section>

        <section className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                image: getImageSrc(product.image),
              }}
            />
          ))}
        </section>
      </main>
    </>
  );
}

export default ShopFront;
