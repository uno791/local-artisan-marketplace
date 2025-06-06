import styles from "../components/HomePageComp/Home.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config";
import { useUser } from "../Users/UserContext";

interface Product {
  username: string;
  product_id: number;
  product_name: string;
  description: string;
  price: number;
  image_url: string;
}

// Retry helper
async function retryRequest<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (retries === 0) throw err;
    console.warn(`🔁 Retrying... attempts left: ${retries}`);
    await new Promise((res) => setTimeout(res, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
}

function Home() {
  const [gridProducts, setProducts] = useState<Product[]>([]);
  const [shopNames, setShopNames] = useState<Record<string, string>>({}); // ✅ NEW: map username → shop name
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.username) return;

    setLoading(true);

    retryRequest(() =>
      axios.get(`${baseURL}/homepage-recommendations`, {
        params: { username: user.username },
      })
    )
      .then(async (res) => {
        const products: Product[] = res.data;
        setProducts(products);

        const shopMap: Record<string, string> = {};
        await Promise.all(
          [...new Set(products.map((p) => p.username))].map(async (uname) => {
            const username = String(uname); // ✅ FIX: Cast to string to avoid TS error
            try {
              const res = await retryRequest(() =>
                axios.get(`${baseURL}/artisan/${username}`)
              );
              shopMap[username] = res.data.shop_name || username;
            } catch {
              shopMap[username] = username;
            }
          })
        );

        setShopNames(shopMap);
      })
      .catch((err) => console.error("❌ Error loading recommendations:", err))
      .finally(() => setLoading(false));

    // Preload profile cache
    const cacheKey = `profileData:${user.username}`;
    if (!localStorage.getItem(cacheKey)) {
      retryRequest(() => axios.get(`${baseURL}/getuser/${user.username}`))
        .then(async (res) => {
          const data = res.data;
          let sellerStatus: "none" | "pending" | "approved" = "none";
          try {
            const art = await retryRequest(() =>
              axios.get(`${baseURL}/artisan/${user.username}`)
            );
            sellerStatus = art.data?.verified === 1 ? "approved" : "pending";
          } catch {
            sellerStatus = "none";
          }

          const profileData = {
            postalCode: data.postal_code?.toString() || "-",
            phone: data.phone_no || "",
            image: data.user_pfp || null,
            sellerStatus,
          };
          localStorage.setItem(cacheKey, JSON.stringify(profileData));
        })
        .catch((err) =>
          console.error("❌ Failed to preload profile data:", err)
        );
    }
  }, [user?.username]);

  const handleProductClick = async (productId: number) => {
    if (!user?.username) return;
    try {
      await axios.post(`${baseURL}/track-click-main`, {
        username: user.username,
        productId,
      });
      await axios.post(`${baseURL}/track-click-minor`, {
        username: user.username,
        productId,
      });
    } catch (err) {
      console.error("❌ Failed to track click:", err);
    }
  };

  return (
    <main className={styles.home}>
      <section className={styles.allProducts}>
        <h2>For you</h2>
        {loading ? (
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
        ) : (
          <ul className={styles.allProductsGrid}>
            {gridProducts.map((p, i) => (
              <li key={i} className={styles.productCard}>
                <Link
                  to={`/Product/${p.product_id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                  onClick={() => handleProductClick(p.product_id)}
                >
                  <article>
                    <figure>
                      <img src={p.image_url} alt={p.product_name} />
                      <figcaption>
                        <p className={styles.title}>{p.product_name}</p>
                        {/* ✅ CHANGED: show shop name if available */}
                        <p className={styles.artist}>
                          {shopNames[p.username] || p.username}
                        </p>
                        <p className={styles.price}>{`R${p.price}`}</p>
                      </figcaption>
                    </figure>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default Home;
